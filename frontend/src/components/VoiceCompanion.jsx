import { useState } from 'react';
import { Mic, MicOff } from 'lucide-react';

const VoiceCompanion = ({ isFullscreen }) => {
  const [listening, setListening] = useState(false);
  console.log("isFullScreen",isFullscreen);
  const toggleListening = () => {
    setListening(!listening);
  };

  return (
    <div className="p-8 ${isFullscreen ? 'w-screen' : 'max-w-screen'} text-center">
      <h1 className="text-3xl font-bold mb-6 text-indigo-700">AI Voice Companion</h1>
      <button
        onClick={toggleListening}
        className={`mx-auto p-4 rounded-full shadow-lg ${listening ? 'bg-red-500' : 'bg-green-500'}`}
      >
        {listening ? <MicOff className="text-white w-8 h-8" /> : <Mic className="text-white w-8 h-8" />}
      </button>
      <p className="mt-4 text-lg text-gray-600">
        {listening ? 'Listening... Speak now!' : 'Press the mic to talk to your AI companion.'}
      </p>
    </div>
  );
};

export default VoiceCompanion;
