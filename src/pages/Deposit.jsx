import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Deposit = () => {
  const navigate = useNavigate();
  const [depositHistory] = useState([
    {
      id: 1,
      amount: 200,
      btcAmount: "0.0021412",
      transactionId: "QwIZAC5Hpp9X",
      date: "3rd Dec, 2025",
      status: "Pending",
    },
  ]);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
        <h1 className="text-2xl font-bold text-blue-600">
          Welcome, {localStorage.getItem("firstName") || "User"}
        </h1>
        <div className="flex justify-between items-center mt-2">
          <p className="text-3xl font-bold">0,070,200</p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded text-sm">
            MENU ▼
          </button>
        </div>
        <p className="text-green-600 text-sm">USD</p>
      </div>

      {/* Deposit Section */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
        <h2 className="text-lg font-semibold mb-2">Deposit funds</h2>
        <p className="text-sm text-gray-600 mb-4">
          Select one of the options to deposit funds to your account
        </p>

        <h3 className="text-sm font-semibold mb-3">Deposit via:</h3>

        {/* Deposit Options */}
        <div className="flex gap-4 mb-6">
          {/* Card Option */}
          <button
            onClick={() => navigate("/deposit/card")}
            className="flex-1 border-2 border-blue-500 rounded-lg p-4 hover:bg-blue-50 transition"
          >
            <div className="flex items-center justify-center gap-2">
              <img
                src="/public/image/visa.png"
                alt="VISA"
                className="h-6"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
              <img
                src="/public/image/mastercard.png"
                alt="Mastercard"
                className="h-6"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
              <img
                src="/public/image/amex.png"
                alt="Amex"
                className="h-6"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            </div>
            <div className="mt-2 flex items-center gap-2 text-sm">
              <i className="fa-brands fa-cc-visa text-blue-800 text-2xl"></i>
              <i className="fa-brands fa-cc-mastercard text-red-600 text-2xl"></i>
              <i className="fa-brands fa-cc-amex text-blue-600 text-2xl"></i>
              <i className="fa-brands fa-cc-discover text-orange-600 text-2xl"></i>
            </div>
          </button>

          {/* Bitcoin Option */}
          <button
            onClick={() => alert("Bitcoin deposit coming soon")}
            className="flex-1 border-2 border-gray-300 rounded-lg p-4 hover:bg-gray-50 transition"
          >
            <div className="flex items-center justify-center">
              <i className="fa-brands fa-bitcoin text-orange-500 text-4xl"></i>
            </div>
            <p className="text-sm font-semibold mt-2 text-center">bitcoin</p>
          </button>
        </div>

        {/* Deposit History */}
        <h3 className="text-sm font-semibold mb-3">Deposit history</h3>
        <div className="space-y-3">
          {depositHistory.map((deposit) => (
            <div
              key={deposit.id}
              className="border border-gray-200 rounded-lg p-4"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="text-lg font-semibold">
                    {deposit.amount}{" "}
                    <span className="text-sm text-gray-600">USD</span>
                  </p>
                  <p className="text-sm text-orange-500 flex items-center gap-1">
                    <i className="fa-brands fa-bitcoin"></i>
                    {deposit.btcAmount}
                  </p>
                </div>
                <span className="bg-red-500 text-white text-xs px-3 py-1 rounded">
                  {deposit.status}
                </span>
              </div>
              <p className="text-sm text-red-600 mb-1">
                Transaction ID: {deposit.transactionId}
              </p>
              <p className="text-xs text-gray-500 text-right">
                Date: {deposit.date}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Deposit;
