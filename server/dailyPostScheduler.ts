import fetch from "node-fetch";
import cron from "node-cron";
import type { RequestHandler } from "express";

const SUBJECTS = ["police", "wbcs", "wbpsc"];
const POST_URL = "https://recomendengine-1.onrender.com/daily-post";

// Set your deployed server URL here (used for self-ping keep-alive)
const SELF_URL = process.env.RENDER_EXTERNAL_URL || process.env.SELF_URL || "";

function getRequestBody(subject: string) {
  return {
    subject,
    num_questions: 50,
    top_n: 10,
  };
}

async function postDaily(subject: string) {
  try {
    const res = await fetch(POST_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(getRequestBody(subject)),
    });
    const data = await res.text();
    console.log(`[DailyPost] Sent for subject: ${subject}, status: ${res.status}, response:`, data);
    return { subject, status: res.status, ok: true };
  } catch (err) {
    console.error(`[DailyPost] Error for subject: ${subject}`, err);
    return { subject, ok: false, error: String(err) };
  }
}

/** Post all subjects in parallel and return results */
async function postAllSubjects(label: string) {
  console.log(`[DailyPost] ${label} batch starting for all subjects at ${new Date().toISOString()}`);
  const results = await Promise.allSettled(SUBJECTS.map((s) => postDaily(s)));
  return results.map((r, i) => ({
    subject: SUBJECTS[i],
    ...(r.status === "fulfilled" ? r.value : { ok: false, error: String(r.reason) }),
  }));
}

// ── Self-ping keep-alive (prevents Render free-tier sleep) ───────────────
function startKeepAlive() {
  if (!SELF_URL) {
    console.log("[KeepAlive] No SELF_URL/RENDER_EXTERNAL_URL set — skip self-ping");
    return;
  }
  // Ping every 14 minutes (Render sleeps after 15 min of inactivity)
  const INTERVAL_MS = 14 * 60 * 1000;
  setInterval(async () => {
    try {
      await fetch(`${SELF_URL}/api/ping`);
      console.log(`[KeepAlive] pinged ${SELF_URL}/api/ping`);
    } catch {
      // Ignore — best effort
    }
  }, INTERVAL_MS);
  console.log(`[KeepAlive] Started self-ping every 14 min → ${SELF_URL}/api/ping`);
}

// ── Cron scheduler (IST timezone) ────────────────────────────────────────
function scheduleDailyPosts() {
  const times = [
    { cron: "0 7 * * *", label: "morning" },
    { cron: "0 12 * * *", label: "noon" },
    { cron: "0 18 * * *", label: "evening" },
  ];
  times.forEach(({ cron: cronTime, label }) => {
    cron.schedule(
      cronTime,
      () => { postAllSubjects(label); },
      { timezone: "Asia/Kolkata" },
    );
  });
  console.log("[DailyPost] Cron jobs scheduled for 7AM / 12PM / 6PM IST");

  // Start keep-alive to prevent server sleep
  startKeepAlive();
}

// ── API trigger endpoint (for external cron services like cron-job.org) ──
// GET /api/trigger-daily-post?key=YOUR_SECRET
// This lets you call from an external free cron service as a reliable fallback
const TRIGGER_SECRET = process.env.DAILY_POST_SECRET || "medhahub-daily-2026";

const handleTriggerDailyPost: RequestHandler = async (req, res) => {
  const key = req.query.key as string;
  if (key !== TRIGGER_SECRET) {
    res.status(401).json({ error: "Invalid key" });
    return;
  }
  const label = (req.query.label as string) || "external-trigger";
  const results = await postAllSubjects(label);
  res.json({ ok: true, label, timestamp: new Date().toISOString(), results });
};

export { scheduleDailyPosts, handleTriggerDailyPost };