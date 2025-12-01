import React from 'react'
import mobile from '../assets/image/mobile-bank-phone.png'
import { Link } from 'react-router-dom'

function NewComponent() {
  return (
    <section className="flex justify-between p-10 bg-[#fffafa] mt-10 items-center gap-10 max-w-6xl mx-auto">
      <div className="w-[55%] ">
        <h2 className="text-3xl font-bold">Financial Wellness</h2>
        <hr className="w-30 border-2 mt-3 border-[#c68100]" />
        <p className="mt-6 text-2xl">
          We can help you get a clear picture of where you are today and help
          you plan for the future you want with manageable, actionable steps.
        </p>
        
      </div>
      <div>
        <img src={mobile} alt="Mobile Bank Phone" className="w-80" />
      </div>
    </section>
  );
}

export default NewComponent