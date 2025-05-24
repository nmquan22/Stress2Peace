import * as THREE from "three";
import { Perf } from "r3f-perf";
import { Center, PointerLockControls } from "@react-three/drei";
import { useState, useEffect } from "react";
import axios from "axios";

import Environment from "./Enviroment";
import Player from "./Player";
import World from "./world/World";
import GardenAudio from "./GardenAudio";
import Rain from "./Rain";     // hiệu ứng mưa
import Clouds from "./Clouds"; // hiệu ứng mây

export const plane = new THREE.PlaneGeometry(1, 1, 1, 1);

const moodToSkySettings = {
  joy: { sunPosition: [5, 10, 2], clouds: false, rain: false },
  surprise: { sunPosition: [5, 10, 2], clouds: false, rain: false },
  Excited: { sunPosition: [3, 8, 2], clouds: true, rain: false },
  Inspired: { sunPosition: [3, 8, 2], clouds: true, rain: false },
  calm: { sunPosition: [0, 5, 0], clouds: true, rain: false },
  neutral: { sunPosition: [1, 3, 1], clouds: true, rain: false },
  confused: { sunPosition: [1, 3, 1], clouds: true, rain: false },
  sadness: { sunPosition: [0, 0.2, 0], clouds: true, rain: true }, // rain + clouds
  fear: { sunPosition: [-2, 1, -2], clouds: true, rain: false },
  disgust: { sunPosition: [-3, 2, -1], clouds: true, rain: false },
  anger: { sunPosition: [-5, 0.5, -5], clouds: true, rain: false },
};

export default function Experience() {
  const [mood, setMood] = useState("neutral");
  const [settings, setSettings] = useState(moodToSkySettings["neutral"]);

  useEffect(() => {
    const fetchMood = async () => {
      try {
        const res = await axios.get("/api/mood/current", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
        });
        const currentMood = res.data.mood || "neutral";
        setMood(currentMood);
        setSettings(moodToSkySettings[currentMood] || moodToSkySettings["neutral"]);
      } catch (error) {
        console.warn("Không thể lấy mood, dùng mặc định", error);
      }
    };
    fetchMood();
  }, []);

  return (
    <>
      {window.location.hash === "#perf" && <Perf position="top-left" />}

      <PointerLockControls makeDefault />
      <Player />

      <GardenAudio />
      <Environment sunPosition={settings.sunPosition} />

      {/* Mưa & mây */}
      {settings.clouds && <Clouds />}
      {settings.rain && <Rain />}

      <Center>
        <mesh
          geometry={plane}
          position={[-15, -0.1, 1]}
          rotation-x={-Math.PI * 0.5}
          scale={150}
        >
          <meshBasicMaterial color={"#768a57"} />
        </mesh>

        <World />
      </Center>
    </>
  );
}
