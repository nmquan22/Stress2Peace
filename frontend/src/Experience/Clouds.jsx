import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function Clouds() {
  const cloudCount = 5;
  const cloudGeometry = new THREE.SphereGeometry(1, 8, 8);
  const cloudMaterial = new THREE.MeshStandardMaterial({
    color: '#ccc',
    transparent: true,
    opacity: 0.7,
  });

  const clouds = Array.from({ length: cloudCount }, (_, i) => ({
    position: [(i - 2) * 5, 5 + Math.random(), -5 + Math.random() * 5],
  }));

  return (
    <>
      {clouds.map(({ position }, idx) => (
        <mesh key={idx} geometry={cloudGeometry} material={cloudMaterial} position={position} />
      ))}
    </>
  );
}
