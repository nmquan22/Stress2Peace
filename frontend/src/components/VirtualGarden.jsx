import { useState, useRef, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Stars, Sky, Cloud, useGLTF } from "@react-three/drei";
import * as THREE from "three";

const emotions = [
  { feeling: "Happy", weather: "sunny", emoji: "😄" },
  { feeling: "Sad", weather: "rainy", emoji: "😢" },
  { feeling: "Stressed", weather: "stormy", emoji: "😠" },
  { feeling: "Relaxed", weather: "clear", emoji: "😌" },
];

const WeatherEffects = ({ weather }) => {
  switch (weather) {
    case "rainy":
      return <Cloud opacity={0.6} speed={0.2} width={10} depth={5} segments={40} />;
    case "stormy":
      return <Cloud opacity={1} speed={0.8} width={20} depth={10} segments={50} />;
    case "clear":
      return <Stars radius={50} depth={50} count={5000} factor={4} saturation={0} fade />;
    default:
      return null;
  }
};

const Ground = () => (
  <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
    <planeGeometry args={[100, 100]} />
    <meshStandardMaterial color="lightgreen" />
  </mesh>
);

const DraggableObject = ({ children, position, onDrop }) => {
  const ref = useRef();
  const { camera, mouse } = useThree();
  const [isDragging, setIsDragging] = useState(false);
  const planeIntersect = new THREE.Vector3();
  const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  const raycaster = new THREE.Raycaster();

  useFrame(() => {
    if (isDragging && ref.current) {
      raycaster.setFromCamera(mouse, camera);
      raycaster.ray.intersectPlane(plane, planeIntersect);
      ref.current.position.x = planeIntersect.x;
      ref.current.position.z = planeIntersect.z;
    }
  });

  return (
    <group ref={ref} position={position}>
      {/* Children should handle interaction now */}
      {children({ setIsDragging, ref })}
    </group>
  );
};

const Tree = ({ position, size }) => (
  <DraggableObject position={position}>
    {({ setIsDragging }) => (
      <mesh
        castShadow
        onClick={(e) => {
          e.stopPropagation();
          setIsDragging(true);
        }}
        onDoubleClick={(e) => {
          e.stopPropagation();
          setIsDragging(false);
        }}
      >
        <cylinderGeometry args={[0.3 * size, 0.5 * size, 2 * size, 8]} />
        <meshStandardMaterial color="sienna" />
        <mesh position={[0, 1.5 * size, 0]}>
          <sphereGeometry args={[1 * size, 8, 8]} />
          <meshStandardMaterial color="forestgreen" />
        </mesh>
      </mesh>
    )}
  </DraggableObject>
);

const Flower = ({ position }) => {
  const { scene } = useGLTF("/models/black_pearl_coral_fall.glb");

  if (!scene) {
    console.warn("Flower model not loaded.");
    return null;
  }

  return (
    <DraggableObject position={position}>
      {({ setIsDragging }) => (
        <primitive
          object={scene.clone()}
          scale={1}
          onPointerDown={(e) => {
            e.stopPropagation();
            setIsDragging(true);
          }}
          onDoubleClick={(e) => {
            e.stopPropagation();
            setIsDragging(false);
          }}
        />
      )}
    </DraggableObject>
  );
};

const House = ({ position }) => {
  const { scene } = useGLTF("/models/house.glb");

  return (
    <DraggableObject position={position}>
      {({ setIsDragging }) => (
        <primitive
          object={scene.clone()}
          scale={0.001}
          onPointerDown={(e) => {
            e.stopPropagation();
            setIsDragging(true);
          }}
          onDoubleClick={(e) => {
            e.stopPropagation();
            setIsDragging(false);
          }}
        />
      )}
    </DraggableObject>
  );
};

const Dog = ({ position }) => {
  const { scene } = useGLTF("/models/dog.glb");

  return (
    <DraggableObject position={position}>
      {({ setIsDragging }) => (
        <primitive
          object={scene.clone()}
          scale={1}
          onPointerDown={(e) => {
            e.stopPropagation();
            setIsDragging(true);
          }}
          onDoubleClick={(e) => {
            e.stopPropagation();
            setIsDragging(false);
          }}
        />
      )}
    </DraggableObject>
  );
};

export default function VirtualGarden() {
  const [weather, setWeather] = useState("sunny");
  const [treeSize, setTreeSize] = useState(1);
  const [coins, setCoins] = useState(0);
  const [trees, setTrees] = useState([{ x: 5 , z: 5 }]);
  const [flowers, setFlowers] = useState([{x: -10, z:-3}]);
  const [houses, setHouses] = useState([]);
  const [dogs, setDogs] = useState([{ x: 10, z: -4 }]);

  const handleEmotionSelect = (selectedWeather) => setWeather(selectedWeather);

  const handleWaterTree = () => {
    setTreeSize((prev) => Math.min(prev + 0.2, 2));
    setCoins((prev) => prev + 5);
  };

  const handleBuyFlower = () => {
    if (coins >= 10) {
      setFlowers([...flowers, { x: Math.random() * 10 - 5, z: Math.random() * 10 - 5 }]);
      setCoins((prev) => prev - 10);
    }
  };

  const handleBuyHouse = () => {
    if (coins >= 50) {
      setHouses([...houses, { x: Math.random() * 10 - 5, z: Math.random() * 10 - 5 }]);
      setCoins((prev) => prev - 50);
    }
  };

  return (
    <div className="h-screen w-full flex flex-col bg-gradient-to-b from-green-100 to-green-300">
      <header className="p-4 flex justify-between items-center bg-white shadow z-10">
        <div className="px-20 flex gap-4 items-center">
          {emotions.map((emotion) => (
            <button
              key={emotion.feeling}
              onClick={() => handleEmotionSelect(emotion.weather)}
              className="px-3 py-1 bg-green-100 rounded-full hover:bg-green-300 transition text-green-800"
            >
              {emotion.emoji} {emotion.feeling}
            </button>
          ))}
        </div>
        <div className="flex gap-3 items-center">
          <span className="text-green-800 font-semibold">Coins: {coins}</span>
          <button onClick={handleWaterTree} className="bg-blue-200 px-3 py-1 rounded hover:bg-blue-300">Water Tree 💧</button>
          <button onClick={handleBuyFlower} className="bg-pink-200 px-3 py-1 rounded hover:bg-pink-300">Buy Flower 🌸</button>
          <button onClick={handleBuyHouse} className="bg-yellow-200 px-3 py-1 rounded hover:bg-yellow-300">Buy House 🏠</button>
        </div>
      </header>

      <div className="flex-1">
        <Canvas
          shadows
          camera={{ position: [0, 5, 10], fov: 50 }}
          style={{ background: weather === "stormy" ? "#666" : weather === "rainy" ? "#89CFF0" : "#87CEEB" }}
        >
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 10, 5]} intensity={1} castShadow />
          <Ground />

          <Suspense fallback={null}>
            {trees.map((t, i) => <Tree key={i} position={[t.x, 0, t.z]} size={treeSize} />)}
            {flowers.map((f, index) => <Flower key={index} position={[f.x, 0, f.z]} />)}
            {houses.map((h, i) => <House key={i} position={[h.x, 0, h.z]} />)}
            {dogs.map((d, iDog) => <Dog key={iDog} position={[d.x, 0, d.z]} />)}
          </Suspense>

          <OrbitControls />
          <Sky sunPosition={[100, 20, 100]} />
          <WeatherEffects weather={weather} />
        </Canvas>
      </div>
    </div>
  );
}
