// src/api/emotionAPI.js
import axios from "axios";
import { Client } from "@gradio/client";

export const detectEmotion = async (message) => {
  try {
    const client = await Client.connect("Quanchan123abc/emotion-detect");
    const response = await client.predict("/predict", { 		
		text: [message], 
    });
    console.log(response.data);
    
    const result = response.data?.data?.[0];
    return result; // e.g., "Detected Mood: Joy "
  } catch (error) {
    console.error("Emotion detection failed:", error);
    return "Could not detect mood 😞";
  }
};