import React from "react";
import profile1 from "../assets/image/image1.jpg";
import profile2 from "../assets/image/image2.jpg";
import profile3 from "../assets/image/image3.jpg";
import { Link } from "react-router-dom";

function Herosection() {
  return (
    <main className="w-full flex justify-left min-h-[500px] sm:min-h-[600px] lg:min-h-[700px] h-[60vh] sm:h-[70vh] lg:h-[80vh] bg-blend-overlay bg-[#000000d3] bg-[url('/image/hero-section-img.jpg')] bg-cover bg-top px-4 sm:px-8 md:px-12 lg:px-20">
      <div className="text-white flex flex-col justify-center sm:justify-left mt-10 sm:mt-20 md:mt-32 lg:mt-40 w-full sm:w-[80%] md:w-[70%] lg:w-[50%] ml-0 sm:ml-4 md:ml-8 lg:ml-20 gap-4 sm:gap-5 lg:gap-6">
        <h1 className="font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
          Checking & Savings. Together.
        </h1>
        <p className="text-sm sm:text-base lg:text-lg">
          Experience the next generation of banking with PNC. Secure, intuitive,
          and designed around your needs.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-5">
          <Link to={"/signup"}>
            <button className="bg-[#c07d00] p-2 px-6 sm:px-8 rounded-xl text-white text-sm sm:text-base font-semibold hover:bg-[#935f00] cursor-pointer duration-300 transition-all w-full sm:w-auto">
              Get Started
            </button>
          </Link>

          <Link to={"/about-us"}>
            {" "}
            <button className="bg-transparent border border-white p-2 px-8 sm:px-12 rounded-xl text-white text-sm sm:text-base font-semibold hover:bg-white hover:text-[#a46a00] cursor-pointer duration-300 transition-all w-full sm:w-auto">
              Learn More
            </button>
          </Link>
        </div>
        <section className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 mt-6 sm:mt-8 lg:mt-10">
          <div className="flex items-center gap-[-40px]">
            <button className="w-10 h-10 sm:w-11 sm:h-11 rounded-4xl border-3 border-white overflow-hidden ">
              {" "}
              <img src={profile1} alt="" />
            </button>
            <button className="w-10 h-10 sm:w-11 sm:h-11 -ml-3 rounded-4xl border-3 border-white overflow-hidden ">
              {" "}
              <img src={profile3} alt="" />
            </button>
            <button className="w-10 h-10 sm:w-11 sm:h-11 -ml-3 rounded-4xl border-3 border-white overflow-hidden ">
              {" "}
              <img src={profile2} alt="" />
            </button>
          </div>
          <div>
            <section className="flex gap-1 ">
              <i className="fa-solid fa-star text-[#c07d00] text-xs sm:text-sm"></i>
              <i className="fa-solid fa-star text-[#c07d00] text-xs sm:text-sm"></i>
              <i className="fa-solid fa-star text-[#c07d00] text-xs sm:text-sm"></i>
              <i className="fa-solid fa-star text-[#c07d00] text-xs sm:text-sm"></i>
              <i className="fa-solid fa-star text-[#c07d00] text-xs sm:text-sm"></i>
            </section>

            <p className="text-xs sm:text-sm lg:text-base">
              Trusted by over 2 million customers
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

export default Herosection;
