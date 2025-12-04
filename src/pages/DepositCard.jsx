import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const DepositCard = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    amount: "",
    cardNumber: "",
    cvv: "",
    expiryDate: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Card deposit submitted! This feature is under development.");
    navigate("/deposit");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header with Logo */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-4 text-center">
        <h1 className="text-2xl font-bold text-blue-800">LONDON</h1>
        <h2 className="text-sm text-blue-800">ECONOMICAL BANK</h2>
      </div>

      {/* Deposit Form */}
      <div className="bg-white rounded-lg shadow-sm p-6 max-w-md mx-auto">
        <form onSubmit={handleSubmit}>
          {/* Amount */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Amount:</label>
            <div className="flex border border-gray-300 rounded">
              <span className="bg-gray-100 px-4 py-3 border-r border-gray-300">
                USD
              </span>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="100"
                className="flex-1 px-4 py-3 outline-none"
                required
              />
            </div>
          </div>

          {/* Card Number */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Card number
            </label>
            <input
              type="text"
              name="cardNumber"
              value={formData.cardNumber}
              onChange={handleChange}
              placeholder="1234 5678 9012 3456"
              maxLength="19"
              className="w-full border border-gray-300 rounded px-4 py-3 outline-none focus:border-blue-500"
              required
            />
          </div>

          {/* CVV */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">CVV</label>
            <input
              type="text"
              name="cvv"
              value={formData.cvv}
              onChange={handleChange}
              placeholder="123"
              maxLength="4"
              className="w-full border border-gray-300 rounded px-4 py-3 outline-none focus:border-blue-500"
              required
            />
          </div>

          {/* Expiry Date */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              Expiry date
            </label>
            <input
              type="text"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleChange}
              placeholder="MM/YY"
              maxLength="5"
              className="w-full border border-gray-300 rounded px-4 py-3 outline-none focus:border-blue-500"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 rounded font-semibold hover:bg-green-700 transition"
          >
            Pay
          </button>
        </form>

        {/* Back Button */}
        <button
          onClick={() => navigate("/deposit")}
          className="w-full mt-3 bg-gray-200 text-gray-700 py-3 rounded font-semibold hover:bg-gray-300 transition"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default DepositCard;
