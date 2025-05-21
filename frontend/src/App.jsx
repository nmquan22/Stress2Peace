// src/App.jsx
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, BrainCog, Mic,Music, HeartPulse, Lightbulb, TreePine, Bot, Paintbrush, Timer, Menu, X, LogOut,
  SidebarOpen,Camera
} from "lucide-react";

import Dashboard from "./components/Dashboard";
import RelaxationPlan from "./components/RelaxationPlan";
import VoiceCompanion from "./components/VoiceCompanion";
import FacialMoodDetector from "./components/FacialMoodDetection";
import MoodLighting from "./components/MoodLighting";
import VirtualGarden from "./components/VirtualGarden";
import ChatBot from "./components/ChatBot";
import ArtTherapy from "./components/ArtTherapy";
import Pomodoro from "./components/Pomodoro";
import Login from "./pages/Login";
import Register from "./pages/Register"; 
import CommunityDashboard from "./components/CommunityDashboard";
import SmartMusicPlayer from "./components/SmartMusic";

// ✅ Helper function to check login
const isAuthenticated = () => !!localStorage.getItem("token");

// Unified toggle for all routes
const toggleLayout = () => {
  setSidebarOpen(!sidebarOpen);
};

// ✅ Sidebar
const Sidebar = ({ isOpen, handleLogout }) => {
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", icon: <LayoutDashboard className="w-5 h-5" />, path: "/" },
    { name: "Relaxation Plan", icon: <BrainCog className="w-5 h-5" />, path: "/relaxation" },
    { name: "Voice Companion", icon: <Mic className="w-5 h-5" />, path: "/voice" },
    //{ name: "Smart Music", icon: <Music className="w-5 h-5" />, path: "/music"}, 
    { name: "Facial Detection", icon: <Camera className="w-5 h-5" />, path: "/facial" },
    { name: "Mood Lighting", icon: <Lightbulb className="w-5 h-5" />, path: "/lighting" },
    { name: "Virtual Garden", icon: <TreePine className="w-5 h-5" />, path: "/garden" },
    { name: "Chatbot", icon: <Bot className="w-5 h-5" />, path: "/chat" },
    { name: "Art Therapy", icon: <Paintbrush className="w-5 h-5" />, path: "/art" },
    { name: "Pomodoro", icon: <Timer className="w-5 h-5" />, path: "/pomodoro" },
    { name: "Community Dashboard", icon: <SidebarOpen className ="w-5 h-5"/>, path: "/community"}
  ];

  return (
    <div
      className={`fixed top-0 left-0 h-full bg-gradient-to-b from-indigo-100 to-blue-50 shadow-lg z-40 transform transition-transform duration-300
        ${isOpen ? "translate-x-0 w-90" : "-translate-x-full w-90"}`}
    >
      <div className="p-6 overflow-y-auto h-full flex flex-col justify-between">
        <div>
          <h1 className="text-2xl font-bold text-indigo-700 mb-8 break-words">🌿 Stress2Peace</h1>
          <ul className="space-y-3">
            {menuItems.map(({ name, icon, path }) => (
              <li key={path}>
                <Link
                  to={path}
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-indigo-200 transition-all
                  ${location.pathname === path ? "bg-indigo-300 text-white font-semibold" : ""}`}
                >
                  {icon}
                  <span>{name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Global Music Player */}
        <div className="bottom-4 left-4 z-[60] w-72 h-full flex flex-col justify-between">
            <SmartMusicPlayer autoPlay={true} />
          </div>

        <button
          onClick={handleLogout}
          className="mt-8 flex items-center gap-2 text-red-500 hover:text-red-700 transition-all"
        >
          <LogOut className="w-5 h-5" /> Logout
        </button>
      </div>
    </div>
  );
};

const routes = [
  { path: "/", component: Dashboard },
  { path: "/relaxation", component: RelaxationPlan },
  { path: "/voice", component: VoiceCompanion },
  //{ path: "/music", component: SmartMusicPlayer},
  { path: "/facial", component: FacialMoodDetector },
  { path: "/lighting", component: MoodLighting },
  { path: "/garden", component: VirtualGarden },
  { path: "/chat", component: ChatBot },
  { path: "/art", component: ArtTherapy },
  { path: "/pomodoro", component: Pomodoro },
  {path: "/community",component: CommunityDashboard}
];

// ✅ Protected route wrapper
const ProtectedRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" />;
};

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  console.log("sidebarOpen",sidebarOpen);
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="relative min-h-screen">
      {/* Only show sidebar & button if logged in */}
      {isAuthenticated() && (
        <>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`fixed top-4 z-50 p-2 bg-white rounded-full shadow-md hover:bg-indigo-100
    transition-all duration-500 ease-in-out
        ${sidebarOpen ? "left-[250px]" : "left-4"}`}
          >
            {sidebarOpen ? <X className="w-6 h-6 text-indigo-700" /> : <Menu className="w-6 h-6 text-indigo-700" />}
          </button>

          <Sidebar isOpen={sidebarOpen} handleLogout={handleLogout} />
        </>
      )}

      <div
        className={`transition-all duration-300 ml-0
         bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen w-screen}`}
      >
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {routes.map(({ path, component: Component }) => (
              <Route
              key={path}
              path={path}
              element={
              <ProtectedRoute>
                <div
                className={`transition-all duration-300 ${
                  sidebarOpen ? "ml-90" : "ml-0"
                } bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen ${sidebarOpen ? "w-294":"w-screen"}`}
                >
                <Component 
                isFullscreen={!sidebarOpen}
                toggleLayout={toggleLayout}/>
                </div>
              </ProtectedRoute>
                }
              />
          ))}
        </Routes>
      </div>
    </div>
  );
}

export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}
