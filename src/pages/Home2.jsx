
import Hero from '../components/Hero'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Web3GamingBenefits from '../components/Web3Benefits'
import CTA from '../components/CTA'

const Home2 = () => {
  return (
    <section className='w-full min-h-screen'>
        <Navbar />
        <Hero />
        <Web3GamingBenefits />
        <CTA />
        <Footer />
    </section>
  )
}

export default Home2