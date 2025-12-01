import React from "react";
import saving from "../assets/image/saving.avif";
import { Link } from "react-router-dom";
import check from "../assets/image/checked.png";
function SavingAccounts() {
  return (
    <main className="bg-white">
      <section className="flex flex-col lg:flex-row bg-[url('/image/lady.svg')] max-h-6xl bg-cover bg-center bg-blend-overlay gap-6 lg:gap-30 justify-center p-6 sm:p-10 w-full min-h-[500px] sm:min-h-[600px] lg:min-h-[700px] lg:h-[80vh] bg-[#040c00eb] items-center px-4 sm:px-10 lg:px-20">
        <div className="text-white w-full lg:w-[50%] max-w-2xl">
          <h1 className="font-bold mb-4 sm:mb-5 text-3xl sm:text-4xl lg:text-5xl 2xl:text-6xl">
            Grow your savings with competitive rates
          </h1>
          <p className="mb-3 sm:mb-4 text-sm sm:text-base">
            High-yield savings accounts with no minimum balance requirements and
            easy access to your funds.
          </p>
          <Link to={"/signup"}>
            {" "}
            <button className="flex gap-2 w-fit items-center bg-white font-medium cursor-pointer text-[#06c000] rounded-xl p-2 sm:p-3 text-sm sm:text-base">
              Start Saving Today <i className="fa-solid fa-arrow-right"></i>
            </button>
          </Link>
        </div>
        <div className="hidden lg:block">
          {" "}
          <img
            src={saving}
            alt=""
            className="w-full max-w-md xl:w-150 rounded-2xl shadow-md"
          />
        </div>
      </section>
      <section className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-10">
        <h2 className="font-black text-black text-xl sm:text-2xl mb-3 sm:mb-4 text-center">
          Choose your savings account
        </h2>
        <p className="text-base sm:text-lg text-[#3f3f3f] mb-6 sm:mb-10 text-center">
          All accounts are FDIC insured up to $250,000
        </p>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
          <div className="w-full p-6 sm:p-8 lg:p-10 border-2 border-[#cdcdcd] rounded py-15 hover:border-[#06c000] bg-white">
            <h3 className="text-xl sm:text-2xl font-bold text-black">
              Standard Savings
            </h3>
            <p className="flex items-center">
              <span className="text-3xl sm:text-4xl lg:text-5xl mt-2 sm:mt-3 mb-2 font-bold text-[#06c000]">
                1.50%
              </span>{" "}
              <span className="font-bold text-[#4b4b4b]">/APY</span>
            </p>
            <p className="text-[15px] text-[#979797]">
              Annual Percentage Yield
            </p>
            <ul className="flex flex-col gap-3 mt-5 mb-5 text-[#4b4b4b]">
              <li className="flex items-center gap-2">
                {" "}
                <img src={check} alt="" className="w-4" />
                No minimum balance
              </li>
              <li className="flex items-center gap-2">
                {" "}
                <img src={check} alt="" className="w-4" />
                No monthly fees
              </li>
              <li className="flex items-center gap-2">
                {" "}
                <img src={check} alt="" className="w-4" />
                Easy online transfers
              </li>
              <li className="flex items-center gap-2">
                {" "}
                <img src={check} alt="" className="w-4" />
                Mobile app access
              </li>
            </ul>
            <Link to={"/signup"}>
              {" "}
              <button className="w-full p-3 bg-transparent border-2 rounded-xl font-medium hover:bg-[#e1ffe4]  cursor-pointer border-[#06c000] text-[#06c000]">
                Open Account
              </button>
            </Link>
          </div>
          <div className="w-full p-10 border-2 border-[#06c000] rounded py-15 z-0  bg-white relative">
            <h3 className="text-2xl  font-bold text-black">
              High-Yield Savings
            </h3>
            <p className="flex items-center ">
              <span className="text-5xl mt-3 mb-2 font-bold text-[#06c000]">
                3.50%
              </span>{" "}
              <span className="font-bold text-[#4b4b4b]">APY</span>
            </p>
            <p className="text-[15px] text-[#979797]">
              Annual Percentage Yield
            </p>
            <ul className="flex flex-col gap-3 mt-5 mb-5 text-[#4b4b4b]">
              <li className="flex items-center gap-2">
                {" "}
                <img src={check} alt="" className="w-4" />
                Everything in Standard
              </li>
              <li className="flex items-center gap-2">
                {" "}
                <img src={check} alt="" className="w-4" />
                Higher interest rate
              </li>
              <li className="flex items-center gap-2">
                {" "}
                <img src={check} alt="" className="w-4" />
                Automatic savings tools
              </li>
              <li className="flex items-center gap-2">
                {" "}
                <img src={check} alt="" className="w-4" />
                Goal-based savings features
              </li>
            </ul>
            <Link to={"/signup"}>
              <button className="w-full p-3 rounded-xl bg-[#06c000] text-white font-medium cursor-pointer  hover:bg-[#035800]">
                Open Account
              </button>
            </Link>

            <button className="px-8 rounded-2xl py-1 text-white bg-[#06c000] absolute -top-4 left-1/2">
              Best Rate
            </button>
          </div>
        </section>
      </section>
      <section className="max-w-6xl mb-10  mx-auto gap-4  p-10">
        <h2 className="text-center font-black text-2xl">
          Why save with BankSmart?
        </h2>

        <section className="grid mt-16 gap-10 md:grid-cols-3 text-center">
          <div className="flex flex-col gap-3 items-center">
            <button className="w-15 h-15 bg-[#06c0005d] rounded-full p-1">
              <i className="fa-solid fa-arrow-trend-up text-2xl text-[#06c000]"></i>
            </button>
            <h4 className="font-bold text-xl text-black">Competitive Rates</h4>
            <p className="text-lg ">
              Earn more with our industry-leading interest rates
            </p>
          </div>
          <div className="flex flex-col gap-3 items-center">
            <button className="w-15 h-15 bg-[#06c0005d] rounded-full p-1">
              <i className="fa-solid fa-piggy-bank text-2xl text-[#06c000]"></i>
            </button>
            <h4 className="font-bold text-xl  text-black">Automatic Savings</h4>
            <p className="text-lg ">
              Set up recurring transfers and watch your savings grow
            </p>
          </div>
          <div className="flex flex-col gap-3 items-center">
            <button className="w-15 h-15 bg-[#06c0005d] rounded-full p-1">
              <i className="fa-solid fa-shield text-2xl text-[#06c000]"></i>
            </button>
            <h4 className="font-bold text-xl  text-black">FDIC Insured</h4>
            <p className="text-lg ">
              Your savings are protected up to $250,000
            </p>
          </div>
        </section>
      </section>
    </main>
  );
}

export default SavingAccounts;
