import React from 'react';
import { Canvas } from "@react-three/fiber";
import AnimatedScene from './AnimatedScene';

const Hero = () => {
  return (
    <section className="max-h-screen max-sm:max-h-screen flex flex-col items-center p-8 max-sm:p-6 max-sm:pt-2">
      
      <div 
        className="relative h-dvh w-full bg-black rounded-[80px] max-sm:rounded-[40px] overflow-hidden"
      >
        <div className="logo text-white text-center max-sm:mt-8 text-6xl sm:text-[150px] md:text-[180px] lg:text-[200px] xl:text-[280px] max-h-fit mb-4 z-21">
        M-Arcade
      </div>
      <p className="text-center mt-[280px] max-sm:mt-4 text-gray-200 font-extralight italic text-xs max-sm:mb-2 sm:text-base md:text-sm lg:text-base xl:text-lg">
        Dive into the future of gaming! Stake, play, and earn on M-Arcade, where Web3 meets endless fun and rewards.
      </p>
      <div className='w-full h-full absolute top-0 left-0'>
        <Canvas>
          <AnimatedScene />
        </Canvas>
      </div>
      </div>
    </section>
  );
};

export default Hero;