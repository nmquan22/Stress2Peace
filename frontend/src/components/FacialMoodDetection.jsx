import React, { useRef, useState } from "react";
import * as faceapi from "face-api.js";

const FacialMoodDetector = () => {
  const videoRef = useRef();
  const [emotion, setEmotion] = useState("Not started");
  const [detecting, setDetecting] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
  const [stream, setStream] = useState(null);

  const loadModels = async () => {
    const MODEL_URL = "/models";
    await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
    await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
  };

  const startVideo = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = mediaStream;
      setStream(mediaStream);
    } catch (err) {
      console.error("Error accessing camera:", err);
    }
  };

  const detectMood = async () => {
    if (!videoRef.current) return;

    const result = await faceapi
      .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
      .withFaceExpressions();

    if (result?.expressions) {
      const sorted = Object.entries(result.expressions).sort((a, b) => b[1] - a[1]);
      const topEmotion = sorted[0][0];
      setEmotion(topEmotion);
    }
  };

  const startDetection = async () => {
    setEmotion("Analyzing...");
    await loadModels();
    await startVideo();
    const id = setInterval(detectMood, 1000);
    setIntervalId(id);
    setDetecting(true);
  };

  const stopDetection = () => {
    if (intervalId) clearInterval(intervalId);
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    setEmotion("Stopped");
    setDetecting(false);
    setIntervalId(null);
    setStream(null);
  };

  return (
    <div className="p-8 max-w-xl mx-auto text-center">
      <h1 className="text-3xl font-bold mb-6 text-indigo-600">Facial Mood Detection</h1>

      <video
        ref={videoRef}
        autoPlay
        muted
        width="320"
        height="240"
        className="mx-auto rounded-lg border-4 border-indigo-300"
      />

      <p className="mt-6 text-lg text-gray-700">
        Current Emotion:{" "}
        <span className="font-bold text-indigo-600 capitalize">{emotion}</span>
      </p>

      <div className="mt-6 space-x-4">
        {!detecting ? (
          <button
            onClick={startDetection}
            className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Start Detection
          </button>
        ) : (
          <button
            onClick={stopDetection}
            className="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Stop Detection
          </button>
        )}
      </div>
    </div>
  );
};

export default FacialMoodDetector;
