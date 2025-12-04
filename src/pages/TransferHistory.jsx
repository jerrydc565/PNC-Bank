import React, { useState, useEffect } from "react";
import { transactionAPI } from "../services/api";

const TransferHistory = () => {
  const [transfers, setTransfers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("user"); // 'user' or 'history'

  useEffect(() => {
    const fetchTransfers = async () => {
      try {
        const data = await transactionAPI.getTransactions();
        setTransfers(data);
      } catch (error) {
        console.error("Failed to fetch transfers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransfers();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "short" });
    const year = date.getFullYear();

    const suffix =
      day === 1 || day === 21 || day === 31
        ? "st"
        : day === 2 || day === 22
        ? "nd"
        : day === 3 || day === 23
        ? "rd"
        : "th";

    return `${day}${suffix} ${month}, ${year}`;
  };

  const getStatusBadge = (status) => {
    if (!status || status === "APPROVED") {
      return (
        <span className="bg-green-500 text-white text-xs px-3 py-1 rounded-full">
          Approved
        </span>
      );
    } else if (status === "PENDING") {
      return (
        <span className="bg-orange-500 text-white text-xs px-3 py-1 rounded-full">
          Pending
        </span>
      );
    } else if (status === "REJECTED") {
      return (
        <span className="bg-red-500 text-white text-xs px-3 py-1 rounded-full">
          Denied
        </span>
      );
    }
  };

  if (loading) {
    return <div className="p-6">Loading transfers...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
        <h1 className="text-2xl font-bold text-blue-600">
          Welcome, {localStorage.getItem("firstName") || "User"}
        </h1>
        <div className="flex justify-between items-center mt-2">
          <p className="text-3xl font-bold">
            {(0).toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded text-sm">
            MENU ▼
          </button>
        </div>
        <p className="text-green-600 text-sm">USD</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm mb-4">
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab("user")}
            className={`flex-1 py-3 text-center font-medium ${
              activeTab === "user"
                ? "text-black border-b-2 border-black"
                : "text-gray-500"
            }`}
          >
            User transfers
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`flex-1 py-3 text-center font-medium ${
              activeTab === "history"
                ? "text-black border-b-2 border-black"
                : "text-gray-500"
            }`}
          >
            Transfer history
          </button>
        </div>

        {/* Transfer List */}
        <div className="p-4 space-y-3">
          {transfers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No transfers found
            </div>
          ) : (
            transfers.map((transfer) => (
              <div
                key={transfer.id}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-lg font-semibold">
                      {transfer.amount.toLocaleString("en-US")}{" "}
                      <span className="text-sm text-gray-600">USD</span>
                    </p>
                    <p className="text-sm text-gray-600">
                      DIRECT FUNDS TRANSFER
                    </p>
                  </div>
                  {getStatusBadge(transfer.status)}
                </div>
                <p className="text-xs text-gray-500 text-right">
                  Date: {formatDate(transfer.createdAt)}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TransferHistory;
