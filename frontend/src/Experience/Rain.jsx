import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import * as THREE from "three";

// Splash particle class
class Splash {
  constructor(position) {
    this.position = position.clone();
    this.scale = 0.1;
    this.opacity = 1;
    this.life = 0;
    this.maxLife = 20;
  }

  update() {
    this.life++;
    this.scale += 0.02;
    this.opacity = 1 - this.life / this.maxLife;
  }

  isDead() {
    return this.life >= this.maxLife;
  }
}

export default function Rain() {
  const rainCount = 10000;
  const rainRef = useRef();

  const rainPositions = [];
  for (let i = 0; i < rainCount; i++) {
    rainPositions.push(
      (Math.random() - 0.5) * 200,
      Math.random() * 10 + 80,
      (Math.random() - 0.5) * 200
    );
  }

  const rainGeometry = new THREE.BufferGeometry();
  rainGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(rainPositions, 3)
  );

  const rainMaterial = new THREE.PointsMaterial({
    color: "#a3a3a3",
    size: 0.2,
    transparent: true,
    depthWrite: false,
  });

  // Splash state
  const splashesRef = useRef([]);
  const [splashGeometry] = useState(() => new THREE.CircleGeometry(0.1, 16));
  const [splashMaterial] = useState(() =>
    new THREE.MeshBasicMaterial({ color: "#a3a3a3", transparent: true, opacity: 1 })
  );

  useFrame(() => {
    const positions = rainRef.current.geometry.attributes.position.array;

    for (let i = 1; i < positions.length; i += 3) {
      positions[i] -= 0.2;

      if (positions[i] < -4) {
        // Splash effect
        const x = positions[i - 1];
        const z = positions[i + 1];
        splashesRef.current.push(new Splash(new THREE.Vector3(x, 0.05, z)));

        // Reset raindrop
        positions[i] = Math.random() * 10 + 5;
      }
    }

    rainRef.current.geometry.attributes.position.needsUpdate = true;

    // Update & remove old splashes
    splashesRef.current.forEach((splash) => splash.update());
    splashesRef.current = splashesRef.current.filter((splash) => !splash.isDead());
  });

  return (
    <group>
      <points ref={rainRef} geometry={rainGeometry} material={rainMaterial} />
      {splashesRef.current.map((splash, index) => (
        <mesh
          key={index}
          geometry={splashGeometry}
          material={splashMaterial.clone()}
          position={splash.position}
          rotation-x={-Math.PI / 2}
          scale={splash.scale}
          material-opacity={splash.opacity}
        />
      ))}
    </group>
  );
}
