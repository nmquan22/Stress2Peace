import { Client } from "@gradio/client";

export const detectEmotion = async (input) => {
  try {
    const client = await Client.connect("Quanchan123abc/emotion-detect");
      const result = await client.predict("/predict", { 		
		      text: [input], 
    });

      console.log(result.data);
      const emotion = result.data[0]["label"];
      return emotion;
  } catch (error) {
    console.error("Emotion detection failed:", error);
    return "Could not detect mood";
  }
};