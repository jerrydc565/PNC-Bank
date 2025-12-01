import React from "react";
import resources from "../assets/image/resources.webp";
import smartPhone from "../assets/image/smartphone.png";
import security from "../assets/image/verified.png";
import card from "../assets/image/card.png";
import savings from "../assets/image/piggy.png";
import insights from "../assets/image/trend.png";
import fraud from "../assets/image/padlock.png";
import { Link } from "react-router-dom";

function Resources() {
  return (
    <main className="">
      <section className="bg-linear-to-r from-[#563800] to-[#1d1300]">
        <section className="pb-6 sm:pb-10 pt-10 sm:pt-20 lg:pt-30 min-h-[400px] sm:h-130 flex flex-col lg:flex-row items-center justify-between gap-6 max-w-5xl 2xl:max-w-7xl mx-auto w-full px-4 sm:px-6">
          <div className="w-full lg:w-[50%]">
            {" "}
            <h1 className="text-white font-bold text-2xl sm:text-3xl lg:text-4xl mb-3 sm:mb-4 2xl:text-5xl">
              Financial Resources & Education
            </h1>
            <p className="text-[#bebebe] text-sm sm:text-base lg:text-lg max-w-xl">
              Explore our library of financial tools, guides, and educational
              content to help you make informed decisions about your money.
            </p>
          </div>
          <div className="hidden lg:block">
            {" "}
            <img
              src={resources}
              alt=""
              className="w-full max-w-md lg:w-100 2xl:w-120 rounded-2xl"
            />
          </div>
        </section>
      </section>
      <section className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mt-6 sm:mt-10 p-4 sm:p-6 lg:p-10">
        {" "}
        <div className="bg-[#fcfaf6] p-6 w-full rounded-lg hover:shadow-md">
          <button className="bg-[#c07d0031] text-white py-4 px-4 rounded">
            <img
              src={smartPhone}
              alt="Mobile Banking"
              className="w-8 h-8 mx-auto"
            />
          </button>
          <h3 className="text-xl font-bold  mt-3 mb-1">Financial Guides</h3>
          <p className="text-[#5f5f5f]">
            Comprehensive guides on budgeting, saving, investing, and managing
            debt.
          </p>
        </div>{" "}
        <div className="bg-[#fcfaf6] p-6 w-full rounded-lg hover:shadow-md ">
          <button className="bg-[#c07d0031] text-white py-4 px-4 rounded">
            {" "}
            <img
              src={security}
              alt="Mobile Banking"
              className="w-8 h-8 mx-auto"
            />
          </button>
          <h3 className="text-xl font-bold  mt-3 mb-1">Video Tutorials</h3>
          <p className="text-[#5f5f5f]">
            Step-by-step video tutorials on using our banking services and
            managing your finances.
          </p>
        </div>{" "}
        <div className="bg-[#fcfaf6] p-6 w-full rounded-lg hover:shadow-md ">
          <button className="bg-[#c07d0031] text-white py-4 px-4 rounded">
            {" "}
            <img src={card} alt="Mobile Banking" className="w-8 h-8 mx-auto" />
          </button>
          <h3 className="text-xl font-bold  mt-3 mb-1">Integrity</h3>
          <p className="text-[#5f5f5f]">
            Interactive calculators for mortgages, loans, savings, and
            retirement planning.
          </p>
        </div>
        <div className="bg-[#fcfaf6] p-6 w-full rounded-lg hover:shadow-md ">
          <button className="bg-[#c07d0031] text-white py-4 px-4 rounded">
            {" "}
            <img
              src={savings}
              alt="Mobile Banking"
              className="w-8 h-8 mx-auto"
            />
          </button>
          <h3 className="text-xl font-bold  mt-3 mb-1">Blog & Articles</h3>
          <p className="text-[#5f5f5f]">
            Stay informed with the latest financial news, tips, and expert
            advice.
          </p>
        </div>
        <div className="bg-[#fcfaf6] p-6 w-full rounded-lg hover:shadow-md ">
          <button className="bg-[#c07d0031] text-white py-4 px-4 rounded">
            {" "}
            <img
              src={insights}
              alt="Mobile Banking"
              className="w-8 h-8 mx-auto"
            />
          </button>
          <h3 className="text-xl font-bold  mt-3 mb-1">Market Insights</h3>
          <p className="text-[#5f5f5f]">
            Daily market updates, economic trends, and investment insights.
          </p>
        </div>{" "}
        <div className="bg-[#fcfaf6] p-6 w-full rounded-lg hover:shadow-md ">
          <button className="bg-[#c07d0031] text-white py-4 px-4 rounded">
            {" "}
            <img src={fraud} alt="Mobile Banking" className="w-8 h-8 mx-auto" />
          </button>
          <h3 className="text-xl font-bold  mt-3 mb-1">Security Center</h3>
          <p className="text-[#5f5f5f]">
            Learn about protecting your accounts and staying safe from fraud.
          </p>
        </div>
      </section>

      <section className="mt-6 sm:mt-10 max-w-6xl mx-auto p-4 sm:p-6 lg:p-10">
        <h2 className="font-bold text-black text-2xl sm:text-3xl text-center mb-2 sm:mb-3">
          Popular Topics
        </h2>
        <p className="text-[#1e1e1e] text-center text-sm sm:text-base">
          Explore our most-read articles and guide
        </p>{" "}
        <section className="mt-6 sm:mt-10 grid-cols-1 sm:grid-cols-2 grid gap-4 sm:gap-6">
          <div className=" bg-white shadow-md p-8 rounded-2xl ">
            <h3 className="text-2xl font-semibold mb-3">
              How to Build an Emergency Fund
            </h3>
            <p className="text-[#535353] mb-3">
              Learn the importance of emergency savings and how to get started
              with practical tips.
            </p>

            <Link to={"/resources/emergency-fund"}>
              <p className="text-[#c07d00] hover:text-[#674300] font-semibold cursor-pointer ">
                {" "}
                Read Article
              </p>
            </Link>
          </div>
          <div className=" bg-white shadow-md p-8 rounded-2xl ">
            {" "}
            <h3 className="text-2xl font-semibold mb-3">
              Understanding Credit Scores
            </h3>
            <p className="text-[#535353] mb-3">
              Discover what affects your credit score and how to improve it over
              time.
            </p>
            <p className="text-[#c07d00] hover:text-[#674300] font-semibold cursor-pointer">
              Read Article
            </p>
          </div>
          <div className=" bg-white shadow-md p-8 rounded-2xl ">
            <h3 className="text-2xl font-semibold mb-3">
              First Time Homebuyer Guide
            </h3>
            <p className="text-[#535353] mb-3">
              Everything you need to know about buying your first home, from
              saving to closing.
            </p>
            <p className="text-[#c07d00] hover:text-[#674300] font-semibold cursor-pointer">
              Read Article
            </p>
          </div>
          <div className=" bg-white shadow-md p-8 rounded-2xl ">
            <h3 className="text-2xl font-semibold mb-3">
              Retirement Planing 101
            </h3>
            <p className="text-[#535353] mb-3">
              Start planning for retirement with our comprehensive guide to
              saving and investing.
            </p>
            <p className="text-[#c07d00] hover:text-[#674300] font-semibold cursor-pointer">
              Read Article
            </p>
          </div>
        </section>
      </section>
    </main>
  );
}

export default Resources;
