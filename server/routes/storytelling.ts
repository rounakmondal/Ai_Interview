import { RequestHandler } from "express";

/**
 * Story Telling API Route
 * Generates a rich Bengali narrative about any historical/educational topic.
 * Uses your own AI API key via environment variables (OpenAI-compatible format).
 *
 * Required env vars:
 *   AI_API_KEY   — your secret API key
 *   AI_API_URL   — (optional) base URL, defaults to https://api.openai.com/v1
 *   AI_MODEL     — (optional) model name, defaults to gpt-4o-mini
 */

const AI_API_KEY = process.env.AI_API_KEY;
const AI_API_URL = (process.env.AI_API_URL ?? "https://api.openai.com/v1").replace(/\/$/, "");
const AI_MODEL = process.env.AI_MODEL ?? "gpt-4o-mini";

const SYSTEM_PROMPT = `তুমি একজন অসাধারণ বাংলা গল্পকার এবং ইতিহাসবিদ। তোমার কণ্ঠে ইতিহাস জীবন্ত হয়ে ওঠে।

তোমার ভূমিকা:
- তুমি শুধু বাংলায় উত্তর দাও
- প্রতিটি গল্প সত্য তথ্যের উপর ভিত্তি করে তৈরি
- ভাষা সাহিত্যিক, সুন্দর কিন্তু সহজবোধ্য
- গল্পের ভঙ্গি — যেন একজন রাজদরবারের গল্পকার সন্ধ্যার আলোয় গল্প শোনাচ্ছেন
- প্রতিটি গল্পে: জাদুকরী ভূমিকা → জীবন্ত ঘটনার বর্ণনা → চরিত্রের আবেগ → গভীর উপসংহার
- ৩০০ থেকে ৫০০ শব্দের মধ্যে
- কোনো markdown, asterisk, বা বিশেষ চিহ্ন ছাড়া — শুধু সাধারণ গদ্য
- শোনার জন্য উপযুক্ত — প্রতিটি বাক্য যেন কানে সুর হয়ে বাজে`;

export const handleStoryTelling: RequestHandler = async (req, res) => {
  try {
    const { topic } = req.body as { topic: string };

    if (!topic?.trim()) {
      return res.status(400).json({ error: "Topic is required" });
    }

    if (!AI_API_KEY) {
      return res.json({
        story: `আপনি "${topic}" সম্পর্কে জানতে চেয়েছেন। গল্পটি শুনতে, অনুগ্রহ করে সার্ভারে AI_API_KEY পরিবেশ চলক সেট করুন। পলাশীর যুদ্ধ, মোগল সাম্রাজ্য, রবীন্দ্রনাথ — যেকোনো বিষয়ে আমাকে জিজ্ঞেস করুন, আমি বাংলায় গল্প শুনিয়ে দেব।`,
      });
    }

    const aiRes = await fetch(`${AI_API_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${AI_API_KEY}`,
      },
      body: JSON.stringify({
        model: AI_MODEL,
        temperature: 0.92,
        top_p: 0.95,
        max_tokens: 1200,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          {
            role: "user",
            content: `এই বিষয়ে বাংলায় একটি গল্প বলো: ${topic}`,
          },
        ],
      }),
    });

    if (!aiRes.ok) {
      const errBody = await aiRes.text();
      throw new Error(`AI API ${aiRes.status}: ${errBody}`);
    }

    const data = await aiRes.json();
    const story: string | undefined =
      data.choices?.[0]?.message?.content;

    if (!story) {
      throw new Error("No story returned from AI API");
    }

    res.json({ story: story.trim() });
  } catch (error) {
    console.error("Story generation error:", error);
    res.status(500).json({
      error: "গল্প তৈরিতে সমস্যা হয়েছে",
      story:
        "দুঃখিত, এই মুহূর্তে গল্পটি তৈরি করা সম্ভব হচ্ছে না। একটু পরে আবার চেষ্টা করুন।",
    });
  }
};
