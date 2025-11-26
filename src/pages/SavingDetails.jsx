import React from "react";
import { Link } from "react-router-dom";

function SavingDetails() {
  const activity = [
    { id: "s1", title: "Interest", date: "2025-11-10", amount: "+$12.50" },
    {
      id: "s2",
      title: "Transfer to Checking",
      date: "2025-11-05",
      amount: "-$300.00",
    },
  ];

  return (
    <main className="bg-[#f3f3f3] p-6">
      <section className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-[#595959]">Savings Account</p>
            <h2 className="text-2xl font-semibold">High-Yield Savings</h2>
            <p className="text-sm text-[#595959]">****7232</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-[#595959]">Available Balance</p>
            <p className="text-2xl font-bold">$15,289.00</p>
            <Link
              to="/account"
              className="inline-block mt-3 px-4 py-2 bg-[#c64c00] text-white rounded"
            >
              Manage
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-white rounded-lg shadow p-6">
        <h3 className="font-semibold mb-4">Recent activity</h3>
        <ul className="flex flex-col gap-3">
          {activity.map((a) => (
            <li
              key={a.id}
              className="flex justify-between items-center border-b pb-2"
            >
              <div>
                <p className="font-medium">{a.title}</p>
                <p className="text-sm text-[#595959]">{a.date}</p>
              </div>
              <div className="font-semibold">{a.amount}</div>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

export default SavingDetails;
