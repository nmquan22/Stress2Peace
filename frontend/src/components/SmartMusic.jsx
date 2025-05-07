import React, { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Volume2, VolumeX, Play, Pause, SkipForward } from 'lucide-react';

const defaultTracks = [
  {
    title: "Calm Nature",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    bpm: 58
  },
  {
    title: "Relaxing Piano",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3", 
    bpm: 62
  },
  {
    title: "Ocean Waves",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    bpm: 55
  }
];

const SmartMusicPlayer = ({ autoPlay = false }) => {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [volume, setVolume] = useState(0.5);
  const [currentTrack, setCurrentTrack] = useState(0);
  const audioRef = useRef(null);

  // Audio control
  useEffect(() => {
    if(!audioRef.current) return;

    audioRef.current.volume = volume;
    if(isPlaying) {
      audioRef.current.play().catch(() => setIsPlaying(false));
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, volume]);

  const handleTrackChange = () => {
    setCurrentTrack((prev) => (prev + 1) % defaultTracks.length);
    setIsPlaying(true);
  };

  const toggleMute = () => {
    setVolume(prev => prev > 0 ? 0 : 0.5);
  };

  return (
  <div className="bg-gradient-to-r from-purple-100 via-white to-purple-100 rounded-xl px-4 py-3 shadow-md flex items-center justify-between gap-3 border border-purple-200">
    <audio ref={audioRef} src={defaultTracks[currentTrack].url} loop />

    <Button
      size="icon"
      onClick={() => setIsPlaying(!isPlaying)}
      className="rounded-full bg-purple-600 hover:bg-purple-700 text-white shadow"
    >
      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
    </Button>

    <div className="flex-1 min-w-[72px]">
      <h3 className="text-purple-800 font-semibold text-sm">{defaultTracks[currentTrack].title}</h3>
      <p className="text-xs text-purple-500">{defaultTracks[currentTrack].bpm} BPM</p>
    </div>

    <div className="flex gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleMute}
        className="text-purple-600 hover:bg-purple-200"
      >
        {volume > 0 ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={handleTrackChange}
        className="text-purple-600 hover:bg-purple-200"
      >
        <SkipForward className="w-4 h-4" />
      </Button>
    </div>
  </div>
);
};
export default SmartMusicPlayer;
