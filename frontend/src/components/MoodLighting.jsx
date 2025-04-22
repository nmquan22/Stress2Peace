const MoodLighting = () => {
    const moods = ['Relaxed', 'Focus', 'Energetic', 'Calm'];
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-yellow-600 mb-6">Mood-Based Room Lighting</h1>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {moods.map((mood, index) => (
            <button
              key={index}
              className="bg-yellow-100 hover:bg-yellow-300 rounded-xl shadow-md p-6 text-lg font-semibold text-yellow-800 transition"
            >
              {mood}
            </button>
          ))}
        </div>
      </div>
    );
  };
  
  export default MoodLighting;
  