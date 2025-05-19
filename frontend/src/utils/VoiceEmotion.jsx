import { Client } from "@gradio/client";

export const voiceEmotion = async (audioBlob) => {
  try {
    const client = await Client.connect("Quanchan123abc/VoiceEmotion");

    // Call predict with endpoint first, inputs second
    const result = await client.predict("/predict", {
      audio: audioBlob,
    });

    console.log("Voice emotion result:", result);
    // The result is a string, e.g. "happy", "sad", etc.
    const emotion = result.data[0];
    return emotion;

  } catch (error) {
    console.error("Voice emotion detection failed:", error);
    return "Could not detect";
  }
};
