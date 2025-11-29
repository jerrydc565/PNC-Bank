import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { transactionAPI } from "../services/api";
import view from "../assets/image/view.png";
import hide from "../assets/image/hide.png";

function CheckingDetails() {
  const [balance, setBalance] = useState(0);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hideValue, setHideValue] = useState("Show");
  const [userProfile, setUserProfile] = useState(null);

  const firstName =
    userProfile?.firstName || localStorage.getItem("firstName") || "User";
  const secondName =
    userProfile?.secondName || localStorage.getItem("secondName") || "User";

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch balance
        const userBalance = await transactionAPI.getBalance();
        setBalance(userBalance || 0);

        // Fetch recent transactions (last 10)
        const allTransactions = await transactionAPI.getTransactions();

        // Transform backend data to match frontend format
        const formatted = allTransactions.slice(0, 10).map((tx) => {
          let dateStr;
          try {
            dateStr = tx.createdAt
              ? new Date(tx.createdAt).toISOString().split("T")[0]
              : new Date().toISOString().split("T")[0];
          } catch (e) {
            dateStr = new Date().toISOString().split("T")[0];
          }

          return {
            id: tx.id.toString(),
            title: tx.description || "Transaction",
            date: dateStr,
            amount:
              tx.transactionType === "DEPOSIT"
                ? `+$${tx.amount.toFixed(2)}`
                : `-$${tx.amount.toFixed(2)}`,
            type: tx.transactionType === "DEPOSIT" ? "received" : "debit",
          };
        });

        setRecentTransactions(formatted);
      } catch (error) {
        console.error("Failed to fetch checking details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    // Fetch user profile
    const email = localStorage.getItem("email");
    if (email) {
      fetch(`http://localhost:8080/api/user/${email}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setUserProfile(data);
          }
        })
        .catch((err) => console.error("Error fetching profile:", err));
    }
  }, []);

  const handleChange = () => {
    setHideValue(hideValue === "Show" ? "Hide" : "Show");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f3f3f3] flex items-center justify-center">
        <div className="text-xl">Loading account details...</div>
      </div>
    );
  }

  return (
    <main className="bg-[#f3f3f3] min-h-screen p-6">
      <div className="mb-6">
        <Link
          to="/account"
          className="inline-flex items-center gap-2 text-[#c64c00] hover:text-[#a03f00] font-medium"
        >
          <i className="fa-solid fa-arrow-left"></i>
          Back to Accounts
        </Link>
      </div>

      <section className="bg-white rounded-lg shadow p-8 mb-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="text-sm text-[#595959] mb-1">Checking Account</p>
            <h2 className="text-3xl font-bold mb-2">Premium Checking</h2>
            <p className="text-lg text-[#595959]">****4832</p>
          </div>
          <div className="flex items-center gap-2">
            <span onClick={handleChange} className="cursor-pointer">
              <img
                src={view}
                alt="Show"
                className={`w-5 ${hideValue === "Hide" ? "hidden" : "block"}`}
              />
              <img
                src={hide}
                alt="Hide"
                className={`w-5 ${hideValue === "Hide" ? "block" : "hidden"}`}
              />
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="p-4 bg-[#f8f9fa] rounded-lg">
            <p className="text-sm text-[#595959] mb-2">Current Balance</p>
            <p
              className={`text-2xl font-bold ${
                hideValue === "Hide" ? "hidden" : "block"
              }`}
            >
              $
              {balance.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
            <p
              className={`text-2xl font-bold ${
                hideValue === "Hide" ? "block" : "hidden"
              }`}
            >
              ••••••
            </p>
          </div>

          <div className="p-4 bg-[#f8f9fa] rounded-lg">
            <p className="text-sm text-[#595959] mb-2">Available Balance</p>
            <p
              className={`text-2xl font-bold text-[#28a745] ${
                hideValue === "Hide" ? "hidden" : "block"
              }`}
            >
              $
              {balance.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
            <p
              className={`text-2xl font-bold ${
                hideValue === "Hide" ? "block" : "hidden"
              }`}
            >
              ••••••
            </p>
          </div>

          <div className="p-4 bg-[#f8f9fa] rounded-lg">
            <p className="text-sm text-[#595959] mb-2">Account Holder</p>
            <p className="text-lg font-semibold">
              {firstName} {secondName}
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <Link
            to="/payment"
            className="px-6 py-2 bg-[#c64c00] hover:bg-[#a03f00] text-white rounded-lg transition-colors font-medium"
          >
            <i className="fa-solid fa-arrow-right-arrow-left mr-2"></i>
            Transfer Money
          </Link>
          <Link
            to="/transaction"
            className="px-6 py-2 border border-[#d0d0d0] hover:bg-[#f5f5f5] rounded-lg transition-colors font-medium"
          >
            <i className="fa-solid fa-list mr-2"></i>
            View All Transactions
          </Link>
        </div>
      </section>

      <section className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-semibold text-xl">Recent Activity</h3>
          <Link
            to="/transaction"
            className="text-[#c64c00] hover:text-[#a03f00] font-medium"
          >
            View all <i className="fa-solid fa-angle-right"></i>
          </Link>
        </div>

        {recentTransactions.length === 0 ? (
          <div className="text-center py-10">
            <div className="w-20 h-20 rounded-full bg-[#f5f5f5] flex items-center justify-center mx-auto mb-4">
              <i className="fa-solid fa-receipt text-4xl text-[#c0c0c0]"></i>
            </div>
            <p className="text-[#595959]">No recent transactions</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentTransactions.map((r) => (
              <div
                key={r.id}
                className="flex justify-between items-center p-4 border border-[#e0e0e0] rounded-lg hover:border-[#c64c00] transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      r.type === "received"
                        ? "bg-[#28a74522]"
                        : "bg-[#dc354522]"
                    }`}
                  >
                    <i
                      className={`fa-solid ${
                        r.type === "received"
                          ? "fa-arrow-down text-[#28a745]"
                          : "fa-arrow-up text-[#dc3545]"
                      } text-lg`}
                    ></i>
                  </div>
                  <div>
                    <p className="font-semibold">{r.title}</p>
                    <p className="text-sm text-[#595959]">{r.date}</p>
                  </div>
                </div>
                <div
                  className={`font-bold text-lg ${
                    r.type === "received" ? "text-[#28a745]" : "text-[#dc3545]"
                  }`}
                >
                  {r.amount}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default CheckingDetails;
