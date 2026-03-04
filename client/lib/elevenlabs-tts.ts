/**
 * ElevenLabs TTS Service for Natural Voice Generation
 * Provides realistic, human-like voice for interview experience
 */

const ELEVENLABS_API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY;
const ELEVENLABS_API_URL = "https://api.elevenlabs.io/v1";

// Voice IDs for different languages (ElevenLabs pre-made voices)
const VOICE_IDS = {
  "en-US": "21m00Tcm4TlvDq8ikWAM", // Rachel - professional female
  "en-GB": "N2lVS1w4EtoT3dr4eOWO", // Callum - professional male
  "hi-IN": "21m00Tcm4TlvDq8ikWAM", // Will use English voice with Hindi (multilingual)
  "bn-IN": "21m00Tcm4TlvDq8ikWAM", // Will use English voice with Bengali
};

interface ElevenLabsOptions {
  text: string;
  voiceId?: string;
  language?: string;
  stability?: number; // 0-1, how stable/consistent the voice is
  similarityBoost?: number; // 0-1, how much to match the original voice
  style?: number; // 0-1, expressiveness
  useSpeakerBoost?: boolean;
}

/**
 * Generate speech audio using ElevenLabs API
 */
export async function generateElevenLabsSpeech(
  options: ElevenLabsOptions
): Promise<Blob> {
  const {
    text,
    language = "en-US",
    stability = 0.5,
    similarityBoost = 0.75,
    style = 0.3,
    useSpeakerBoost = true,
  } = options;

  // Use appropriate voice for language
  let voiceId = options.voiceId || VOICE_IDS[language as keyof typeof VOICE_IDS] || VOICE_IDS["en-US"];

  if (!ELEVENLABS_API_KEY) {
    throw new Error("ElevenLabs API key not configured");
  }

  const url = `${ELEVENLABS_API_URL}/text-to-speech/${voiceId}`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "xi-api-key": ELEVENLABS_API_KEY,
    },
    body: JSON.stringify({
      text,
      model_id: "eleven_multilingual_v2",
      voice_settings: {
        stability,
        similarity_boost: similarityBoost,
        style,
        use_speaker_boost: useSpeakerBoost,
      },
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`ElevenLabs API error: ${error}`);
  }

  return await response.blob();
}

/**
 * Convert audio blob to playable URL
 */
export function blobToAudioUrl(blob: Blob): string {
  return URL.createObjectURL(blob);
}

/**
 * Cleanup audio URL when done
 */
export function revokeAudioUrl(url: string): void {
  URL.revokeObjectURL(url);
}

/**
 * Check if ElevenLabs is configured and available
 */
export function isElevenLabsAvailable(): boolean {
  return !!ELEVENLABS_API_KEY && ELEVENLABS_API_KEY !== "your_elevenlabs_api_key_here";
}

/**
 * Get available voices from ElevenLabs
 */
export async function getAvailableVoices() {
  if (!ELEVENLABS_API_KEY) {
    throw new Error("ElevenLabs API key not configured");
  }

  const response = await fetch(`${ELEVENLABS_API_URL}/voices`, {
    headers: {
      "xi-api-key": ELEVENLABS_API_KEY,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch voices");
  }

  return await response.json();
}
