import { RequestHandler } from "express";
import { PollyClient, SynthesizeSpeechCommand, Engine, VoiceId } from "@aws-sdk/client-polly";

type VoiceGender = "male" | "female";

// Neural voices; Hindi/Bengali have limited male neural options — Kajal used for both genders.
function resolvePollyVoice(
  language: string,
  voiceGender: VoiceGender = "male",
): { voiceId: VoiceId; engine: Engine } {
  const male = voiceGender === "male";
  switch (language) {
    case "en-GB":
      return male
        ? { voiceId: "Brian", engine: "neural" }
        : { voiceId: "Amy", engine: "neural" };
    case "hi-IN":
    case "bn-IN":
      return { voiceId: "Kajal", engine: "neural" };
    case "en-US":
    default:
      return male
        ? { voiceId: "Matthew", engine: "neural" }
        : { voiceId: "Joanna", engine: "neural" };
  }
}

function getPollyClient() {
  return new PollyClient({
    region: process.env.AWS_REGION || "us-east-1",
  });
}

/**
 * POST /api/tts
 * Body: { text: string, language?: string, voiceGender?: "male" | "female" }
 * Returns: audio/mpeg binary stream
 */
export const handleTTS: RequestHandler = async (req, res) => {
  try {
    const { text, language = "en-US", voiceGender = "male" } = req.body;

    if (!text || typeof text !== "string" || text.trim().length === 0) {
      res.status(400).json({ error: "text is required" });
      return;
    }

    if (text.length > 3000) {
      res.status(400).json({ error: "Text too long. Max 3000 characters." });
      return;
    }

    const gender: VoiceGender =
      voiceGender === "female" ? "female" : "male";
    const voiceConfig = resolvePollyVoice(language, gender);
    const polly = getPollyClient();

    const command = new SynthesizeSpeechCommand({
      Text: text,
      OutputFormat: "mp3",
      VoiceId: voiceConfig.voiceId,
      Engine: voiceConfig.engine,
    });

    const response = await polly.send(command);

    if (!response.AudioStream) {
      res.status(500).json({ error: "No audio returned from Polly" });
      return;
    }

    res.set({
      "Content-Type": "audio/mpeg",
      "Cache-Control": "public, max-age=86400",
    });

    const audioStream = response.AudioStream as NodeJS.ReadableStream;
    audioStream.pipe(res);
  } catch (err: any) {
    console.error("Polly TTS error:", err);
    res.status(500).json({ error: err.message || "TTS generation failed" });
  }
};
