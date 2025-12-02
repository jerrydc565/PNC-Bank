import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { transactionAPI } from "../services/api";

function Account() {
  const [balance, setBalance] = useState(0);
  const [accountNumber, setAccountNumber] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        // Get account number
        const storedAccountNumber = localStorage.getItem("accountNumber");
        if (storedAccountNumber) {
          setAccountNumber(storedAccountNumber);
        } else {
          const userId = localStorage.getItem("userId");
          if (userId) {
            const response = await fetch(
              `http://localhost:8080/api/user/${userId}/account`
            );
            const data = await response.json();
            if (data.accountNumber) {
              setAccountNumber(data.accountNumber);
              localStorage.setItem("accountNumber", data.accountNumber);
            }
          }
        }

        const userBalance = await transactionAPI.getBalance();
        setBalance(userBalance || 0);
      } catch (error) {
        console.error("Failed to fetch balance:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
  }, []);
  return (
    <main className="bg-[#efefef] p-3 sm:p-5">
      <section className="flex justify-between items-center mb-4 sm:mb-5">
        <div>
          <h3 className="font-bold text-lg sm:text-xl">Accounts</h3>
          <p className="text-[#595959] text-xs sm:text-[13px] mt-1">
            View and manage your account
          </p>
        </div>
      </section>

      {loading ? (
        <div className="text-center py-10">Loading...</div>
      ) : (
        <Link to={"/checking-details"} className="block">
          <section className="rounded-lg pt-2 bg-[#c78100] shadow hover:shadow-md cursor-pointer overflow-hidden">
            <div className="bg-white p-4 sm:p-7 flex flex-col sm:flex-row justify-between gap-4 sm:gap-0">
              <div>
                <p className="text-[#595959] text-[13px] mb-1">
                  Checking Account
                </p>
                <h3 className="font-semibold text-xl mb-1">Premium Checking</h3>
                <p className="text-[#595959] text-[13px] mb-6">
                  {accountNumber
                    ? `****${accountNumber.slice(-4)}`
                    : "****----"}
                </p>

                <p className="text-[#595959] text-[13px] mb-1">
                  Available Balance
                </p>
                <h3 className="text-[#000000] font-medium text-[13px]">
                  $
                  {balance.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </h3>
              </div>

              <div>
                <p className="text-[#595959] text-[13px] mb-1">
                  Current Balance
                </p>
                <h3 className="font-semibold text-xl">
                  $
                  {balance.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </h3>
              </div>
            </div>
          </section>
        </Link>
      )}

      {/* Hidden: Mock Savings and Credit accounts */}
    </main>
  );
}

export default Account;
