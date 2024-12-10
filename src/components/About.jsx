import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { Rocket, Infinity, Award, DollarSign } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const content = sectionRef.current.querySelectorAll(".about-content");

    gsap.fromTo(
      content,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.2,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      }
    );
  }, []);

  return (
    <div className="flex">
        
    <section
      ref={sectionRef}
      className="min-h-screen flex flex-col items-center justify-center p-8 space-y-10 text-center"
    >
      {/* Heading */}
      <div className="about-content text-4xl sm:text-5xl font-extrabold">
        Welcome to <span className="underline">M-Arcade</span>
      </div>
      {/* Subheading */}
      <p className="about-content text-base sm:text-lg max-w-2xl mx-auto font-light">
        Where blockchain meets gaming! At M-Arcade, we believe in empowering gamers by combining
        the thrill of gameplay with the innovation of Web3 technology. Dive into our play-and-earn
        ecosystem built on the Mantle platform.
      </p>
      {/* Features */}
      <div className="about-content grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl">
        {/* Feature 1 */}
        <div className="flex flex-col items-center space-y-4">
          <Rocket className="w-12 h-12" />
          <h3 className="text-lg font-semibold">Powered by Mantle</h3>
          <p className="text-sm font-light">
            Experience seamless staking and gaming with the power of Mantle's blockchain.
          </p>
        </div>
        {/* Feature 2 */}
        <div className="flex flex-col items-center space-y-4">
          <Infinity className="w-12 h-12" />
          <h3 className="text-lg font-semibold">Unlimited Potential</h3>
          <p className="text-sm font-light">
            Our platform offers boundless opportunities to play, stake, and earn like never before.
          </p>
        </div>
        {/* Feature 3 */}
        <div className="flex flex-col items-center space-y-4">
          <Award className="w-12 h-12" />
          <h3 className="text-lg font-semibold">Community Rewards</h3>
          <p className="text-sm font-light">
            Join a thriving community and earn rewards through engaging gameplay and contributions.
          </p>
        </div>
        {/* Feature 4 */}
        <div className="flex flex-col items-center space-y-4">
          <DollarSign className="w-12 h-12" />
          <h3 className="text-lg font-semibold">Play and Earn</h3>
          <p className="text-sm font-light">
            Turn your gaming skills into earnings with our innovative play-to-earn model.
          </p>
        </div>
      </div>
    </section>
    <div className="w-full"></div>
    </div>
  );
};

export default About;
