import Image from 'next/image';
import Link from 'next/link';

const Hero = () => {
  return (
    <section className="relative ">
      <div className="container mx-auto px-4 py-16 text-center">
        {/* Logo or Hero Image */}
        <div className="mb-6">
          <Image
            src="/arcade-logo.png" // Replace with your logo or hero image
            alt="M-Arcade Logo"
            width={150}
            height={150}
            className="mx-auto"
            priority
          />
        </div>

        {/* Headline and Description */}
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Welcome to <span className="text-indigo-600">M-Arcade</span>
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-8">
          Discover exciting blockchain games, play, and explore a new era of gaming.
          Dive into thrilling adventures and experience innovation at its best.
        </p>

        {/* CTA Button */}
        <Link href="/games">
          <div className="px-6 py-3 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-all">
            Explore Games
          </div>
        </Link>
      </div>

      {/* Decorative Arcade Background */}
      <div className="absolute inset-0 -z-10 opacity-20">
        <Image
          src="/arcade-background.jpg" // Replace with a decorative arcade-themed background
          alt="Arcade Background"
          layout="fill"
          objectFit="cover"
        />
      </div>
    </section>
  );
};

export default Hero;
