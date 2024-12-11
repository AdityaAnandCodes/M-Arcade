import React from 'react';
import { Canvas } from "@react-three/fiber";
import AnimatedScene from './AnimatedScene';

const Hero = ({ heroSceneRef , heroRef }) => {
  return (
    <section className="min-h-screen max-sm:max-h-screen flex flex-col items-center p-8">
      <div className="logo text-6xl sm:text-[150px] md:text-[180px] lg:text-[200px] xl:text-[280px] max-h-fit mb-4 absolute top-1/7 z-5 left-1/5">
        M-Arcade
      </div>
      <p className="text-center mt-[220px] max-sm:mt-14 text-yl font-sans font-extralight italic text-xs max-sm:mb-2 sm:text-base md:text-sm lg:text-base xl:text-lg">
        Dive into the future of gaming! Stake, play, and earn on M-Arcade, where Web3 meets endless fun and rewards.
      </p>
      <div ref={heroRef} className='w-full'>
      <div 
        ref={heroSceneRef} 
        className="relative h-dvh w-full bg-black rounded-[80px] max-sm:rounded-[60px] overflow-hidden"
      >
        <Canvas>
          <AnimatedScene />
        </Canvas>
      </div>
      </div>
    </section>
  );
};

export default Hero;