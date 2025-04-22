import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell, Legend
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f7f", "#a29bfe"];
const EMOTION_COLORS = {
  Happy: "#feca57",
  Calm: "#48dbfb",
  Sad: "#8395a7",
  Angry: "#ff6b6b",
  Inspired: "#a29bfe",
};

const Dashboard = () => {
  const [history, setHistory] = useState([]);
  const [moodStats, setMoodStats] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        // 1. Add a stress entry before reading history (for testing/demo)
  //       const stressHistory = [
  //   { date: "2025-04-01", stressLevel: 5, emotion: "Calm" },
  //   { date: "2025-04-02", stressLevel: 7, emotion: "Sad" },
  //   { date: "2025-04-03", stressLevel: 3, emotion: "Happy" },
  //   { date: "2025-04-17", stressLevel: 5, emotion: "Calm" },
  //   { date: "2025-04-18", stressLevel: 4, emotion: "Inspired" },
  // ];

  // const addSampleData = async () => {
  //   for (const entry of stressHistory) {
  //     await axios.post("/api/stress/add", entry, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });
  //   }
  //   console.log("✅ Sample stress data added");
  // };

  // // Uncomment below line to add the data once
  // addSampleData();

        // 2. Fetch stress history
        const res = await axios.get("/api/stress/history", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = res.data;

        // Sort by date
        data.sort((a, b) => new Date(a.date) - new Date(b.date));
        setHistory(data);

        // Count emotions
        const moodMap = {};
        data.forEach(entry => {
          if (entry.emotion) {
            moodMap[entry.emotion] = (moodMap[entry.emotion] || 0) + 1;
          }
        });
        setMoodStats(moodMap);
      } catch (err) {
        console.error("Error adding or fetching stress history:", err);
      }
    };

    fetchData();
  }, []);

  const averageStress = (
    history.reduce((sum, e) => sum + e.stressLevel, 0) / history.length || 0
  ).toFixed(1);

  const lastEntry = history[history.length - 1] || {};
  const maxStressEntry = history.reduce(
    (max, e) => (e.stressLevel > (max?.stressLevel || 0) ? e : max),
    {}
  );

  const pieData = Object.entries(moodStats).map(([emotion, count]) => ({
    name: emotion,
    value: count,
  }));

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-3xl font-bold text-center text-blue-800">📊 Stress2Peace Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-gray-500">Average Stress Level</p>
            <h3 className="text-2xl font-bold text-red-600">{averageStress} / 10</h3>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-gray-500">Last Recorded Mood</p>
            <h3 className="text-lg">{lastEntry.emotion || "Not logged"}</h3>
            <p className="text-sm text-gray-400">{lastEntry.date || "No data"}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-gray-500">Highest Stress Peak</p>
            <h3 className="text-lg text-red-500">
              {maxStressEntry.stressLevel} / 10
            </h3>
            <p className="text-sm">{maxStressEntry.date} - {maxStressEntry.emotion || "Unknown"}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Stress Line Chart */}
        <Card>
          <CardContent>
            <h4 className="text-xl font-semibold mb-2">📈 Daily Stress Level</h4>
            <LineChart
              width={500}
              height={300}
              data={history}
              margin={{ top: 10, right: 20, bottom: 10, left: 0 }}
            >
              <XAxis dataKey="date" />
              <YAxis domain={[0, 10]} />
              <Tooltip />
              <CartesianGrid strokeDasharray="3 3" />
              <Line type="monotone" dataKey="stressLevel" stroke="#ff6b6b" />
            </LineChart>
          </CardContent>
        </Card>

        {/* Emotion Pie Chart */}
        <Card>
          <CardContent>
            <h4 className="text-xl font-semibold mb-2">🎨 Mood Distribution</h4>
            <PieChart width={400} height={300}>
              <Pie
                data={pieData}
                cx={200}
                cy={150}
                labelLine={false}
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={EMOTION_COLORS[entry.name] || COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
