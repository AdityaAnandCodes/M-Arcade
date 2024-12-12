import React, { useEffect } from 'react';
import { gsap, SteppedEase } from 'gsap';

const About = () => {
  useEffect(() => {
    const tl = gsap.timeline({ paused: true });

    // Get the full width of the text
    const textElement = document.querySelector('.anim-typewriter');
    const textWidth = textElement.scrollWidth;

    // Letter animation
    tl.fromTo(
      '.anim-typewriter',
      { width: '0' },
      {
        width: `${textWidth}px`,  // Dynamic width based on the text length
        ease: SteppedEase.config(37),
        duration: 8, // Adjust the duration based on your preference
      }
    );

    // Text cursor animation
    tl.fromTo(
      '.anim-typewriter',
      { borderRightColor: 'rgba(255,255,255,0.75)' },
      {
        borderRightColor: 'rgba(255,255,255,0)',
        repeat: -1,
        duration: 0.5,
        ease: SteppedEase.config(37),
      },
      0
    );

    tl.play();
  }, []);

  return (
    <div className="h-screen flex items-center justify-center w-full p-5 ">
      <div className='w-full flex items-start justify-start flex-wrap '>
      <p
        className="line-1 anim-typewriter flex  flex-wrap border-r-2 border-white md:text-2xl font-bold text-3xl"
        style={{ whiteSpace: 'nowrap', overflow:"hidden" }}
      >
        M-Arcade is the ultimate Web3 arcade platform built on the Mantle blockchain. Stake your assets, play thrilling games, and earn incredible rewards. Dive into the future of gaming where skill meets blockchain technology.
      </p>
      </div>
    </div>
  );
};

export default About;
