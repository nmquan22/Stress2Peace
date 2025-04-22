import { Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import RelaxationPlan from './components/RelaxationPlan';
import VoiceCompanion from './components/VoiceCompanion';
import HeartMonitor from './components/HeartMonitor';
import MoodLighting from './components/MoodLighting';
import VirtualGarden from './components/VirtualGarden';
import ChatBot from './components/ChatBot';
import ArtTherapy from './components/ArtTherapy';
import Pomodoro from './components/Pomodoro';

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Dashboard />} />
    <Route path="/plan" element={<RelaxationPlan />} />
    <Route path="/voice" element={<VoiceCompanion />} />
    <Route path="/heart" element={<HeartMonitor />} />
    <Route path="/lighting" element={<MoodLighting />} />
    <Route path="/garden" element={<VirtualGarden />} />
    <Route path="/chat" element={<ChatBot />} />
    <Route path="/art" element={<ArtTherapy />} />
    <Route path="/pomodoro" element={<Pomodoro />} />
  </Routes>
);

export default AppRoutes;
