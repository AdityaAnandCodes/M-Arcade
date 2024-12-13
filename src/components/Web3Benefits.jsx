import React from 'react';
import { 
  Coins, 
  Lock, 
  Shuffle, 
  Globe, 
  Wallet, 
  ShieldCheck, 
  Award
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Web3GamingBenefits = () => {
  const benefits = [
    {
      icon: <Wallet className="w-10 h-10 text-blue-600" />,
      title: 'True Digital Ownership',
      description: 'Own in-game assets as real, tradable NFTs. Your game items are truly yours, not just licensed.'
    },
    {
      icon: <Coins className="w-10 h-10 text-green-600" />,
      title: 'Play-to-Earn Economy',
      description: 'Earn real cryptocurrency and valuable digital assets by playing and progressing in games.'
    },
    {
      icon: <Shuffle className="w-10 h-10 text-purple-600" />,
      title: 'Interoperable Assets',
      description: 'Use your game assets across multiple games and platforms, breaking traditional gaming silos.'
    },
    {
      icon: <Globe className="w-10 h-10 text-red-600" />,
      title: 'Global Community',
      description: 'Connect with a worldwide gaming ecosystem, transcending geographical and platform limitations.'
    },
    {
      icon: <ShieldCheck className="w-10 h-10 text-yellow-600" />,
      title: 'Transparent Gameplay',
      description: 'Blockchain ensures fair play, verifiable game mechanics, and prevents cheating.'
    },
    {
      icon: <Lock className="w-10 h-10 text-indigo-600" />,
      title: 'Secure Transactions',
      description: 'Decentralized platforms provide enhanced security and privacy for all in-game transactions.'
    }
  ];

  return (
    <section className="bg-white py-16 px-4 md:px-12">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Why Web3 Gaming?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Web3 gaming revolutionizes how we play, earn, and interact with digital worlds. 
            Experience a new era of gaming where players have real economic and creative power.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div 
              key={index} 
              className="bg-gray-50 p-6 rounded-xl hover:shadow-lg transition-all duration-300 space-y-4"
            >
              <div className="mb-4">
                {benefit.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{benefit.title}</h3>
              <p className="text-gray-600">{benefit.description}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12 flex justify-center">
          <Link to="/leaderboard">
          <button className="bg-black text-white flex gap-2 justify-center items-center px-8 py-3 rounded-full hover:bg-neutral-900 hover:scale-105 duration-300 transition-all">
            <Award /> Explore Leaderboards
          </button></Link>
        </div>
      </div>
    </section>
  );
};

export default Web3GamingBenefits;