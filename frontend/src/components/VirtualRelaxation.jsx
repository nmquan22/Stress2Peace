import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { VRButton, XR } from '@react-three/xr';

const PeacefulScene = () => {
  return (
    <Canvas>
      <XR>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} />

        {/* Ground */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[50, 50]} />
          <meshStandardMaterial color="#a0e8af" />
        </mesh>

        {/* Floating Sphere for Focus */}
        <mesh position={[0, 2, -5]}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshStandardMaterial color="#87ceeb" emissive="#cceeff" emissiveIntensity={0.5} />
        </mesh>

        {/* Sky and Stars */}
        <Stars radius={50} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

        <OrbitControls enableZoom={false} />
      </XR>
    </Canvas>
  );
};

const VRRelaxationScene = () => {
  return (
    <div className="w-full h-screen">
      <VRButton />
      <PeacefulScene />
    </div>
  );
};

export default VRRelaxationScene;