import React from "react";
import { motion } from "framer-motion";
import checking from "../assets/image/checkingg.avif";
import check from "../assets/image/checked.png";
import mobile from "../assets/image/smartphone.png";
import { Link } from "react-router-dom";

const fadeInUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

function CheckingAccounts() {
  return (
    <main className="bg-white">
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeInUp}
        className="flex flex-col lg:flex-row bg-[url('/image/lady.svg')] max-h-6xl bg-cover bg-center bg-blend-overlay gap-6 lg:gap-30 justify-center p-6 sm:p-10 w-full min-h-[500px] sm:min-h-[600px] lg:min-h-[700px] lg:h-[80vh] bg-[#0c0800eb] items-center px-4 sm:px-10 lg:px-20"
      >
        <div className="text-white w-full lg:w-[50%] max-w-2xl">
          <h1 className="font-bold mb-4 sm:mb-6 text-3xl sm:text-4xl lg:text-5xl 2xl:text-6xl">
            Checking accounts designed for your lifestyle
          </h1>
          <p className="mb-4 sm:mb-6 text-sm sm:text-base">
            Choose from our range of checking accounts with no monthly fees,
            unlimited transactions, and exclusive benefits.
          </p>
          <Link to={"/signup"}>
            {" "}
            <button className="flex gap-2 items-center bg-white font-medium cursor-pointer text-[#c07d00] rounded-xl p-2 sm:p-3 text-sm sm:text-base">
              Open an Account <i className="fa-solid fa-arrow-right"></i>
            </button>
          </Link>
        </div>
        <div className="hidden lg:block">
          {" "}
          <img
            src={checking}
            alt=""
            className="w-full max-w-md xl:w-150 rounded-2xl shadow-md"
          />
        </div>
      </motion.section>
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerContainer}
        className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-10"
      >
        <h2 className="font-black text-black text-xl sm:text-2xl mb-3 sm:mb-4 text-center">
          Compare our checking accounts
        </h2>
        <p className="text-base sm:text-lg text-[#3f3f3f] mb-6 sm:mb-10 text-center">
          Find the perfect account for your needs
        </p>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
          <div className="w-full p-6 sm:p-8 lg:p-10 border-2 border-[#cdcdcd] rounded py-15 hover:border-[#c07d00] bg-white">
            <h3 className="text-xl sm:text-2xl font-bold text-black">
              Basic Checking
            </h3>
            <p className="flex items-center">
              <span className="text-3xl sm:text-4xl lg:text-5xl mt-2 sm:mt-3 mb-2 font-bold text-[#c07d00]">
                $0
              </span>{" "}
              <span className="font-bold text-sm sm:text-base text-[#4b4b4b]">
                /mo
              </span>
            </p>
            <ul className="flex flex-col gap-2 sm:gap-3 mt-4 sm:mt-5 mb-4 sm:mb-5 text-sm sm:text-base text-[#4b4b4b]">
              <li className="flex items-center gap-2">
                {" "}
                <img src={check} alt="" className="w-4" />
                No monthly maintenance fee
              </li>
              <li className="flex items-center gap-2">
                {" "}
                <img src={check} alt="" className="w-4" />
                Free debit card
              </li>
              <li className="flex items-center gap-2">
                {" "}
                <img src={check} alt="" className="w-4" />
                Online & mobile banking
              </li>
              <li className="flex items-center gap-2">
                {" "}
                <img src={check} alt="" className="w-4" />
                Access to 50,000+ ATMs
              </li>
            </ul>
            <Link to={"/signup"}>
              {" "}
              <button className="w-full p-3 bg-transparent border-2 rounded-xl font-medium hover:bg-[#fff5e1]  cursor-pointer border-[#c07d00] text-[#c07d00]">
                Open Account
              </button>
            </Link>
          </div>
          <div className="w-full p-6 sm:p-8 lg:p-10 border-2 border-[#c07d00] rounded py-15 z-0 bg-white relative">
            <h3 className="text-xl sm:text-2xl font-bold text-black">
              Premium Checking
            </h3>
            <p className="flex items-center">
              <span className="text-3xl sm:text-4xl lg:text-5xl mt-2 sm:mt-3 mb-2 font-bold text-[#c07d00]">
                $15
              </span>{" "}
              <span className="font-bold text-[#4b4b4b]">/mo</span>
            </p>
            <ul className="flex flex-col gap-3 mt-5 mb-5 text-[#4b4b4b]">
              <li className="flex items-center gap-2">
                {" "}
                <img src={check} alt="" className="w-4" />
                Everything in Basic
              </li>
              <li className="flex items-center gap-2">
                {" "}
                <img src={check} alt="" className="w-4" />
                Earn 0.25% APY on balance
              </li>
              <li className="flex items-center gap-2">
                {" "}
                <img src={check} alt="" className="w-4" />
                No ATM fees worldwide
              </li>
              <li className="flex items-center gap-2">
                {" "}
                <img src={check} alt="" className="w-4" />
                Free checks
              </li>
              <li className="flex items-center gap-2">
                {" "}
                <img src={check} alt="" className="w-4" />
                Overdraft protection
              </li>
            </ul>
            <Link to={"/signup"}>
              <button className="w-full p-3 rounded-xl bg-[#c07d00] text-white font-medium cursor-pointer  hover:bg-[#825500]">
                Open Account
              </button>
            </Link>

            <button className="px-8 rounded-2xl py-1 text-white bg-[#c07d00] absolute -top-4 left-1/2 -translate-x-1/2">
              Most Popular
            </button>
          </div>

          <div className="w-full p-10 border-2 border-[#cdcdcd] rounded py-15 hover:border-[#c07d00] bg-white">
            <h3 className="text-2xl  font-bold text-black">Elite Checking</h3>
            <p className="flex items-center ">
              <span className="text-5xl mt-3 mb-2 font-bold text-[#c07d00]">
                $25
              </span>{" "}
              <span className="font-bold text-[#4b4b4b]">/mo</span>
            </p>
            <ul className="flex flex-col gap-3 mt-5 mb-5 text-[#4b4b4b]">
              <li className="flex items-center gap-2">
                {" "}
                <img src={check} alt="" className="w-4" />
                Everything in Premium
              </li>
              <li className="flex items-center gap-2">
                {" "}
                <img src={check} alt="" className="w-4" />
                Earn 0.50% APY on balance
              </li>
              <li className="flex items-center gap-2">
                {" "}
                <img src={check} alt="" className="w-4" />
                Premium rewards credit card
              </li>
              <li className="flex items-center gap-2">
                {" "}
                <img src={check} alt="" className="w-4" />
                Dedicated relationship manager
              </li>
              <li className="flex items-center gap-2">
                {" "}
                <img src={check} alt="" className="w-4" />
                Priority customer service
              </li>
            </ul>
            <Link to={"/signup"}>
              {" "}
              <button className="w-full p-3 bg-transparent border-2 rounded-xl border-[#c07d00] text-[#c07d00] font-medium hover:bg-[#fff5e1] cursor-pointer">
                Open Account
              </button>
            </Link>
          </div>
        </section>
      </motion.section>
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeInUp}
        className="max-w-6xl mb-6 sm:mb-10 mx-auto p-4 sm:p-6 lg:p-10"
      >
        <h2 className="text-center font-black text-xl sm:text-2xl">
          Why choose PNC checking?
        </h2>

        <section className="grid gap-6 sm:gap-8 lg:gap-10 mt-8 sm:mt-12 lg:mt-16 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 text-center">
          <div className="flex flex-col gap-3 items-center">
            <button className="w-15 h-15 bg-[#c07d0061] rounded-full p-1">
              <i className="fa-solid fa-dollar-sign text-2xl text-[#c07d00]"></i>
            </button>
            <h4 className="font-bold text-xl text-black">No Hidden Fees</h4>
            <p className="text-lg ">
              Transparent pricing with no surprise charges
            </p>
          </div>
          <div className="flex flex-col gap-3 items-center">
            <button className="w-15 h-15 bg-[#c07d0061] rounded-full p-1">
              <i className="fa-regular fa-credit-card text-[#c07d00] text-2xl"></i>
            </button>
            <h4 className="font-bold text-xl  text-black">Free Debit Card</h4>
            <p className="text-lg ">Contactless card with fraud protection</p>
          </div>
          <div className="flex flex-col gap-3 items-center">
            <button className="w-15 h-15 bg-[#c07d0061] rounded-full p-1">
              <i className=" text-2xl fa-solid fa-mobile text-[#c07d00]"></i>
            </button>
            <h4 className="font-bold text-xl  text-black">Mobile Banking</h4>
            <p className="text-lg ">Manage your account anywhere, anytime</p>
          </div>
          <div className="flex flex-col gap-3 items-center">
            <button className="w-15 h-15 bg-[#c07d0061] rounded-full p-1">
              <i className=" text-2xl fa-regular fa-star text-[#c07d00] "></i>
            </button>
            <h4 className="font-bold text-xl  text-black">FDIC Insured</h4>
            <p className="text-lg ">
              Your deposits are protected up to $250,000
            </p>
          </div>
        </section>
      </motion.section>
    </main>
  );
}

export default CheckingAccounts;
