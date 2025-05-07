// src/components/JournalModal.jsx
import { Dialog } from "@headlessui/react";
import { useState, useEffect } from "react";
import { X } from "lucide-react";

const JournalModal = ({ open, onClose }) => {
  const [entry, setEntry] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("journalEntry");
    if (stored) setEntry(stored);
  }, []);

  const saveEntry = () => {
    localStorage.setItem("journalEntry", entry);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <Dialog open={open} onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
      <div className="bg-white rounded-xl shadow-xl p-6 max-w-2xl w-full z-50">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-blue-700">Evening Journal</h2>
          <button onClick={onClose}><X className="w-6 h-6 text-gray-600 hover:text-gray-800" /></button>
        </div>
        <textarea
          value={entry}
          onChange={(e) => setEntry(e.target.value)}
          className="w-full h-40 border rounded-md p-3 text-gray-800 focus:outline-none focus:ring"
          placeholder="Write your thoughts or gratitude for today..."
        />
        <div className="mt-4 flex justify-between">
          <button onClick={saveEntry} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Save Entry
          </button>
          {saved && <span className="text-green-600 text-sm">Saved!</span>}
        </div>
      </div>
    </Dialog>
  );
};

export default JournalModal;