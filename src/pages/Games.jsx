import Navbar from "../components/Navbar";
import { GAMES } from "../constants/index";
import { Rocket } from "lucide-react";
import gsap from "gsap";
import { Link } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import Footer from "../components/Footer";
import CTA from "../components/CTA";

const Games = () => {
  useGSAP(() => {
    gsap.fromTo(
      ".game-card",
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.2,
        delay: 0.2,
        ease: "power1.inOut",
      }
    );
  }, []);

  return (
    <section className="min-h-screen bg-white">
      <Navbar />
      
      <div className="container mx-auto py-12 pt-2 px-4">
        
          <CTA />
        
        <h1 className="text-4xl font-sans font-bold text-center mb-10">
          Available Games
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {GAMES.map((game) => (
            <div
              key={game.id}
              className="game-card bg-white border border-black  rounded-lg shadow-md p-6 flex flex-col justify-between hover:scale-125 duration-500 transition-all"
            >
              <img
                src={game.image}
                alt={game.title}
                className="w-full h-40 object-cover rounded-md mb-4"
              />
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {game.title}
                  </h2>
                  <Rocket className="text-black" size={24} />
                </div>
                <p className="text-gray-600 text-sm mb-4">{game.description}</p>
              </div>
              <div>
                <div className="text-gray-700 text-sm mb-4">
                  <p>
                    <span className="font-bold">Cost:</span> {game.cost}
                  </p>
                  <p>
                    <span className="font-bold">Rewards:</span> {game.rewards}
                  </p>
                </div>
                <Link to={game.url}>
                  <button className="w-full bg-black text-white py-2 rounded-md hover:bg-neutral-800 hover:scale-105 duration-300 transition-all">
                    Play Now
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </section>
  );
};

export default Games;
