import React from 'react'
import smartPhone from '../assets/image/smartphone.png'
import security from '../assets/image/verified.png'
import card from '../assets/image/card.png'
import savings from '../assets/image/piggy.png'
import insights from '../assets/image/trend.png'
import fraud from '../assets/image/padlock.png'
import { Link } from 'react-router-dom'

function Features() {
  return (
    <section className="bg-white py-20 px-4 ">
      <h4 className="text-[#c07d00] text-center font-semibold tracking-widest max-w-4xl mx-auto  mb-4">
        FEATURES
      </h4>
      <h2 className="font-bold text-4xl text-center text-black max-w-4xl mx-auto">
        Explore and apply online
      </h2>
      <p className="text-center text-[#a1a1a1] max-w-4xl mx-auto mt-4 mb-10">
        Our banking platform is designed to make your life easier.
      </p>
      <section className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
        
          {" "}
          <div className="bg-[#fcfaf6] p-6 w-full rounded-lg hover:shadow-md ">
            <button className="bg-[#c07d0031] text-white py-4 px-4 rounded">
              <img
                src={smartPhone}
                alt="Mobile Banking"
                className="w-8 h-8 mx-auto"
              />
            </button>
            <h3 className="text-xl font-bold  mt-3 mb-1">Mobile Banking</h3>
            <p className="text-[#5f5f5f]">
              Manage your accounts, make transfers, and pay bills from anywhere
              with our easy-to-use mobile app.
            </p>
          </div>
     

  
          {" "}
          <div className="bg-[#fcfaf6] p-6 w-full rounded-lg hover:shadow-md ">
            <button className="bg-[#c07d0031] text-white py-4 px-4 rounded">
              {" "}
              <img
                src={security}
                alt="Mobile Banking"
                className="w-8 h-8 mx-auto"
              />
            </button>
            <h3 className="text-xl font-bold  mt-3 mb-1">
              Secure Transactions
            </h3>
            <p className="text-[#5f5f5f]">
              State-of-the-art security measures to protect your financial data
              and transactions.
            </p>
          </div>
        

       
          {" "}
          <div className="bg-[#fcfaf6] p-6 w-full rounded-lg hover:shadow-md">
            <button className="bg-[#c07d0031] text-white py-4 px-4 rounded">
              {" "}
              <img
                src={card}
                alt="Mobile Banking"
                className="w-8 h-8 mx-auto"
              />
            </button>
            <h3 className="text-xl font-bold  mt-3 mb-1">Card Management</h3>
            <p className="text-[#5f5f5f]">
              View transactions, lock cards, set spending limits, and request
              new cards all in one place.
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
            <h3 className="text-xl font-bold  mt-3 mb-1">Savings Goals</h3>
            <p className="text-[#5f5f5f]">
              Set up personalized savings goals and track your progress with
              automated savings features.
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
            <h3 className="text-xl font-bold  mt-3 mb-1">Financial Insights</h3>
            <p className="text-[#5f5f5f]">
              Get personalized insights into your spending habits and
              recommendations for better financial health.
            </p>
          </div>
      
          {" "}
          <div className="bg-[#fcfaf6] p-6 w-full rounded-lg hover:shadow-md ">
            <button className="bg-[#c07d0031] text-white py-4 px-4 rounded">
              {" "}
              <img
                src={fraud}
                alt="Mobile Banking"
                className="w-8 h-8 mx-auto"
              />
            </button>
            <h3 className="text-xl font-bold  mt-3 mb-1">Fraud Protection</h3>
            <p className="text-[#5f5f5f]">
              Advanced fraud detection systems that monitor your accounts 24/7
              for suspicious activity.
            </p>
          </div>
       
      </section>
    </section>
  );
}

export default Features