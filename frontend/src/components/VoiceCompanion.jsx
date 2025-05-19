import React, { useState, useEffect } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { useAudioRecorder } from 'react-audio-voice-recorder';
import { voiceEmotion } from '../utils/VoiceEmotion';

const VoiceCompanion = ({ isFullscreen }) => {
  const [emotion, setEmotion] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    startRecording,
    stopRecording,
    isRecording,
    recordingBlob,
    recordingTime,
  } = useAudioRecorder({
    audioTrackConstraints: {
      noiseSuppression: true,
      echoCancellation: true,
    },
    onNotAllowedOrFound: (err) => {
      console.error('Permission denied or device not found:', err);
    },
  });

  // When recording is stopped, process the blob
  useEffect(() => {
    const processRecording = async () => {
      if (!recordingBlob) return;

      setIsLoading(true);
      setEmotion(null);
      try {
        const result = await voiceEmotion(recordingBlob);
        setEmotion(result || 'No emotion detected');
      } catch (err) {
        console.error('Emotion detection failed:', err);
        setEmotion('Could not detect');
      } finally {
        setIsLoading(false);
      }
    };

    processRecording();
  }, [recordingBlob]);

  const toggleRecording = async () => {
    if (isRecording) {
      stopRecording();
    } else {
      setEmotion(null);
      try {
        await startRecording();
      } catch (err) {
        console.error('Start recording failed:', err);
      }
    }
  };

  useEffect(() => {
  if (recordingBlob) {
    const audioURL = URL.createObjectURL(recordingBlob);
    const audio = new Audio(audioURL);
    audio.play(); // Optional: For debugging
    console.log('[Blob Size]', recordingBlob.size);
  }
}, [recordingBlob]);

  const formatTime = (s) =>
    `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  return (
    <div className={`p-8 ${isFullscreen ? 'w-screen' : 'max-w-screen-md'} mx-auto text-center`}>
      <h1 className="text-3xl font-bold mb-6 text-indigo-700">🎙️ AI Voice Companion</h1>

      {isRecording && (
        <div className="flex justify-center items-center mb-2 animate-pulse">
          <div className="w-4 h-4 rounded-full bg-red-600 mr-2"></div>
          <span className="text-red-600 font-medium">
            Recording... {formatTime(recordingTime)}
          </span>
        </div>
      )}

      <button
        onClick={toggleRecording}
        disabled={isLoading}
        className={`mx-auto p-4 rounded-full shadow-lg transition-all duration-300 ${
          isRecording ? 'bg-red-500' : 'bg-green-500'
        } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {isRecording ? (
          <MicOff className="text-white w-8 h-8" />
        ) : (
          <Mic className="text-white w-8 h-8" />
        )}
      </button>

      <p className="mt-4 text-lg text-gray-600">
        {isLoading
          ? 'Analyzing your voice...'
          : isRecording
          ? "Speak naturally. I'm listening..."
          : 'Press the mic to start recording.'}
      </p>

      {emotion && !isLoading && (
        <div className="mt-6 text-xl text-purple-700 font-semibold">
          Detected Emotion: <span className="capitalize">{emotion}</span>
        </div>
      )}
    </div>
  );
};

export default VoiceCompanion;
