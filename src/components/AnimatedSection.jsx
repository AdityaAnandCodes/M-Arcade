import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';


// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

const AnimatedSection = () => {
  const sectionRef = useRef(null);
  const revealRef = useRef(null);
  const textRef = useRef(null);
  const buttonRef = useRef(null);

  const initializeAnimations = () => {
    const section = sectionRef.current;
    const revealElement = revealRef.current;
    const textElement = textRef.current;
    const buttonElement = buttonRef.current;

    // Kill existing ScrollTriggers to prevent duplication
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());

    // Main timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: '-10% top',
        end: 'bottom bottom',
        scrub: 1,
        pin: true,
        anticipatePin: 1,
      },
      defaults: { ease: 'power2.inOut' }, // Default ease for consistency
    });

    // Apply blur effect during circle takeover and make the circle takeover slower
    tl.fromTo(
      section,
      { filter: 'blur(10px)' },
      { filter: 'blur(0px)', duration: 2 }
    );

    // Reveal background animation with slower transition
    tl.fromTo(
      revealElement,
      { clipPath: 'circle(0% at 50% 50%)' },
      { clipPath: 'circle(150% at 50% 50%)', duration: 4 }
    );

    // Text animation
    tl.fromTo(
      textElement,
      { opacity: 0, scale: 0.5, y: 50 },
      { opacity: 1, scale: 1, y: 0, duration: 1 },
      '-=1'
    );

    // Button animation
    tl.fromTo(
      buttonElement,
      { opacity: 0, scale: 0.5 },
      { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.7)' },
      '-=1'
    );
  };

  useEffect(() => {
    initializeAnimations();

    // Add a resize listener to reinitialize animations
    const handleResize = () => {
      initializeAnimations();
    };

    window.addEventListener('resize', handleResize);

    // Cleanup on component unmount
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="h-screen w-screen relative overflow-hidden"
    >
      {/* Reveal Layer */}
      <div
        ref={revealRef}
        className="absolute inset-0 bg-black z-10"
      >
        <div className="h-full w-full flex flex-col items-center justify-center text-white">
          {/* Content Container */}
          <div className="text-center px-4">
            <h2
              ref={textRef}
              className="text-6xl sm:text-7xl md:text-9xl font-bold opacity-0 font-mono"
            >
              Wanna Play?
            </h2>
            <Link to="/games">
            <button
              ref={buttonRef}
              className="mt-6 sm:mt-8 px-6 py-3 bg-white text-black text-lg sm:text-xl md:text-2xl rounded-lg opacity-0 hover:scale-105 duration-500 transition-all"
              aria-label="Let's Get Started"
            >
              Let's Get Started
            </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AnimatedSection;
