import { useState, useEffect } from 'react';

const Pomodoro = () => {
  const [seconds, setSeconds] = useState(25 * 60);
  const [active, setActive] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);
  const [showReflection, setShowReflection] = useState(false);
  const [reflection, setReflection] = useState('');

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

  const toggleTimer = () => setActive(!active);
  const resetTimer = () => {
    setSeconds(1 * 2);
    setActive(false);
    setShowReflection(false);
    setReflection('');
  };

  const handleReflectionSubmit = () => {
    // Optionally save reflection somewhere
    console.log("Reflection:", reflection);
    resetTimer();
  };

  const formatTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  return (
    <div className="p-8 text-center">
      <h1 className="text-3xl font-bold text-red-600 mb-4">Pomodoro Timer</h1>

      {!showReflection ? (
        <>
          <div className="text-6xl font-mono text-red-500 mb-6">{formatTime(seconds)}</div>
          <div className="space-x-4">
            <button
              onClick={toggleTimer}
              className="bg-red-500 text-white px-6 py-3 rounded-xl shadow-md hover:bg-red-600"
            >
              {active ? 'Pause' : 'Start'}
            </button>
            <button
              onClick={resetTimer}
              className="bg-gray-300 text-gray-700 px-6 py-3 rounded-xl shadow-md hover:bg-gray-400"
            >
              Reset
            </button>
          </div>
          <p className="mt-4 text-gray-600">Completed Sessions: {completedSessions}</p>
        </>
      ) : (
        <div className="bg-white p-6 rounded-xl shadow-md mt-6">
          <h2 className="text-xl font-semibold text-indigo-600 mb-2">🧘 Post-Session Reflection</h2>
          <textarea
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            placeholder="How did you feel during this session?"
            className="w-full p-3 border border-gray-300 rounded mb-4"
            rows="4"
          ></textarea>
          <button
            onClick={handleReflectionSubmit}
            className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700"
          >
            Submit Reflection
          </button>
        </div>
      )}
    </div>
  );
};

export default Pomodoro;