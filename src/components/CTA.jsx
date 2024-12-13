import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const CTA = () => {
  useEffect(() => {
    // Bounce animation for the ball
    gsap.to('.bounce', {
      y: 150,
      yoyo: true,
      repeat: -1,
      ease: 'power1.in',
    });

    // Scroll-triggered animation for the text
    gsap.fromTo(
      '.scroll-text p',
      { opacity: 0, y: 50 }, // Starting values
      {
        opacity: 1,
        y: 0, // Final values
        duration: 1,
        stagger: 0.3,
        scrollTrigger: {
          trigger: '.scroll-text',
          start: 'top 80%', // Adjusted to align better with viewport
          end: 'bottom 20%',
          toggleActions: 'play none none none', // Animation plays once
        },
      }
    );
  }, []);

  return (
    <section className="max-h-screen h-64 p-6 text-white bg-black">
      <div className="grid grid-cols-2">
        <div className="text-7xl font-extralight flex gap-8 justify-center items-end scroll-text">
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
