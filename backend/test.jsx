import React, { useState, useEffect, useRef } from 'react';
import * as faceapi from 'face-api.js'; 

// Helper function to get emoji for an emotion
const getEmotionEmoji = (emotion) => {
  const emotionMap = {
    neutral: '😐',
    happy: '😊',
    sad: '😢',
    angry: '😠',
    fearful: '😨',
    disgusted: '🤢',
    surprised: '😮',
  };
  return emotionMap[emotion] || '❓';
};

// Icons (simple SVGs for demonstration)
const PlayIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2">
    <path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
  </svg>
);

const StopIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2">
    <path fillRule="evenodd" d="M4.5 7.5a3 3 0 0 1 3-3h9a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3h-9a3 3 0 0 1-3-3v-9Z" clipRule="evenodd" />
  </svg>
);

const CameraIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 text-slate-400">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
  </svg>
);


const FacialMoodDetector = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null); // For drawing face detections

  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState("Not Started");
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectionIntervalId, setDetectionIntervalId] = useState(null);
  const [videoStream, setVideoStream] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [loadingMessage, setLoadingMessage] = useState("Loading AI models...");

  // Load models on component mount
  useEffect(() => {
    const loadModels = async () => {
      // Ensure faceapi is available on the window object
      if (!window.faceapi) {
        console.error("face-api.js not loaded. Please include it in your HTML.");
        setErrorMessage("Face detection library not loaded. Please refresh or check console.");
        setLoadingMessage("");
        return;
      }

      const MODEL_URL = '/models'; // Models should be in public/models folder
      try {
        setLoadingMessage("Loading face detector model...");
        await window.faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
        setLoadingMessage("Loading face expression model...");
        await window.faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
        // You might also want to load faceLandmark68Net for more detailed analysis if needed
        // await window.faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
        setModelsLoaded(true);
        setLoadingMessage("");
        console.log("Models loaded successfully");
      } catch (error) {
        console.error("Error loading models:", error);
        setErrorMessage("Failed to load AI models. Please refresh the page.");
        setLoadingMessage("");
      }
    };
    loadModels();

    // Cleanup function to stop video and clear interval when component unmounts
    return () => {
      if (detectionIntervalId) clearInterval(detectionIntervalId);
      if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []); // Empty dependency array ensures this runs only once

  const startVideoStream = async () => {
    if (!videoRef.current) return false; // Added return false for clarity
    try {
      setErrorMessage(""); // Clear previous errors
      const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
      videoRef.current.srcObject = stream;
      setVideoStream(stream);
      // Wait for the video to start playing to get correct dimensions
      return new Promise((resolve) => {
        if (videoRef.current) { // Check if videoRef.current is still valid
            videoRef.current.onloadedmetadata = () => {
            resolve(true);
          };
        } else {
            resolve(false); // Resolve false if ref became null
        }
      });
    } catch (err) {
      console.error("Error accessing camera:", err);
      setErrorMessage("Could not access camera. Please check permissions and try again.");
      setIsDetecting(false); // Stop detection if camera access fails
      return false;
    }
  };

  const handleVideoPlay = () => {
    if (!videoRef.current || !canvasRef.current || !isDetecting || !modelsLoaded || !window.faceapi) return;

    // Match canvas dimensions to video display dimensions
    const displaySize = { width: videoRef.current.clientWidth, height: videoRef.current.clientHeight };
    window.faceapi.matchDimensions(canvasRef.current, displaySize);

    const detectMood = async () => {
      if (!videoRef.current || videoRef.current.paused || videoRef.current.ended || !isDetecting) {
        return; // Stop if video is not playing or detection is stopped
      }

      // Perform detection
      const detections = await window.faceapi.detectSingleFace(
        videoRef.current,
        new window.faceapi.TinyFaceDetectorOptions({ inputSize: 320 }) // Smaller input size for better performance
      ).withFaceExpressions(); // Add .withFaceLandmarks() if you loaded faceLandmark68Net

      // Clear previous drawings
      if (canvasRef.current) {
        const context = canvasRef.current.getContext('2d');
        if (context) {
            context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        }
      }


      if (detections && detections.expressions) {
        // Find the dominant emotion
        const sortedEmotions = Object.entries(detections.expressions).sort((a, b) => b[1] - a[1]);
        const topEmotion = sortedEmotions[0][0];
        setCurrentEmotion(topEmotion);

        // Draw detection box and expressions (optional, but good for UX)
        if (canvasRef.current && window.faceapi && window.faceapi.draw) { // Check if draw is available
            const resizedDetections = window.faceapi.resizeResults(detections, displaySize);
            // window.faceapi.draw.drawDetections(canvasRef.current, resizedDetections); // Draws the box
            // window.faceapi.draw.drawFaceExpressions(canvasRef.current, resizedDetections); // Draws expressions
        }

      } else {
        setCurrentEmotion("No face detected");
      }
    };

    // Set interval for detection
    const id = setInterval(detectMood, 700); // Adjust interval as needed (e.g., 500-1000ms)
    setDetectionIntervalId(id);
  };


  const startDetection = async () => {
    if (!modelsLoaded) {
      setErrorMessage("AI Models are not loaded yet. Please wait.");
      return;
    }
    if (!window.faceapi) {
      setErrorMessage("Face detection library not available. Please check console.");
      return;
    }
    setIsDetecting(true);
    setCurrentEmotion("Initializing...");
    const videoStarted = await startVideoStream();
    if (videoStarted && videoRef.current) {
        // The handleVideoPlay function, which starts the interval,
        // will be called once the video's onPlay event fires.
        // We ensure the video is playing before calling it.
        if (videoRef.current.paused) {
            videoRef.current.play().catch(e => {
                console.error("Error playing video:", e);
                setErrorMessage("Could not start video playback.");
                setIsDetecting(false);
            });
        } else {
             // If already playing (e.g. autoplay), directly call handleVideoPlay
            handleVideoPlay();
        }
    } else if (!videoStarted) {
        // If video did not start (e.g. permission denied), ensure detection is off
        setIsDetecting(false);
        setCurrentEmotion("Camera error");
    }
  };

  const stopDetection = () => {
    setIsDetecting(false);
    if (detectionIntervalId) {
      clearInterval(detectionIntervalId);
      setDetectionIntervalId(null);
    }
    if (videoStream) {
      videoStream.getTracks().forEach(track => track.stop());
      setVideoStream(null);
    }
    if (videoRef.current) {
        videoRef.current.srcObject = null;
    }
    // Clear canvas
    if (canvasRef.current) {
        const context = canvasRef.current.getContext('2d');
        if (context) {
            context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        }
    }
    setCurrentEmotion("Stopped");
  };

  // Dynamic classes for emotion display
  const emotionTextColor = () => {
    switch (currentEmotion) {
      case 'happy': return 'text-green-500';
      case 'sad': return 'text-blue-500';
      case 'angry': return 'text-red-600';
      case 'surprised': return 'text-yellow-500';
      case 'fearful': return 'text-purple-500';
      case 'disgusted': return 'text-lime-600';
      default: return 'text-slate-700 dark:text-slate-300';
    }
  };


  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex flex-col items-center justify-center p-4 font-sans">
      <div className="bg-white dark:bg-slate-800 shadow-xl rounded-xl p-6 md:p-8 w-full max-w-2xl">
        <header className="text-center mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-indigo-600 dark:text-indigo-400">
            Facial Mood Detector
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Let's see how you're feeling!
          </p>
        </header>

        {/* Loading/Error Messages */}
        {loadingMessage && !modelsLoaded && (
          <div className="my-4 p-3 bg-blue-100 dark:bg-blue-900 border border-blue-300 dark:border-blue-700 rounded-md text-center text-blue-700 dark:text-blue-300">
            <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {loadingMessage}
            </div>
          </div>
        )}
        {errorMessage && (
          <div className="my-4 p-3 bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-700 rounded-md text-center text-red-700 dark:text-red-300">
            {errorMessage}
          </div>
        )}

        {/* Video Feed Area */}
        <div className="relative w-full aspect-video bg-slate-200 dark:bg-slate-700 rounded-lg overflow-hidden border-2 border-indigo-300 dark:border-indigo-500 mx-auto max-w-md">
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline /* Important for iOS */
            onPlay={handleVideoPlay} // Start detection when video actually starts playing
            className="w-full h-full object-cover"
          />
          {/* Canvas for drawing face detections - positioned over the video */}
          <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />

          {!isDetecting && !videoStream && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-200 dark:bg-slate-700 bg-opacity-80 dark:bg-opacity-80">
              <CameraIcon />
              <p className="mt-2 text-slate-600 dark:text-slate-300">Camera is off</p>
            </div>
          )}
        </div>

        {/* Emotion Display */}
        <div className="mt-6 text-center">
          <p className={`text-2xl font-semibold transition-colors duration-300 ${emotionTextColor()}`}>
            <span className="text-4xl mr-2">{getEmotionEmoji(currentEmotion)}</span>
            {typeof currentEmotion === 'string' ? currentEmotion.charAt(0).toUpperCase() + currentEmotion.slice(1) : 'Unknown'}
          </p>
        </div>

        {/* Controls */}
        <div className="mt-8 flex flex-col sm:flex-row justify-center items-center space-y-3 sm:space-y-0 sm:space-x-4">
          {!isDetecting ? (
            <button
              onClick={startDetection}
              disabled={!modelsLoaded || isDetecting}
              className="w-full sm:w-auto flex items-center justify-center px-8 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-400 dark:disabled:bg-slate-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
            >
              <PlayIcon />
              Start Detection
            </button>
          ) : (
            <button
              onClick={stopDetection}
              className="w-full sm:w-auto flex items-center justify-center px-8 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
            >
              <StopIcon />
              Stop Detection
            </button>
          )}
        </div>
         <p className="text-xs text-slate-400 dark:text-slate-500 mt-8 text-center">
            Note: Detection accuracy may vary. Ensure good lighting and a clear view of your face.
        </p>
      </div>
    </div>
  );
};
export default FacialMoodDetector;