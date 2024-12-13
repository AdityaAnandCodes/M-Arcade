import Hero from "../components/Hero";
import Footer from "../components/Footer";
import Web3GamingBenefits from "../components/Web3Benefits";

import AnimatedSection from "../components/AnimatedSection";

const Home2 = () => {
  return (
    <section className="w-dvw min-h-screen overflow-hidden">
      <Hero />
      <Web3GamingBenefits />
      <AnimatedSection />

      <Footer />
    </section>
  );
};

export default Home2;
