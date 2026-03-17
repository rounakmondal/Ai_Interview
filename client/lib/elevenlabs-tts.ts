/**
 * AWS Polly TTS Service — calls server route /api/tts
 * Credentials stay on the server; the client just POSTs text.
 */

interface PollyTTSOptions {
  text: string;
  language?: string;
}

/**
 * Generate speech audio using the AWS Polly backend route
 */
export async function generateElevenLabsSpeech(
  options: PollyTTSOptions
): Promise<Blob> {
  const { text, language = "en-US" } = options;

  const response = await fetch("/api/tts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, language }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Polly TTS error: ${errText}`);
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
 * Polly is available as long as the server is running (no client-side key needed)
 */
export function isElevenLabsAvailable(): boolean {
  return true;
}
