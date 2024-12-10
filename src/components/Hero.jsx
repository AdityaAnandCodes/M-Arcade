import React, { useRef, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Center, PerspectiveCamera } from "@react-three/drei";
import { EffectComposer } from '@react-three/postprocessing';
import { 
  Bloom, 
  ChromaticAberration, 
  Noise, 
  Vignette 
} from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import { ArcadeMachine } from "./ArcadeMachine";
import gsap from 'gsap';
import * as THREE from 'three';

const RetroShape = ({ position, rotation, color }) => {
  const meshRef = useRef();
  const moveRef = useRef({
    offsetX: Math.random() * Math.PI * 2,
    offsetY: Math.random() * Math.PI * 2,
    speedX: (Math.random() * 0.5 + 0.5) * 0.5,
    speedY: (Math.random() * 0.5 + 0.5) * 0.5
  });

  useFrame((state, delta) => {
    if (meshRef.current) {
      // Rotation
      meshRef.current.rotation.x += 0.01;
      meshRef.current.rotation.y += 0.005;

      // Smooth oscillating movement
      const { offsetX, offsetY, speedX, speedY } = moveRef.current;
      
      // X-axis movement
      const xMovement = Math.sin(state.clock.elapsedTime * speedX + offsetX) * 2;
      
      // Y-axis movement
      const yMovement = Math.cos(state.clock.elapsedTime * speedY + offsetY) * 2;

      // Update position
      meshRef.current.position.x = position[0] + xMovement;
      meshRef.current.position.y = position[1] + yMovement;
    }
  });

  return (
    <mesh 
      ref={meshRef} 
      position={position} 
      rotation={rotation}
    >
      <dodecahedronGeometry args={[1, 0]} />
      <meshStandardMaterial 
        color={color} 
        transparent 
        opacity={0.6} 
        emissive={color} 
        emissiveIntensity={0.5}
      />
    </mesh>
  );
};

const SceneBackground = () => {
  const shapes = useMemo(() => {
    const shapeCount = 100;
    return Array.from({ length: shapeCount }).map(() => ({
      position: [
        Math.random() * 50 - Math.random() * 50, 
        Math.random() * 50 - Math.random() * 50, 
        Math.random() * 40 - 50,
      ],
      rotation: [
        Math.random() * Math.PI, 
        Math.random() * Math.PI, 
        Math.random() * Math.PI
      ],
      color: new THREE.Color(
        Math.random() * 0.5 + 0.5, 
        Math.random() * 0.5 + 0.5, 
        Math.random() * 0.5 + 0.5
      )
    }));
  }, []);

  return (
    <>
      {shapes.map((shape, index) => (
        <RetroShape 
          key={index}
          position={shape.position}
          rotation={shape.rotation}
          color={shape.color}
        />
      ))}
    </>
  );
};

const AnimatedScene = () => {
  const { camera } = useThree();
  const arcadeMachineRef = useRef();

  useEffect(() => {
    // FOV Animation
    const fovTimeline = gsap.timeline({ 
      repeat: -1, 
      yoyo: true 
    });

    fovTimeline.to(camera, {
      fov: 50,
      duration: 5,
      onUpdate: () => {
        camera.updateProjectionMatrix();
      }
    }).to(camera, {
      fov: 20,
      duration: 3,
      onUpdate: () => {
        camera.updateProjectionMatrix();
      }
    });

    // Arcade Machine Rotation Animation
    const rotationTimeline = gsap.timeline({ 
      repeat: -1,
      yoyo : true,
    });

    rotationTimeline.to(arcadeMachineRef.current.rotation, {
      y: Math.PI * 2,
      duration: 5,
      ease: 'power1.inOut',
      yoyo : true,
    });

    // Cleanup function
    return () => {
      fovTimeline.kill();
      rotationTimeline.kill();
    };
  }, [camera]);

  return (
    <>
      <PerspectiveCamera 
        makeDefault 
        position={[0, 2, 30]} 
        fov={20} 
      />
      
      <ambientLight intensity={1.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      
      {/* Background Shapes */}
      <SceneBackground />
      
      <Center>
        <group ref={arcadeMachineRef}>
          <ArcadeMachine scale={0.2} />
        </group>
      </Center>

      <EffectComposer>
        <Bloom 
          intensity={0.5} 
          kernelSize={3} 
          luminanceThreshold={0.2} 
          luminanceSmoothing={0.1} 
        />

        <ChromaticAberration 
          blendFunction={BlendFunction.NORMAL} 
          offset={[0.0005, 0.0009]} 
        />

        <Noise
          blendFunction={BlendFunction.SOFT_LIGHT} 
          opacity={0.2} 
        />

        <Vignette 
          blendFunction={BlendFunction.NORMAL} 
          offset={0.5} 
          darkness={0.5} 
        />
      </EffectComposer>
    </>
  );
};

const Hero = () => {
  return (
    <section className="max-h-screen flex flex-col items-center p-8">
      <div className="logo text-9xl max-h-fit mb-8">M-Arcade</div>
      <div className="relative h-dvh w-fit bg-black rounded-[80px] overflow-hidden">
        <Canvas>
          <AnimatedScene />
        </Canvas>
      </div>
    </section>
  );
};

export default Hero;