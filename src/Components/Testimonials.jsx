import React from "react";
import profile1 from "../assets/image/image1.jpg"
import profile4 from "../assets/image/profile8.jpeg"
import profile5 from "../assets/image/profile5.jpeg"

function Testimonials() {
  return (
    <section className="bg-[#fcfaf6] p-20">
      <div className="max-w-4xl mx-auto text-center px-4">
        <h2 className="text-3xl font-bold text-center mb-2 mt-5 text-black ">
          Trusted by customers worldwide
        </h2>
        <p className="text-[#5f5f5f] text-lg">
          Here's what our customers are saying about their PNC experience.
        </p>
      </div>
      <section className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mt-9">
        <div className="bg-white p-6 rounded-lg shadow-md w-full">
          <section className="flex  mb-2 ">
            <i className="fa-solid fa-star text-[#c07d00]"></i>
            <i className="fa-solid fa-star text-[#c07d00]"></i>
            <i className="fa-solid fa-star text-[#c07d00]"></i>
            <i className="fa-solid fa-star text-[#c07d00]"></i>
            <i className="fa-solid fa-star text-[#c07d00]"></i>
          </section>
          <p className="text-[#5f5f5f] mb-4">
            "The mobile app is incredibly intuitive. I can manage all my
            accounts, pay bills, and track my spending in one place."
          </p>
          <section className="flex items-center gap-4">
            <div>
              {" "}
              <button className="w-11 h-11 rounded-4xl border-3 border-white overflow-hidden ">
                {" "}
                <img src={profile1} alt="" />
              </button>
            </div>
            <div>
              {" "}
              <p className="font-bold">Sarah Johnson</p>
              <p>Customer since 2020</p>
            </div>
          </section>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md w-full">
          <section className="flex  mb-2 ">
            <i className="fa-solid fa-star text-[#c07d00]"></i>
            <i className="fa-solid fa-star text-[#c07d00]"></i>
            <i className="fa-solid fa-star text-[#c07d00]"></i>
            <i className="fa-solid fa-star text-[#c07d00]"></i>
            <i className="fa-solid fa-star text-[#c07d00]"></i>
          </section>
          <p className="text-[#5f5f5f] mb-4">
            "The customer service is exceptional. Any time I've had an issue,
            they've resolved it quickly and professionally."
          </p>
          <section className="flex items-center gap-4">
            <div>
              {" "}
              <button className="w-11 h-11 rounded-4xl border-3 border-white overflow-hidden ">
                {" "}
                <img src={profile4} alt="" />
              </button>
            </div>
            <div>
              {" "}
              <p className="font-bold">Michael Chen</p>
              <p>Customer since 2019</p>
            </div>
          </section>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md w-full">
          <section className="flex mb-2 ">
            <i className="fa-solid fa-star text-[#c07d00]"></i>
            <i className="fa-solid fa-star text-[#c07d00]"></i>
            <i className="fa-solid fa-star text-[#c07d00]"></i>
            <i className="fa-solid fa-star text-[#c07d00]"></i>
            <i className="fa-solid fa-star text-[#c07d00]"></i>
          </section>
          <p className="text-[#5f5f5f] mb-4">
            "The financial insights have helped me save money, make better
            decisions. I've never felt more in control of my finances."
          </p>
          <section className="flex items-center gap-4">
            <div>
              {" "}
              <button className="w-11 h-11 rounded-4xl border-3 border-white overflow-hidden ">
                {" "}
                <img src={profile5} alt="" />
              </button>
            </div>
            <div>
              {" "}
              <p className="font-bold">David Williams</p>
              <p>Customer since 2021</p>
            </div>
          </section>
        </div>
      </section>
    </section>
  );
}

export default Testimonials;
