import React, { useState, useEffect } from "react";
import { transactionAPI } from "../services/api";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const transactions = await transactionAPI.getTransactions();
        // Convert recent transactions to notifications
        const notifs = transactions.slice(0, 10).map((tx) => ({
          id: tx.id,
          type: tx.transactionType === "DEPOSIT" ? "credit" : "debit",
          amount: tx.amount,
          description: tx.description || "Transaction",
          date: tx.createdAt,
          balance: tx.balanceAfter,
        }));
        setNotifications(notifs);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "short" });
    const year = date.getFullYear();
    const time = date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return `${day} ${month}, ${year} at ${time}`;
  };

  if (loading) {
    return <div className="p-6">Loading notifications...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header with Logo */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-4 text-center">
        <h1 className="text-2xl font-bold text-blue-800">LONDON</h1>
        <h2 className="text-sm text-blue-800">ECONOMICAL BANK</h2>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <h2 className="text-lg font-semibold mb-4">Notifications</h2>

        {notifications.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fa-regular fa-bell-slash text-gray-400 text-2xl"></i>
            </div>
            <p className="text-gray-500">No notifications yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className="bg-blue-50 border-l-4 border-blue-500 rounded p-4"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      notif.type === "credit" ? "bg-green-100" : "bg-red-100"
                    }`}
                  >
                    <i
                      className={`fa-solid ${
                        notif.type === "credit"
                          ? "fa-arrow-down text-green-600"
                          : "fa-arrow-up text-red-600"
                      }`}
                    ></i>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm mb-1">
                      {notif.type === "credit"
                        ? "Transfer Received"
                        : "Transfer Sent"}
                    </p>
                    <p className="text-sm text-gray-700 mb-2">
                      {notif.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <p className="text-xs text-gray-500">
                        {formatDate(notif.date)}
                      </p>
                      <p className="font-semibold text-sm">
                        {notif.type === "credit" ? "+" : "-"}$
                        {notif.amount.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Balance: $
                      {notif.balance.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
