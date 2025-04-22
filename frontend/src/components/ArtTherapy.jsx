import { useState, useRef } from "react";
import { motion } from "framer-motion";
import html2canvas from "html2canvas";
import axios from "axios";

const EMOTIONS = ["Calm", "Happy", "Sad", "Inspired"];

export default function ArtTherapy() {
  const [emotion, setEmotion] = useState("Calm");
  const [prompt, setPrompt] = useState("");
  const [aiImage, setAiImage] = useState(null);
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawingData, setDrawingData] = useState(null);

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const generateAIImage = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/generate-image",
        { prompt: `${emotion} + ${prompt}` },
        { responseType: "blob" }
      );

      const imageUrl = URL.createObjectURL(response.data);
      setAiImage(imageUrl);
    } catch (error) {
      console.error("Image generation failed", error);
    }
  };

  const saveJournal = async () => {
    const canvas = canvasRef.current;
    const drawingImage = canvas.toDataURL("image/png");
    const container = document.getElementById("journal-section");

    html2canvas(container).then((canvas) => {
      const link = document.createElement("a");
      link.download = `journal-${new Date().toISOString()}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    });
  };

  return (
    <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-4">
        <h1 className="text-xl font-bold">🎨 Art Therapy Session</h1>

        <select
          value={emotion}
          onChange={(e) => setEmotion(e.target.value)}
          className="p-2 rounded border"
        >
          {EMOTIONS.map((e) => (
            <option key={e} value={e}>{e}</option>
          ))}
        </select>

        <input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Add a prompt (e.g., peaceful forest)"
          className="w-full p-2 border rounded"
        />

        <button
          onClick={generateAIImage}
          className="bg-indigo-500 text-white px-4 py-2 rounded"
        >
          ✨ Generate AI Image
        </button>

        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          className="border rounded shadow-lg bg-white"
        ></canvas>

        <button
          onClick={saveJournal}
          className="bg-green-600 text-white px-4 py-2 rounded mt-2"
        >
          📥 Save as Journal Page
        </button>
      </div>

      <div id="journal-section" className="space-y-4">
        <h2 className="text-lg font-semibold">🖼️ AI-Generated Image</h2>
        {aiImage && (
          <img
            src={aiImage}
            alt="AI Result"
            className="rounded shadow-lg w-full"
          />
        )}
        <p className="text-sm text-gray-500">
          Emotion: <strong>{emotion}</strong><br />
          Prompt: <strong>{prompt}</strong><br />
          Date: {new Date().toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
