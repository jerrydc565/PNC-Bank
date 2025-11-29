import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { transactionAPI } from "../services/api";

function Account() {
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
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
    <main className="bg-[#efefef] p-5">
      <section className="flex justify-between items-center mb-5">
        <div>
          <h3 className="font-bold text-xl">Accounts</h3>
          <p className="text-[#595959] text-[13px] mt-1">
            View and manage your account
          </p>
        </div>
      </section>

      {loading ? (
        <div className="text-center py-10">Loading...</div>
      ) : (
        <Link to={"/checking-details"} className="block">
          <section className="rounded-lg pt-2 bg-[#c78100] shadow hover:shadow-md cursor-pointer overflow-hidden">
            <div className="bg-white p-7 flex justify-between">
              <div>
                <p className="text-[#595959] text-[13px] mb-1">
                  Checking Account
                </p>
                <h3 className="font-semibold text-xl mb-1">Premium Checking</h3>
                <p className="text-[#595959] text-[13px] mb-6">****4832</p>

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
