import Navbar from '../components/Navbar';
import { GAMES } from '../constants';
import { Rocket } from 'lucide-react';
import gsap from 'gsap';
import { Link } from 'react-router-dom';
import { useGSAP } from '@gsap/react';

const Games = () => {
  useGSAP(() => {
    gsap.fromTo(
      ".game-card",
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.2,delay : 0.2,  ease: "power1.inOut" }
    );
  }, []);

  return (
    <section className="min-h-screen bg-white">
      <Navbar />
      <div className="container mx-auto py-12 px-4">
        <h1 className="text-4xl font-sans font-bold text-center mb-10">Available Games</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {GAMES.map((game) => (
            <Link key={game.id} to={game.url}>
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
                  <h2 className="text-xl font-semibold text-gray-800">{game.title}</h2>
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
                <button className="w-full bg-black text-white py-2 rounded-md hover:bg-neutral-800 transition">
                  Play Now
                </button>
               
              </div>
               
            </div>
            </Link>
            
          ))}
        </div>
        
      </div>
      <footer className="bg-black text-white py-4 mt-20">
        <div className="container mx-auto text-center">
          <p className="text-sm">© 2024 Web3 Games Platform. All rights reserved.</p>
          <p className="text-sm">Powered by Web3 and Blockchain Technology</p>
        </div>
      </footer>
    </section>
  );
};

export default Games;