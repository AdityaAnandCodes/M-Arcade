import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import About from "../components/About";
import Hero from "../components/Hero";
import Navbar from "../components/Navbar";

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  const heroSceneRef = useRef(null);
  const aboutSceneRef = useRef(null);
  const heroRef = useRef(null)

  useEffect(() => {
    // Scene Movement Trigger
    ScrollTrigger.create({
      trigger: "#about",
      start: "top top", // When about section starts at top of viewport
      onEnter: () => {
        // Move the scene from hero to about container
        const heroScene = heroSceneRef.current;
        const aboutScene = aboutSceneRef.current;

        if (heroScene && aboutScene) {
          aboutScene.appendChild(heroScene);
        }
      },
      onLeaveBack: () => {
        // Move the scene back to hero container
        const heroScene = heroSceneRef.current;
        const aboutScene = aboutSceneRef.current;

        if (heroScene && aboutScene) {
          heroScene.appendChild(heroScene);
        }
      }
    });

    // Hero Section Color Transition
    ScrollTrigger.create({
      trigger: "#hero",
      start: "top 50%",
      end: "bottom 50%",
      onEnter: () => {
        gsap.to("main", {
          backgroundColor: "var(--pl)",
          color: "var(--yl)",
          duration: 0.5,
        });
      },
      onEnterBack: () => {
        gsap.to("main", {
          backgroundColor: "var(--pl)",
          color: "var(--yl)",
          duration: 0.5,
        });
      },
    });

    // About Section Color Transition
    ScrollTrigger.create({
      trigger: "#about",
      start: "top 50%",
      end: "bottom 50%",
      onEnter: () => {
        gsap.to("main", {
          backgroundColor: "var(--sk)",
          color: "var(--db)",
          duration: 0.5,
        });
      },
      onLeaveBack: () => {
        gsap.to("main", {
          backgroundColor: "var(--pl)",
          color: "var(--yl)",
          duration: 0.5,
        });
      },
    });

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <main className="min-h-screen transition-colors duration-500 relative">
      <Navbar />
      <section id="hero" className="min-h-screen">
        <Hero heroSceneRef={heroSceneRef} />
      </section>
      <section id="about" className="min-h-screen">
        <About aboutSceneRef={aboutSceneRef} />
      </section>
    </main>
  );
};

export default Home;