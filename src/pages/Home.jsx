import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import About from "../components/About";
import Hero from "../components/Hero";
import Navbar from "../components/Navbar";

gsap.registerPlugin(ScrollTrigger);

const Home = () => {

  useEffect(() => {

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
        <Hero  />
      </section>
      <section id="about" className="min-h-screen">
        <About  />
      </section>
    </main>
  );
};

export default Home;