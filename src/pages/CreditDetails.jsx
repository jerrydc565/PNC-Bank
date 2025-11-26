import React from "react";
import { Link } from "react-router-dom";

function CreditDetails() {
  const statements = [
    {
      id: "cr1",
      title: "Statement Nov 2025",
      date: "2025-11-01",
      amount: "$1,289.00",
    },
    {
      id: "cr2",
      title: "Payment Oct 2025",
      date: "2025-10-15",
      amount: "-$345.00",
    },
  ];

  return (
    <main className="bg-[#f3f3f3] p-6">
      <section className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-[#595959]">Credit Card</p>
            <h2 className="text-2xl font-semibold">Platinum Rewards</h2>
            <p className="text-sm text-[#595959]">****3214</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-[#595959]">Current Balance</p>
            <p className="text-2xl font-bold">$1,289.00</p>
            <Link
              to="/payment"
              className="inline-block mt-3 px-4 py-2 bg-[#c64c00] text-white rounded"
            >
              Pay Now
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-white rounded-lg shadow p-6">
        <h3 className="font-semibold mb-4">Recent statements</h3>
        <ul className="flex flex-col gap-3">
          {statements.map((s) => (
            <li
              key={s.id}
              className="flex justify-between items-center border-b pb-2"
            >
              <div>
                <p className="font-medium">{s.title}</p>
                <p className="text-sm text-[#595959]">{s.date}</p>
              </div>
              <div className="font-semibold">{s.amount}</div>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

export default CreditDetails;
