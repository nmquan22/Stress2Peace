import { useState } from "react";
import { GiPlantWatering, GiSpiralLollipop } from "react-icons/gi";
import { FaSeedling, FaTree } from "react-icons/fa";
import { motion } from "framer-motion";

const plantTypes = [
  { type: "Seedling", icon: <FaSeedling />, color: "bg-green-300" },
  { type: "Flower", icon: <GiSpiralLollipop />, color: "bg-pink-300" },
  { type: "Sunflower", icon: <FaTree />, color: "bg-yellow-300" },
  { type: "Cactus", icon: <GiPlantWatering />, color: "bg-green-500" },
];

const VirtualGarden = () => {
  const [garden, setGarden] = useState([]);

  const growPlant = () => {
    const randomPlant = plantTypes[Math.floor(Math.random() * plantTypes.length)];
    setGarden([
      ...garden,
      { ...randomPlant, level: 1, id: Date.now() + Math.random() },
    ]);
  };

  const upgradePlant = (id) => {
    setGarden((prev) =>
      prev.map((plant) =>
        plant.id === id && plant.level < 5
          ? { ...plant, level: plant.level + 1 }
          : plant
      )
    );
  };

  return (
    <div className="p-8 text-center min-h-screen bg-gradient-to-b from-green-50 to-green-100">
      <h1 className="text-4xl font-bold mb-4 text-green-800">🌿 Your Virtual Garden</h1>
      <p className="text-green-600 mb-6">Grow and upgrade your plants to make your garden beautiful!</p>

      <div className="flex flex-wrap justify-center gap-6 mb-8">
        {garden.map((plant, index) => (
          <motion.div
            key={plant.id}
            whileHover={{ scale: 1.1 }}
            className={`p-4 rounded-xl shadow-xl text-white cursor-pointer ${plant.color}`}
            onClick={() => upgradePlant(plant.id)}
          >
            <div className="text-4xl mb-2">{plant.icon}</div>
            <p className="font-semibold">{plant.type}</p>
            <p className="text-sm">Level: {plant.level}</p>
          </motion.div>
        ))}
      </div>

      <button
        onClick={growPlant}
        className="bg-green-600 text-white px-6 py-3 rounded-full shadow-md hover:bg-green-700 transition-all"
      >
        Grow a Plant 🌱
      </button>
    </div>
  );
};

export default VirtualGarden;
