import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { transactionAPI } from "../services/api";

const DepositCard = () => {
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    amount: "",
    cardNumber: "",
    cvv: "",
    expiryDate: "",
  });

  const formatAmount = (value) => {
    // Remove non-numeric characters
    const numericValue = value.replace(/[^0-9.]/g, "");
    // Format with commas
    const parts = numericValue.split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "amount") {
      // Remove commas for storage but display formatted
      const formatted = formatAmount(value);
      setFormData({
        ...formData,
        [name]: formatted,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Remove commas before parsing
      const numericAmount = formData.amount.replace(/,/g, "");
      // Create deposit transaction
      await transactionAPI.createDeposit(parseFloat(numericAmount));

      // Show success modal
      setShowSuccess(true);

      // Redirect after 2 seconds
      setTimeout(() => {
        navigate("/user-home");
      }, 2000);
    } catch (error) {
      console.error("Deposit failed:", error);
      alert("Deposit failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header - Remove London Economical Bank branding */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-4 text-center">
        <h1 className="text-2xl font-bold text-blue-800">PNC BANK</h1>
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
                type="text"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="1,000"
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

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-8 max-w-sm w-full text-center animate-fadeIn">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fa-solid fa-check text-green-600 text-3xl"></i>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Successful!
            </h2>
            <p className="text-gray-600 mb-4">
              Your deposit of ${formData.amount} has been processed
              successfully.
            </p>
            <p className="text-sm text-gray-500">Redirecting to dashboard...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepositCard;
