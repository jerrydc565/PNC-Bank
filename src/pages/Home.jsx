import React from 'react'
import Herosection from '../Components/Herosection'
import Features from '../Components/Features'
import Radom from '../Components/Radom'
import NewComponent from '../Components/NewComponent'
import Testimonials from '../Components/Testimonials'
import Footer from '../Components/Footer'

function Home() {
  return (
    <main>
      <Herosection />
      <Features />
      <Radom />
      <NewComponent />
      <Testimonials />
    </main>
  )
}

export default Home