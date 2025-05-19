import { useState, useEffect, useRef } from 'react';

const sounds = {
  forest: { name: "Rừng", file: "/sounds/forest.wav", bg: "/backgrounds/forest.jpg" },
  rain: { name: "Mưa", file: "/sounds/rain.wav", bg: "/backgrounds/rain.jpg" },
  stream: { name: "Suối", file: "/sounds/stream.wav", bg: "/backgrounds/stream.jpg" },
  campfire: { name: "Lửa trại", file: "/sounds/campfire.wav", bg: "/backgrounds/campfire.jpg" },
};

const Pomodoro = () => {
  const [seconds, setSeconds] = useState(25 * 60);
  const [active, setActive] = useState(false);
  const [reflection, setReflection] = useState('');
  const [showReflection, setShowReflection] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);
  const [sound, setSound] = useState(null);
  const audioRef = useRef(null);
  const [volume, setVolume] = useState(0);

  // Timer effect
  useEffect(() => {
    let timer;
    if (active && seconds > 0) {
      timer = setInterval(() => setSeconds((s) => s - 1), 1000);
    } else if (seconds === 0) {
      clearInterval(timer);
      setActive(false);
      setCompletedSessions((prev) => prev + 1);
      setShowReflection(true);
    }
    return () => clearInterval(timer);
  }, [active, seconds]);

  // Handle audio fade-in
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = 0;
      const fade = setInterval(() => {
        if (audio.volume < 0.9) {
          audio.volume += 0.1;
        } else {
          clearInterval(fade);
        }
      }, 200);
      audio.play();
    }
  }, [sound]);

  const toggleTimer = () => setActive(!active);
  const resetTimer = () => {
    setSeconds(25 * 60);
    setActive(false);
    setShowReflection(false);
    setReflection('');
  };

  const formatTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  const handleReflectionSubmit = () => {
    console.log("Reflection:", reflection);
    resetTimer();
  };

  return (
    <div
      className="min-h-screen flex flex-col justify-center items-center bg-cover bg-center p-6 transition-all duration-1000"
      style={{
        backgroundImage: `url(${sound ? sounds[sound].bg : '/backgrounds/forest.jpg'})`,
      }}
    >
      <div className="bg-white/80 backdrop-blur-md rounded-2xl p-8 shadow-xl w-full max-w-2xl">
        <h1 className="text-4xl font-bold text-green-600 mb-4 text-center">🍅 Pomodoro for Peace</h1>

        {/* 🔊 Chọn âm thanh */}
        <div className="flex gap-4 justify-center mb-6">
          {Object.keys(sounds).map((key) => (
            <button
              key={key}
              onClick={() => setSound(key)}
              className="flex items-center gap-2 bg-green-100 text-green-800 px-3 py-2 rounded hover:bg-green-200"
            >
              {sounds[key].name}
            </button>
          ))}
        </div>

        {/* 🌊 Hiệu ứng tùy âm thanh */}
        {sound === 'stream' && (
          <div className="animate-pulse text-blue-500 text-center">🌊 Nước róc rách...</div>
        )}
        {sound === 'campfire' && (
          <div className="animate-flicker text-orange-500 text-center">🔥 Lửa bập bùng...</div>
        )}

        {/* 🎧 Âm thanh */}
        {sound && (
          <audio ref={audioRef} loop src={sounds[sound].file} />
        )}

        {/* ⏱️ Timer */}
        {!showReflection ? (
          <>
            <div className="text-6xl font-mono text-green-700 text-center mb-6">{formatTime(seconds)}</div>
            <div className="flex justify-center gap-4">
              <button
                onClick={toggleTimer}
                className="bg-green-500 text-white px-6 py-3 rounded-xl hover:bg-green-600"
              >
                {active ? 'Pause' : 'Start'}
              </button>
              <button
                onClick={resetTimer}
                className="bg-gray-300 text-gray-800 px-6 py-3 rounded-xl hover:bg-gray-400"
              >
                Reset
              </button>
            </div>
            <p className="mt-4 text-center text-gray-600">Đã hoàn thành: {completedSessions} lần</p>
          </>
        ) : (
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-blue-600 text-center mb-2">🌿 Thư giãn và cảm nhận</h2>
            <textarea
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder="Bạn cảm thấy thế nào sau khi thư giãn?"
              className="w-full p-3 border border-gray-300 rounded mb-4"
              rows="4"
            ></textarea>
            <button
              onClick={handleReflectionSubmit}
              className="w-full bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Gửi phản hồi
            </button>
          </div>
        )}

        {/* 🎥 Video thiền */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-center text-teal-700 mb-2">🎥 Hướng dẫn thiền</h3>
          <div className="aspect-w-16 aspect-h-9">
            <iframe
              className="rounded-xl w-full h-64"
              src="https://www.youtube.com/embed/inpok4MKVLM"
              title="Meditation Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pomodoro;
