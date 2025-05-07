// src/components/MeditationModal.jsx
import { Dialog } from "@headlessui/react";
import { X } from "lucide-react";

const MeditationModal = ({ open, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
      <div className="relative bg-white rounded-xl shadow-xl p-6 w-full max-w-2xl z-50">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-indigo-700">Guided Meditation</h2>
          <button onClick={onClose}><X className="w-6 h-6 text-gray-500 hover:text-gray-800" /></button>
        </div>
        <div className="aspect-w-16 aspect-h-9">
          <iframe
            className="w-full h-64 rounded-md"
            src="https://www.youtube.com/embed/inpok4MKVLM"
            title="Guided Meditation"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </Dialog>
  );
};

export default MeditationModal;