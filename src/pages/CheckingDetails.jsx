import React from 'react'
import { Link } from 'react-router-dom'

function CheckingDetails() {
  const recent = [
    { id: "c1", title: "Paycheck", date: "2025-11-18", amount: "+$2,000.00" },
    { id: "c2", title: "Starbucks", date: "2025-11-17", amount: "-$4.50" },
    { id: "c3", title: "Whole Foods", date: "2025-11-16", amount: "-$120.34" },
  ];

  return (
    <main className="bg-[#f3f3f3] p-6">
      <section className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-[#595959]">Checking Account</p>
            <h2 className="text-2xl font-semibold">Premium Checking</h2>
            <p className="text-sm text-[#595959]">****4832</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-[#595959]">Available Balance</p>
            <p className="text-2xl font-bold">$5,289.00</p>
            <Link to="/payment" className="inline-block mt-3 px-4 py-2 bg-[#c64c00] text-white rounded">Transfer</Link>
          </div>
        </div>
      </section>

      <section className="bg-white rounded-lg shadow p-6">
        <h3 className="font-semibold mb-4">Recent activity</h3>
        <ul className="flex flex-col gap-3">
          {recent.map((r) => (
            <li key={r.id} className="flex justify-between items-center border-b pb-2">
              <div>
                <p className="font-medium">{r.title}</p>
                <p className="text-sm text-[#595959]">{r.date}</p>
              </div>
              <div className="font-semibold">{r.amount}</div>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

export default CheckingDetails