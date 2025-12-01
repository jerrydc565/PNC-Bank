import React from "react";
import { Link } from "react-router-dom";
import check from "../assets/image/checked.png";
import creditCard from "../assets/image/credit-card.avif";
function CreditCard() {
  return (
    <main className="bg-white">
      <section className="flex flex-col lg:flex-row bg-[url('/image/lady.svg')] max-h-6xl bg-cover bg-center bg-blend-overlay gap-6 lg:gap-30 justify-center p-6 sm:p-10 w-full min-h-[500px] sm:min-h-[600px] lg:min-h-[700px] lg:h-[80vh] bg-[#08000ceb] items-center px-4 sm:px-10 lg:px-20">
        <div className="text-white w-full lg:w-[50%] max-w-2xl">
          <h1 className="font-bold mb-4 sm:mb-5 text-3xl sm:text-4xl lg:text-5xl 2xl:text-6xl">
            Credit cards that reward you
          </h1>
          <p className="mb-3 sm:mb-4 text-sm sm:text-base">
            Earn cash back, travel rewards, and exclusive benefits with our
            range of credit cards designed for every lifestyle.
          </p>
          <Link to={"/signup"}>
            {" "}
            <button className="flex gap-2 items-center bg-white font-medium cursor-pointer text-[#8a00c0] rounded-xl p-2 sm:p-3 text-sm sm:text-base">
              Apply Now <i className="fa-solid fa-arrow-right"></i>
            </button>
          </Link>
        </div>
        <div className="hidden lg:block">
          {" "}
          <img
            src={creditCard}
            alt=""
            className="w-full max-w-md xl:w-150 rounded-2xl shadow-md"
          />
        </div>
      </section>
      <section className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-10">
        <h2 className="font-black text-black text-xl sm:text-2xl mb-3 sm:mb-4 text-center">
          Find your perfect card
        </h2>
        <p className="text-base sm:text-lg text-[#3f3f3f] mb-6 sm:mb-10 text-center">
          Compare features and rewards to choose the best card for you
        </p>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
          <div className="w-full p-6 sm:p-8 lg:p-10 border-2 border-[#cdcdcd] rounded py-15 hover:border-[#8a00c0] bg-white">
            <div className="p-20 w-full bg-[#c07d00] mb-4 rounded-xl flex justify-center items-center ">
              {" "}
              <i className="fa-regular fa-credit-card text-[#ffffff] text-5xl"></i>
            </div>
            <h3 className="text-2xl  font-bold text-black">Cash Back Card</h3>
            <p className="text-[15px] text-[#979797]">
              Earn cash back on every purchase
            </p>

            <ul className="flex flex-col gap-3 mt-5 mb-5 text-[#4b4b4b]">
              <li className="flex items-center gap-2">
                {" "}
                <img src={check} alt="" className="w-4" />
                3% cash back on dining
              </li>
              <li className="flex items-center gap-2">
                {" "}
                <img src={check} alt="" className="w-4" />
                2% on groceries & gas
              </li>
              <li className="flex items-center gap-2">
                {" "}
                <img src={check} alt="" className="w-4" />
                1% on all other purchases
              </li>
              <li className="flex items-center gap-2">
                {" "}
                <img src={check} alt="" className="w-4" />
                $0 annual fee
              </li>
            </ul>
            <Link to={"/signup"}>
              {" "}
              <button className="w-full p-3 bg-transparent border-2 rounded-xl font-medium hover:bg-[#f5daff]  cursor-pointer border-[#8a00c0] text-[#8a00c0]">
                Apply Now
              </button>
            </Link>
          </div>
          <div className="w-full p-10 border-2 border-[#8a00c0] rounded py-15 z-0  bg-white relative">
            <div className="p-20 w-full bg-[#8a00c0] mb-4 rounded-xl  flex justify-center items-center">
              {" "}
              <i className="fa-regular fa-credit-card text-[#ffffff] text-5xl"></i>
            </div>
            <h3 className="text-2xl  font-bold text-black">Travel Rewards</h3>
            <p className="text-[15px] text-[#979797]">
              Earn points for travel and more
            </p>
            <ul className="flex flex-col gap-3 mt-5 mb-5 text-[#4b4b4b]">
              <li className="flex items-center gap-2">
                {" "}
                <img src={check} alt="" className="w-4" />
                3x points on travel & dining
              </li>
              <li className="flex items-center gap-2">
                {" "}
                <img src={check} alt="" className="w-4" />
                50,000 bonus points
              </li>
              <li className="flex items-center gap-2">
                {" "}
                <img src={check} alt="" className="w-4" />
                No foreign transaction fees
              </li>
              <li className="flex items-center gap-2">
                {" "}
                <img src={check} alt="" className="w-4" />
                $95 annual fee
              </li>
            </ul>
            <Link to={"/signup"}>
              <button className="w-full p-3 rounded-xl bg-[#8a00c0] text-white font-medium cursor-pointer  hover:bg-[#450061]">
                Apply Now
              </button>
            </Link>

            <button className="px-8 rounded-2xl py-1 text-white bg-[#8a00c0] absolute -top-4 left-1/2">
              Most Popular
            </button>
          </div>

          <div className="w-full p-10 border-2 border-[#cdcdcd] rounded py-15 hover:border-[#8a00c0] bg-white">
            <div className="p-20 w-full bg-[#06c000] mb-4 rounded-xl flex justify-center items-center ">
              {" "}
              <i className="fa-regular fa-credit-card text-[#ffffff] text-5xl"></i>
            </div>
            <h3 className="text-2xl  font-bold text-black">Platinum Elite</h3>
            <p className="text-[15px] text-[#979797]">
              Premium benefits and rewards
            </p>
            <ul className="flex flex-col gap-3 mt-5 mb-5 text-[#4b4b4b]">
              <li className="flex items-center gap-2">
                {" "}
                <img src={check} alt="" className="w-4" />
                5x points on all purchases
              </li>
              <li className="flex items-center gap-2">
                {" "}
                <img src={check} alt="" className="w-4" />
                Airport lounge access
              </li>
              <li className="flex items-center gap-2">
                {" "}
                <img src={check} alt="" className="w-4" />
                Concierge service
              </li>
              <li className="flex items-center gap-2">
                {" "}
                <img src={check} alt="" className="w-4" />
                $450 annual fee
              </li>
            </ul>
            <Link to={"/signup"}>
              {" "}
              <button className="w-full p-3 bg-transparent border-2 rounded-xl border-[#8a00c0] text-[#8a00c0] font-medium hover:bg-[#f5daff] cursor-pointer">
                Apply Now
              </button>
            </Link>
          </div>
        </section>
      </section>
      <section className="max-w-6xl mb-10  mx-auto  p-10">
        <h2 className="text-center font-black text-2xl">
          Why choose our credit cards?
        </h2>

        <section className="grid gap-10 mt-16 md:grid-cols-4 text-center">
          <div className="flex flex-col gap-3 items-center">
            <button className="w-15 h-15 bg-[#8a00c061] rounded-full p-1">
              <i className="fa-solid fa-gift text-2xl text-[#8a00c0]"></i>
            </button>
            <h4 className="font-bold text-xl text-black">Rewards</h4>
            <p className="text-lg ">
              Earn points or cash back on every purchase
            </p>
          </div>
          <div className="flex flex-col gap-3 items-center">
            <button className="w-15 h-15 bg-[#8a00c061] rounded-full p-1">
              <i className="fa-solid fa-shield text-2xl text-[#8a00c0]"></i>
            </button>
            <h4 className="font-bold text-xl  text-black">Protection</h4>
            <p className="text-lg ">
              Zero fraud liability and purchase protection
            </p>
          </div>
          <div className="flex flex-col gap-3 items-center">
            <button className="w-15 h-15 bg-[#8a00c061] rounded-full p-1">
              <i className="fa-solid fa-percent text-2xl text-[#8a00c0]"></i>
            </button>
            <h4 className="font-bold text-xl  text-black">0% Intro APR</h4>
            <p className="text-lg ">
              15 months intro APR on purchases and transfers
            </p>
          </div>
          <div className="flex flex-col gap-3 items-center">
            <button className="w-15 h-15 bg-[#8a00c061] rounded-full p-1">
              <i className="fa-regular fa-credit-card text-2xl text-[#8a00c0]"></i>
            </button>
            <h4 className="font-bold text-xl  text-black">Contactless</h4>
            <p className="text-lg ">
              Tap to pay with secure contactless technology
            </p>
          </div>
        </section>
      </section>
    </main>
  );
}

export default CreditCard;
