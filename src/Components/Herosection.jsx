import React from "react";
import profile1 from "../assets/image/image1.jpg";
import profile2 from "../assets/image/image2.jpg";
import profile3 from "../assets/image/image3.jpg";
import { Link } from "react-router-dom";

function Herosection() {
  return (
    <main className="w-full flex justify-left min-h-[700px] h-[80vh] bg-blend-overlay bg-[#000000d3] bg-[url('/image/hero-section-img.jpg')] bg-cover bg-top px-20">
      <div className="text-white flex flex-col justify-left mt-40 w-[50%] ml-20 gap-6  ">
        <h1 className="font-bold text-5xl">Checking & Savings. Together.</h1>
        <p>
          Experience the next generation of banking with PNC. Secure, intuitive,
          and designed around your needs.
        </p>
        <div className="flex gap-5">
          <Link to={"/signup"}>
            <button className="bg-[#c07d00] p-2 px-6 rounded-xl text-white font-semibold hover:bg-[#935f00] cursor-pointer duration-300 transition-all">
              Get Started
            </button>
          </Link>

          <Link to={"/about-us"}>
            {" "}
            <button className="bg-transparent border border-white p-2 px-12 rounded-xl text-white font-semibold hover:bg-white hover:text-[#a46a00] cursor-pointer duration-300 transition-all">
              Learn More
            </button>
          </Link>
        </div>
        <section className="flex items-center gap-6 mt-10">
          <div className="flex items-center gap-[-40px]">
            <button className="w-11 h-11 rounded-4xl border-3 border-white overflow-hidden ">
              {" "}
              <img src={profile1} alt="" />
            </button>
            <button className="w-11 h-11 -ml-3 rounded-4xl border-3 border-white overflow-hidden ">
              {" "}
              <img src={profile3} alt="" />
            </button>
            <button className="w-11 h-11 -ml-3 rounded-4xl border-3 border-white overflow-hidden ">
              {" "}
              <img src={profile2} alt="" />
            </button>
          </div>
          <div>
            <section className="flex gap-1 ">
              <i className="fa-solid fa-star text-[#c07d00]"></i>
              <i className="fa-solid fa-star text-[#c07d00]"></i>
              <i className="fa-solid fa-star text-[#c07d00]"></i>
              <i className="fa-solid fa-star text-[#c07d00]"></i>
              <i className="fa-solid fa-star text-[#c07d00]"></i>
            </section>

            <p>Trusted by over 2 million customers</p>
          </div>
        </section>
      </div>
    </main>
  );
}

export default Herosection;
