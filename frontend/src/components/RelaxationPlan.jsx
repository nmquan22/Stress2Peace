// src/components/RelaxationPlan.jsx
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import MeditationModal from "./MeditationModal";
import MusicPlayerQuick from "./MusicPlayerQuick";
import JournalModal from "./JournalModal";
import { useState } from "react";
import useRandomPlan from "@/hooks/useRandomPlan";

const RelaxationPlan = () => {
  const [showMeditation, setShowMeditation] = useState(false);
  const [showMusicPlayer, setShowMusicPlayer] = useState(false);
  const [showJournal, setShowJournal] = useState(false);
  const { plan, generatePlan } = useRandomPlan();

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center text-indigo-700">
        Your Personalized Relaxation Plan
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-white shadow-xl rounded-2xl p-4 hover:scale-[1.02] transition">
          <CardContent>
            <h2 className="text-xl font-semibold text-purple-700">Morning Routine</h2>
            <p>{plan?.morning || "Start your day with a 5-minute guided meditation and light stretching."}</p>
            <Button variant="outline" onClick={() => setShowMeditation(true)} className="mt-2">
              Start Meditation
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-xl rounded-2xl p-4 hover:scale-[1.02] transition">
          <CardContent>
            <h2 className="text-xl font-semibold text-green-700">Midday Refresh</h2>
            <p>{plan?.midday || "Take a walk in nature or listen to calming instrumental music."}</p>
            <Button variant="outline" onClick={() => setShowMusicPlayer(true)} className="mt-2">
              Play Relaxing Music
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-xl rounded-2xl p-4 hover:scale-[1.02] transition">
          <CardContent>
            <h2 className="text-xl font-semibold text-blue-700">Evening Wind Down</h2>
            <p>{plan?.evening || "Journaling and gratitude reflection. Followed by relaxing sounds and a warm bath before sleep."}</p>
            <Button variant="outline" onClick={() => setShowJournal(true)} className="mt-2">
              Open Journal
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center mt-8">
        <Button onClick={generatePlan} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-full">
          Generate New Plan with AI
        </Button>
      </div>

      {showMeditation && <MeditationModal open={showMeditation} onClose={() => setShowMeditation(false)} />}
      {showMusicPlayer && <MusicPlayerQuick />}
      {showJournal && <JournalModal open={showJournal} onClose={() => setShowJournal(false)} />}
    </div>
  );
};

export default RelaxationPlan;