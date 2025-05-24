import React, { useState, useEffect } from "react";
import {
  Users, AlertTriangle, UploadCloud, Music, Send, MessageCircle
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [highStressUsers, setHighStressUsers] = useState([]);
  const [showChallengeModal, setShowChallengeModal] = useState(false);
  const [showMusicModal, setShowMusicModal] = useState(false);
  const [feedbackList, setFeedbackList] = useState([]);

  useEffect(() => {
    setUsers([
      { name: "Alice", stress: 8 },
      { name: "Bob", stress: 2 },
      { name: "Charlie", stress: 9 },
    ]);
    setHighStressUsers([
      { name: "Charlie", stress: 9 },
      { name: "Alice", stress: 8 },
    ]);
    setFeedbackList([
      { user: "Daisy", message: "Love the virtual garden!" },
      { user: "Eli", message: "Breathing feature is great!" },
    ]);
  }, []);

  const handleUploadChallenge = () => {
    alert("Challenge uploaded (mock).");
    setShowChallengeModal(false);
  };

  const handleUploadMusic = () => {
    alert("Music uploaded (mock).");
    setShowMusicModal(false);
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-indigo-700 mb-6">Admin Dashboard</h2>

      {/* 🧮 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-gray-500">Total Users</p>
              <p className="text-2xl font-bold">{users.length}</p>
            </div>
            <Users className="text-indigo-500 w-6 h-6" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-gray-500">High Stress Users</p>
              <p className="text-2xl font-bold">{highStressUsers.length}</p>
            </div>
            <AlertTriangle className="text-red-500 w-6 h-6" />
          </CardContent>
        </Card>
        <Card onClick={() => setShowChallengeModal(true)} className="cursor-pointer hover:bg-indigo-100 transition">
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-gray-500">Upload Challenge</p>
              <p className="text-2xl font-bold">+</p>
            </div>
            <UploadCloud className="text-green-500 w-6 h-6" />
          </CardContent>
        </Card>
        <Card onClick={() => setShowMusicModal(true)} className="cursor-pointer hover:bg-indigo-100 transition">
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-gray-500">Upload Music</p>
              <p className="text-2xl font-bold">+</p>
            </div>
            <Music className="text-purple-500 w-6 h-6" />
          </CardContent>
        </Card>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-3">High Stress Users</h3>
        <ul className="bg-white shadow-md rounded-lg p-4 space-y-2">
          {highStressUsers.map((u, i) => (
            <li key={i} className="flex justify-between">
              <span className="font-medium text-gray-700">{u.name}</span>
              <span className="text-red-600 font-bold">Stress: {u.stress}</span>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-3">Recent User Feedback</h3>
        <ul className="bg-white shadow-md rounded-lg p-4 space-y-2">
          {feedbackList.map((fb, i) => (
            <li key={i} className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-indigo-500" />
              <span className="text-gray-800 font-medium">{fb.user}:</span>
              <span className="text-gray-600 italic">"{fb.message}"</span>
            </li>
          ))}
        </ul>
      </div>

      {/* 📤 Challenge Modal */}
      {showChallengeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-md p-6 w-96 space-y-4">
            <h4 className="text-xl font-semibold text-indigo-700">Upload New Challenge</h4>
            <input type="text" placeholder="Title..." className="w-full border px-3 py-2 rounded" />
            <textarea placeholder="Description..." className="w-full border px-3 py-2 rounded" rows={4} />
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowChallengeModal(false)} className="text-gray-500">Cancel</button>
              <button onClick={handleUploadChallenge} className="bg-indigo-600 text-white px-4 py-2 rounded">Upload</button>
            </div>
          </div>
        </div>
      )}

      {/* 🎶 Music Modal */}
      {showMusicModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-md p-6 w-96 space-y-4">
            <h4 className="text-xl font-semibold text-indigo-700">Upload New Music</h4>
            <input type="text" placeholder="Title..." className="w-full border px-3 py-2 rounded" />
            <input type="file" accept="audio/*" className="w-full border px-3 py-2 rounded" />
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowMusicModal(false)} className="text-gray-500">Cancel</button>
              <button onClick={handleUploadMusic} className="bg-purple-600 text-white px-4 py-2 rounded">Upload</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
