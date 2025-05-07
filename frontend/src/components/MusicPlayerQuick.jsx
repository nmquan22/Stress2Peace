// src/components/MusicPlayerQuick.jsx
import { useState, useRef } from "react";
import { Play, Pause, Music } from "lucide-react";

const MusicPlayerQuick = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef();

  const togglePlay = () => {
    const player = audioRef.current;
    if (!player) return;
    if (isPlaying) {
      player.pause();
    } else {
      player.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white shadow-md rounded-full p-3 flex items-center space-x-3 z-50 border">
      <Music className="text-purple-600" />
      <button onClick={togglePlay} className="text-sm font-medium text-gray-700 hover:text-indigo-700 flex items-center gap-1">
        {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />} {isPlaying ? "Pause Music" : "Play Music"}
      </button>
      <audio ref={audioRef} src="https://www.bensound.com/bensound-music/bensound-slowmotion.mp3" loop />
    </div>
  );
};

export default MusicPlayerQuick;