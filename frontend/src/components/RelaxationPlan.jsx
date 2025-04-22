// src/components/RelaxationPlan.jsx
import { Card, CardContent } from "@/components/ui/card";

const RelaxationPlan = () => {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center text-indigo-700">Your Personalized Relaxation Plan</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-white shadow-xl rounded-2xl p-4 hover:scale-[1.02] transition">
          <CardContent>
            <h2 className="text-xl font-semibold text-purple-700">Morning Routine</h2>
            <p>Start your day with a 5-minute guided meditation and light stretching. Avoid screen use in the first hour.</p>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-xl rounded-2xl p-4 hover:scale-[1.02] transition">
          <CardContent>
            <h2 className="text-xl font-semibold text-green-700">Midday Refresh</h2>
            <p>Take a walk in nature or listen to calming instrumental music. Practice deep breathing techniques.</p>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-xl rounded-2xl p-4 hover:scale-[1.02] transition">
          <CardContent>
            <h2 className="text-xl font-semibold text-blue-700">Evening Wind Down</h2>
            <p>Journaling and gratitude reflection. Followed by relaxing sounds and a warm bath before sleep.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RelaxationPlan;
