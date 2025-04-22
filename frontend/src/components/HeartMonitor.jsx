const HeartMonitor = () => {
    return (
      <div className="p-8 max-w-xl mx-auto text-center">
        <h1 className="text-3xl font-bold mb-6 text-rose-600">Real-Time Heart Monitor</h1>
        <div className="w-64 h-64 rounded-full border-8 border-rose-400 animate-pulse mx-auto"></div>
        <p className="mt-6 text-lg text-gray-700">Current Heart Rate: <span className="font-bold text-rose-600">78 bpm</span></p>
      </div>
    );
  };
  
  export default HeartMonitor;