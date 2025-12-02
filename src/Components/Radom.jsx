import React from 'react'
import { Link } from 'react-router-dom';

function Radom() {
  return (
    <section className="p-10 bg-[#c07d00] mt-20 py-15">
      <section className="flex md:flex-row flex-col justify-between max-w-6xl mx-auto">
        <div className="md:w-[50%] mb-10 md:mb-0">
          <h2 className="font-bold text-4xl text-white ">
            Ready to get started? <br />
            <span className="text-[#ffe6b7]">Open an account in minutes</span>
          </h2>
        </div>
        <div className="flex gap-4 items-center">
          <Link to={"/signup"}>
            <button className="px-8  rounded-2xl font-semibold hover:bg-[#4a2f00] cursor-pointer p-3 duration-300 transition-all bg-[#2c1c00] text-[#c07d00]">
              Get Started
            </button>
          </Link>

          <Link to={"/about-us"}>
            <button className="px-8  rounded-2xl font-semibold bg-[#ffe6b7] cursor-pointer p-3 duration-300 transition-all hover:bg-[#ffb428] text-[#c07d00]">
              Learn More
            </button>
          </Link>
        </div>
        
      </section>
    </section>
  );
}

export default Radom