export class VoiceService {
  private apiKey: string | undefined;
  // A standard legible voice ID for Regen Eliza (e.g., 'Eleanor' or similar). 
  // '21m00Tcm4TlvDq8ikWAM' is Rachel.
  private voiceId: string = "21m00Tcm4TlvDq8ikWAM";

  constructor(apiKey?: string) {
    this.apiKey = apiKey;
  }

  /**
   * Generates and plays synthesized speech for the given text.
   * Uses ElevenLabs Text-to-Speech REST API.
   * @param text The text to be spoken
   */
  async speak(text: string): Promise<void> {
    try {
      console.log(`[Regen Eliza Voice]: "${text}"`);
      
      if (!this.apiKey) {
        console.warn("VITE_ELEVENLABS_API_KEY is not defined. Skipping audio synthesis.");
        return;
      }

      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${this.voiceId}`, {
        method: "POST",
        headers: {
          "Accept": "audio/mpeg",
          "xi-api-key": this.apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_monolingual_v1",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5
          }
        }),
      });

      if (!response.ok) {
        throw new Error(`ElevenLabs API error: ${response.status} ${response.statusText}`);
      }

      const arrayBuffer = await response.arrayBuffer();

      // Check if TalkingHead exists and is initialized
      const talkingHead = (window as any).talkingHead;
      
      if (talkingHead) {
        try {
          // Decode audio buffer and let TalkingHead handle playback + visemes
          const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
          const decodedAudio = await audioContext.decodeAudioData(arrayBuffer);
          await talkingHead.speakAudio(decodedAudio);
          return;
        } catch (err) {
          console.error("TalkingHead speakAudio failed, falling back to native Audio:", err);
        }
      }

      // Fallback: Normal playback
      const audioBlob = new Blob([arrayBuffer], { type: 'audio/mpeg' });
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      
      return new Promise<void>((resolve) => {
        audio.onended = () => {
          URL.revokeObjectURL(audioUrl);
          resolve();
        };
        audio.play().catch(err => {
          console.error("Audio playback was prevented by browser auto-play policy or an error occurred:", err);
          resolve();
        });
      });
    } catch (error) {
      console.error("VoiceService failed to synthesize or play audio:", error);
    }
  }
}

// Export a singleton instance initialized with the environment variable
// Support both Vite (import.meta.env) and Next.js (process.env)
const getApiKey = () => {
  if (typeof process !== "undefined" && process.env && process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY) {
    return process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY;
  }
  try {
    // @ts-ignore
    if (import.meta && import.meta.env && import.meta.env.VITE_ELEVENLABS_API_KEY) {
      // @ts-ignore
      return import.meta.env.VITE_ELEVENLABS_API_KEY;
    }
  } catch (e) {
    // ignore
  }
  return "";
};
export const voiceService = new VoiceService(getApiKey());
