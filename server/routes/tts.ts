import { RequestHandler } from "express";
import { PollyClient, SynthesizeSpeechCommand, Engine, VoiceId } from "@aws-sdk/client-polly";

// Voice mapping per language
const VOICE_MAP: Record<string, { voiceId: VoiceId; engine: Engine }> = {
  "en-US": { voiceId: "Joanna", engine: "neural" },
  "en-GB": { voiceId: "Amy", engine: "neural" },
  "hi-IN": { voiceId: "Kajal", engine: "neural" },
  "bn-IN": { voiceId: "Kajal", engine: "neural" }, // Polly doesn't have a dedicated Bengali neural voice; Kajal (Hindi) is closest
};

const DEFAULT_VOICE: { voiceId: VoiceId; engine: Engine } = {
  voiceId: "Joanna",
  engine: "neural",
};

function getPollyClient() {
  // AWS SDK v3 automatically reads credentials from:
  //   1. Environment variables: AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY
  //   2. Shared credentials file (~/.aws/credentials) set by `aws configure`
  //   3. EC2/ECS instance roles
  return new PollyClient({
    region: process.env.AWS_REGION || "us-east-1",
  });
}

/**
 * POST /api/tts
 * Body: { text: string, language?: string }
 * Returns: audio/mpeg binary stream
 */
export const handleTTS: RequestHandler = async (req, res) => {
  try {
    const { text, language = "en-US" } = req.body;

    if (!text || typeof text !== "string" || text.trim().length === 0) {
      res.status(400).json({ error: "text is required" });
      return;
    }

    // Limit text length to prevent abuse (Polly max is 3000 chars for neural)
    if (text.length > 3000) {
      res.status(400).json({ error: "Text too long. Max 3000 characters." });
      return;
    }

    const voiceConfig = VOICE_MAP[language] || DEFAULT_VOICE;
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

    // Stream the audio back to the client
    res.set({
      "Content-Type": "audio/mpeg",
      "Cache-Control": "public, max-age=86400",
    });

    // AudioStream is a Readable stream in Node.js
    const audioStream = response.AudioStream as NodeJS.ReadableStream;
    audioStream.pipe(res);
  } catch (err: any) {
    console.error("Polly TTS error:", err);
    res.status(500).json({ error: err.message || "TTS generation failed" });
  }
};
