import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const CTA = () => {
  useEffect(() => {
    // Bounce animation for the ball
    gsap.fromTo('.bounce', {
      y: 100, 
    },{
      y:-80,
      repeat: -1,
      ease: 'power1.out',
      yoyo: true,
    });

    // Scroll-triggered animation for the text
    gsap.fromTo(
      '.scroll-text p',
      { opacity: 0, x: -150 }, // Starting values
      {
        opacity: 1,
        x: 0, // Final values
        duration: 1,
        stagger: 0.3,
        scrollTrigger: {
          trigger: '.scroll-text',
          start: 'top 80%', // Adjusted to align better with viewport
          end: 'bottom 20%',
          toggleActions: 'play pause resume reverse', // Animation plays once
        },
      }
    );
  }, []);

  return (
    <section className="max-h-screen h-80 pb-10 mb-10  text-white bg-black flex items-center justify-center rounded-3xl">
      <div className="grid grid-cols-2">
        <div className="text-7xl font-extralight flex gap-10 justify-center items-end scroll-text">
          <p className="font-thin italic hover:animate-pulse">Stake</p>
          <p className="font-light font-serif italic hover:animate-pulse">Play</p>
          <p className="font-thin italic hover:animate-pulse">Win</p>
        </div>
        <div className=" w-full flex justify-end items-start">
          <div className="bounce w-24 h-24 bg-white rounded-full"></div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
