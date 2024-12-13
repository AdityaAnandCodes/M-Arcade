import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const CTA = () => {
  useEffect(() => {
    const isSmallDevice = window.matchMedia('(max-width: 768px)').matches;

  // Set animation values based on screen size
  const yStart = isSmallDevice ? 50 : 100; // Smaller bounce for smaller devices
  const yEnd = isSmallDevice ? -30 : -80;

  // Bounce animation for the ball
  gsap.fromTo('.bounce', {
    y: yStart,
    scaleX: 1.05,
    scaleY: 0.95,
  }, {
    y: yEnd,
    repeat: -1,
    ease: 'power1.out',
    yoyo: true,
    scaleX: 0.95,
    scaleY: 1,
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
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play pause resume reverse',
        },
      }
    );
  }, []);

  return (
    <section className="max-h-screen h-auto md:h-80 pb-10 mb-10 text-white bg-black flex items-center justify-center rounded-3xl px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-0 w-full max-w-6xl">
        <div className="text-3xl md:text-7xl font-extralight flex flex-wrap  max-sm:flex-nowrap gap-4 md:gap-10 justify-center items-center md:items-end scroll-text text-center md:text-left">
          <p className="font-thin italic hover:animate-pulse w-full md:w-auto">Stake</p>
          <p className="font-light font-serif italic hover:animate-pulse w-full md:w-auto">Play</p>
          <p className="font-thin italic hover:animate-pulse w-full md:w-auto">Win</p>
        </div>
        <div className="w-full flex justify-center md:justify-end items-center md:items-start">
          <div className="bounce w-16 h-16 md:w-24 md:h-24 bg-white border-2  border-orange-500 rounded-full mr-20 max-sm:mr-0"></div>
        </div>
      </div>
    </section>
  );
};

export default CTA;