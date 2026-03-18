"use client";
import React, { Suspense, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment, Float, ContactShadows } from "@react-three/drei";

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  
    useEffect(() => {
    // Slight tweak to material or scene if needed for VRM.
    // Ensure all materials are double sided if it's an anime style VRoid model.
    scene.traverse((node: any) => {
      if (node.isMesh && node.material) {
        node.material.side = 2; // THREE.DoubleSide
        node.material.transparent = true;
        node.material.alphaTest = 0.5;
        // Fix overly bright emission from VRM default exports
        if (node.material.emissive) {
          node.material.emissiveIntensity = 0;
        }

        // Programmatic avatar texturing for the web3 intelligence aesthetic
        node.material.color.set('#6ba368');
        node.material.emissive.set('#1a2e1a');
        node.material.roughness = 0.4;
      }

      // Relax T-Pose
      if (node.name.includes('J_Bip_L_UpperArm')) {
        node.rotation.z = -1.2;
      }
      if (node.name.includes('J_Bip_R_UpperArm')) {
        node.rotation.z = 1.2;
      }
    });
  }, [scene]);

  return (
    <Float
      speed={1.5} // Animation speed
      rotationIntensity={0.2} // XYZ rotation intensity
      floatIntensity={0.5} // Up/down float intensity
      floatingRange={[-0.05, 0.05]} // Range of y-axis values the object will float within
    >
      <primitive 
        object={scene} 
        position={[0, -1.2, 0]} // Move down slightly to center upper body
        scale={1.3} // Scale up a bit
      />
    </Float>
  );
}

// Preload the model to avoid popping
useGLTF.preload("/models/regen_eliza_final.glb");

export default function Avatar() {
  return (
    <div className="w-full h-full relative bg-transparent pointer-events-auto cursor-grab active:cursor-grabbing">
      <Canvas
        camera={{ position: [0, 1.0, 4.5], fov: 45 }}
        gl={{ alpha: true, antialias: true }}
      >
        <Suspense fallback={null}>
          {/* Cinematic lighting setup for the avatar */}
          <ambientLight color="#ffffff" intensity={1.5} />
          <directionalLight color="#ffffff" position={[0, 2, 5]} intensity={2} castShadow />
          
          <Model url="/models/regen_eliza_final.glb" />
          
          <ContactShadows 
            position={[0, -1.2, 0]} 
            opacity={0.6} 
            scale={5} 
            blur={2} 
            far={4} 
            color="#000000" 
          />
          <Environment preset="city" />
        </Suspense>
        
        <OrbitControls 
          enablePan={false}
          enableZoom={true}
          minDistance={2}
          maxDistance={6}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 2 + 0.1}
          target={[0, 0.9, 0]}
        />
      </Canvas>
    </div>
  );
}
