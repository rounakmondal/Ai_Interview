import fetch from "node-fetch";
import cron from "node-cron";

const SUBJECTS = ["police", "wbcs", "wbpsc"];
const URL = "https://recomendengine.onrender.com/daily-post";

function getRequestBody(subject: string) {
  return {
    subject,
    num_questions: 50,
    top_n: 10,
  };
}

async function postDaily(subject: string) {
  try {
    const res = await fetch(URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(getRequestBody(subject)),
    });
    const data = await res.text();
    console.log(`[DailyPost] Sent for subject: ${subject}, status: ${res.status}, response:`, data);
  } catch (err) {
    console.error(`[DailyPost] Error for subject: ${subject}`, err);
  }
}

function scheduleDailyPosts() {
  // 7:00 AM, 12:00 PM, 6:00 PM
  const times = [
    { cron: "0 7 * * *", label: "morning" },
    { cron: "0 12 * * *", label: "noon" },
    { cron: "0 18 * * *", label: "evening" },
  ];
  times.forEach(({ cron: cronTime }, i) => {
    cron.schedule(cronTime, () => {
      // Rotate subject each time
      const subject = SUBJECTS[i % SUBJECTS.length];
      postDaily(subject);
    });
  });
}

export { scheduleDailyPosts };