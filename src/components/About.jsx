const About = ({ aboutSceneRef }) => {
  return (
    <section className='min-h-screen p-4'>
      <div></div>
      <div className='grid grid-cols-2 gap-4'>
        <div></div>
        <div 
          ref={aboutSceneRef} 
          className='rounded-3xl w-full h-dvh'
        >
          {/* The AnimatedScene will be moved here by ScrollTrigger */}
        </div>
      </div>
    </section>
  )
}

export default About