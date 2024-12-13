import Hero from "../components/Hero";
import Footer from "../components/Footer";
import Web3GamingBenefits from "../components/Web3Benefits";
import CTA from "../components/CTA";

const Home2 = () => {
  return (
    <section className="w-full min-h-screen">
      <Hero />
      <Web3GamingBenefits />

      <Footer />
    </section>
  );
};

export default Home2;
