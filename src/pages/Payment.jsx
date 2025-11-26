import React, { useState } from "react";

const initialAccounts = [
  {
    id: "checking",
    name: "Premium Checking",
    number: "****4832",
    balance: 5289,
  },
  {
    id: "savings",
    name: "High-Yield Savings",
    number: "****7232",
    balance: 15289,
  },
  {
    id: "rewards",
    name: "Platinum Rewards",
    number: "****3214",
    balance: 8289,
  },
];
const contacts = [
  { id: "ajohnson", name: "Alex Johnson" },
  { id: "jwalker", name: "Jason Walker" },
  { id: "smicheal", name: "Sandra Micheal" },
];

function Payment() {
  const [tab, setTab] = useState("Transfer");
  const [accounts, setAccounts] = useState(initialAccounts);
  const [from, setFrom] = useState(initialAccounts[0].id);
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");
  const [when, setWhen] = useState("Now");
  const [scheduledDate, setScheduledDate] = useState("");
  const [memo, setMemo] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(""); // Keeping the original line for context
  // toast pop-out for success feedback
  const [toast, setToast] = useState({ text: "", visible: false });
  const showToast = (text, duration = 2000) => {
    setToast({ text, visible: true });
    setTimeout(() => setToast({ text: "", visible: false }), duration);
  };
  const [error, setError] = useState("");
  const [scheduledPayments, setScheduledPayments] = useState([]);

  const handleTransfer = (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    if (!from || !to || !amount || isNaN(amount) || Number(amount) <= 0) {
      setError("Please fill all fields with valid values.");
      return;
    }
    const amt = Number(amount);
    // Schedule the payment
    if (when === "Schedule") {
      if (!scheduledDate)
        return setError("Please choose a date for the scheduled payment");
      const id = `s${Date.now()}`;
      setScheduledPayments((s) => [
        ...s,
        { id, from, to, amount: amt, date: scheduledDate, memo },
      ]);
      showToast("Payment scheduled");
      setAmount("");
      setMemo("");
      setTo("");
      setScheduledDate("");
      return;
    }

    // Immediate transfer: update account balances (if internal)
    setLoading(true);
    const fromAcc = accounts.find((a) => a.id === from);
    if (fromAcc && fromAcc.balance < amt) {
      setLoading(false);
      setError("Insufficient funds");
      return;
    }
    setTimeout(() => {
      setAccounts((prev) => {
        const fromIdx = prev.findIndex((a) => a.id === from);
        const toIdx = prev.findIndex((a) => a.id === to);
        const next = prev.map((a) => ({ ...a }));
        if (fromIdx >= 0) {
          next[fromIdx].balance = Math.max(0, next[fromIdx].balance - amt);
        }
        if (toIdx >= 0) {
          // credit internal account
          next[toIdx].balance = next[toIdx].balance + amt;
        }
        return next;
      });
      setLoading(false);
      showToast("Transfer successful");
      setAmount("");
      setMemo("");
      setTo("");
    }, 900);
  };

  const handleBillPay = (e) => {
    e && e.preventDefault();
    setError("");
    setMessage("");
    if (!from || !to || !amount || isNaN(amount) || Number(amount) <= 0) {
      setError("Please select from, payee and enter a valid amount.");
      return;
    }
    const amt = Number(amount);
    const fromAcc = accounts.find((a) => a.id === from);
    if (fromAcc && fromAcc.balance < amt) {
      return setError("Insufficient funds");
    }
    setLoading(true);
    setTimeout(() => {
      setAccounts((prev) => {
        const fromIdx = prev.findIndex((a) => a.id === from);
        const next = prev.map((a) => ({ ...a }));
        if (fromIdx >= 0)
          next[fromIdx].balance = Math.max(0, next[fromIdx].balance - amt);
        // if paying a credit account (rewards), reduce its balance (treat as payment)
        const toIdx = prev.findIndex((a) => a.id === to);
        if (toIdx >= 0 && prev[toIdx].id === "rewards") {
          next[toIdx].balance = Math.max(0, next[toIdx].balance - amt);
        }
        return next;
      });
      setLoading(false);
      showToast("Payment completed");
      setAmount("");
      setMemo("");
      setTo("");
    }, 900);
  };

  const cancelScheduled = (id) => {
    setScheduledPayments((s) => s.filter((p) => p.id !== id));
  };

  return (
    <main className="bg-[#ececec] p-5">
      <section className="py-10">
        <h3 className="font-bold text-2xl"> Payment & Transfers</h3>
        <p className="text-[15px] text-[#595959] mt-1">
          Send money, pay bills, and manage scheduled payments
        </p>
      </section>
      {/* Toast pop-out */}
      <div aria-live="polite">
        <div
          className={`fixed right-6 bottom-6 transition-opacity duration-200 ${
            toast.visible ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <div className="bg-white border rounded-lg shadow p-4 w-80">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-[#2ec700] flex items-center justify-center text-white">
                ✓
              </div>
              <div>
                <p className="font-medium">{toast.text}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <section className=" flex gap-3 ">
        <section className="w-[65%] bg-white rounded-lg shadow p-5 ">
          <header className=" pt-3 px-3 border-b border-[#acacac]">
            <ul className="flex gap-7 ">
              {["Transfer", "Bill Pay", "Scheduled"].map((t) => (
                <li
                  key={t}
                  className={`pb-3 font-medium border-b-2 cursor-pointer transition-colors duration-150 ${
                    tab === t
                      ? "border-[#c64c00] text-[#c64c00]"
                      : "border-transparent hover:border-[#c64c00] hover:text-[#c64c00]"
                  }`}
                  tabIndex={0}
                  onClick={() => setTab(t)}
                  onKeyDown={(e) => (e.key === "Enter" ? setTab(t) : null)}
                  aria-selected={tab === t}
                  role="tab"
                >
                  {t}
                </li>
              ))}
            </ul>
          </header>

          {/* Tabbed content */}
          {tab === "Transfer" && (
            <form onSubmit={handleTransfer} autoComplete="off">
              <h3 className="font-semibold text-xl my-8 m-3">
                {" "}
                Transfer Money
              </h3>

              <h5 className="text-[16px] font-medium mb-1 mx-3">From</h5>
              <div className="rounded-lg border border-[#8b8b8b] p-2 w-full flex justify-between items-center ">
                <select
                  className="bg-transparent outline-none w-full"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  aria-label="From account"
                >
                  {accounts.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} ({a.number}) - ${a.balance.toLocaleString()}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center justify-center w-full my-4">
                <i className="fa-solid fa-arrow-right-arrow-left text-2xl text-[#9d9d9d]"></i>
              </div>

              <h5 className="text-[16px] font-medium mb-1 ">To</h5>
              <div className="rounded-lg border border-[#8b8b8b] p-2 w-full flex justify-between items-center ">
                <select
                  className="bg-transparent outline-none w-full"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  aria-label="To account/contact"
                >
                  <option value="">Select an account or contact</option>
                  {accounts.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} ({a.number})
                    </option>
                  ))}
                  {contacts.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <i className="fa-solid fa-angle-down"></i>
              </div>
              <h5 className="text-[16px] font-medium mb-1 mt-4">Amount</h5>
              <div className="rounded-lg border border-[#8b8b8b] w-full">
                <input
                  type="number"
                  name="number"
                  required
                  min={0.01}
                  step={0.01}
                  placeholder="0.00"
                  className="p-2 border-none outline-none w-full"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  aria-label="Amount"
                />
              </div>
              <h5 className="text-[16px] font-medium mb- mt-4 ">When</h5>
              <div className="flex gap-2 items-center">
                <button
                  type="button"
                  className={`px-3 p-1 rounded-lg ${
                    when === "Now"
                      ? "bg-[#c64c00] text-white"
                      : "bg-transparent border border-[#595959]"
                  }`}
                  onClick={() => setWhen("Now")}
                >
                  Now
                </button>
                <button
                  type="button"
                  className={`px-3 p-1 rounded-lg ${
                    when === "Schedule"
                      ? "bg-[#c64c00] text-white"
                      : "bg-transparent border border-[#595959]"
                  }`}
                  onClick={() => setWhen("Schedule")}
                >
                  Schedule
                </button>
                {when === "Schedule" && (
                  <input
                    type="date"
                    className="ml-3 border p-2 rounded"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                  />
                )}
              </div>
              <h5 className="text-[16px] font-medium mb-1 mt-4">
                Memo (Optional)
              </h5>
              <div className="rounded-lg border border-[#8b8b8b] w-full">
                <input
                  type="text"
                  placeholder="Add a note"
                  className="border-none outline-none p-2 w-full"
                  value={memo}
                  onChange={(e) => setMemo(e.target.value)}
                  aria-label="Memo"
                />
              </div>
              {error && (
                <div className="text-red-600 mt-3 text-sm">{error}</div>
              )}
              {/* success messages are shown via toast pop-out */}
              <button
                className="w-full p-2 font-medium text-white rounded-lg bg-[#c64c00] mt-9 disabled:opacity-60"
                disabled={loading}
                type="submit"
              >
                {loading
                  ? "Processing..."
                  : when === "Schedule"
                  ? "Schedule Payment"
                  : "Transfer Money"}
              </button>
            </form>
          )}

          {tab === "Bill Pay" && (
            <form onSubmit={handleBillPay} className="p-3">
              <h3 className="font-semibold text-xl my-3">Pay a Bill / Card</h3>
              <label className="text-sm">From</label>
              <div className="rounded-lg border p-2 mb-3">
                <select
                  className="w-full outline-none bg-transparent"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                >
                  {accounts.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} ({a.number}) - ${a.balance.toLocaleString()}
                    </option>
                  ))}
                </select>
              </div>
              <label className="text-sm">Payee</label>
              <div className="rounded-lg border p-2 mb-3">
                <select
                  className="w-full outline-none bg-transparent"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                >
                  <option value="">Select payee</option>
                  {accounts.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} ({a.number})
                    </option>
                  ))}
                  <option value="rent">Rent</option>
                  <option value="electric">Electric Company</option>
                  <option value="internet">Internet Provider</option>
                </select>
              </div>
              <label className="text-sm">Amount</label>
              <div className="rounded-lg border p-2 mb-3">
                <input
                  className="w-full outline-none"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  inputMode="numeric"
                />
              </div>
              <label className="text-sm">Memo</label>
              <div className="rounded-lg border p-2 mb-3">
                <input
                  className="w-full outline-none"
                  value={memo}
                  onChange={(e) => setMemo(e.target.value)}
                  placeholder="Optional note"
                />
              </div>
              {error && (
                <div className="text-red-600 mt-3 text-sm">{error}</div>
              )}
              {/* success messages are shown via toast pop-out */}
              <div className="flex justify-end">
                <button
                  type="button"
                  className="px-4 py-2 mr-2 border rounded"
                  onClick={() => {
                    setAmount("");
                    setMemo("");
                    setTo("");
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#c64c00] text-white rounded"
                >
                  Pay Now
                </button>
              </div>
            </form>
          )}

          {tab === "Scheduled" && (
            <div className="p-3">
              <h3 className="font-semibold text-xl my-3">Scheduled Payments</h3>
              {scheduledPayments.length === 0 && (
                <p className="text-sm text-[#595959]">No scheduled payments</p>
              )}
              {scheduledPayments.map((s) => (
                <div
                  key={s.id}
                  className="border rounded p-3 mb-3 flex justify-between items-center"
                >
                  <div>
                    <div className="font-medium">{s.to}</div>
                    <div className="text-sm text-[#595959]">
                      {s.date} • ${s.amount}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="px-3 py-1 border rounded"
                      onClick={() => cancelScheduled(s.id)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
        <section className="w-[35%] bg-white rounded-lg shadow p-3">
          <h3 className="font-semibold text-xl mb-4">Quick Actions</h3>
          <section>
            <button
              className="flex w-full cursor-pointer hover:bg-[#d0d0d0] mb-3 gap-3 items-center rounded-lg p-4 bg-[#c]"
              aria-label="Send Money"
              type="button"
              onClick={() => setTab("Transfer")}
              role="button"
            >
              <span className="w-9 h-9 p-2 rounded-full bg-[#0051ff45] flex items-center justify-center">
                <i className="fa-solid fa-paper-plane text-[#0051ff]" />
              </span>
              <h4 className="font-semibold text-lg ">Send Money</h4>
            </button>
            <button
              className="flex w-full cursor-pointer hover:bg-[#d0d0d0] mb-3 gap-3 items-center rounded-lg p-4 bg-[#f9f9f9]"
              aria-label="Pay Credit Card"
              type="button"
              onClick={() => {
                setTab("Bill Pay");
                setTo("rewards");
              }}
              role="button"
            >
              <span className="w-9 h-9 p-2 rounded-full bg-[#2fff0045] flex items-center justify-center">
                <i className="fa-solid fa-credit-card text-[#00b300]" />
              </span>
              <h4 className="font-semibold text-lg ">Pay Credit Card</h4>
            </button>
            <button
              className="flex w-full cursor-pointer hover:bg-[#d0d0d0] mb-3 gap-3 items-center rounded-lg p-4 bg-[#f9f9f9]"
              aria-label="Pay Bills"
              type="button"
              onClick={() => setTab("Bill Pay")}
              role="button"
            >
              <span className="w-9 h-9 p-2 rounded-full bg-[#8800ff45] flex items-center justify-center">
                <i className="fa-solid fa-file-invoice-dollar text-[#8800ff]" />
              </span>
              <h4 className="font-semibold text-lg ">Pay Bills</h4>
            </button>
          </section>

          <h3 className="text-[#595959] font-medium mt-2 mb-3 ">
            YOUR ACCOUNTS
          </h3>
          <section>
            {accounts.map((a) => (
              <div
                key={a.id}
                className="p-2 border border-[#b4b4b4] rounded-lg mb-3"
              >
                <h4 className="font-semibold text-lg mb-1">{a.name}</h4>
                <p className="text-[#595959] mb-3">{a.number}</p>
                <h4 className="font-semibold text-lg">
                  ${a.balance.toLocaleString()}
                </h4>
              </div>
            ))}
          </section>
        </section>
      </section>
    </main>
  );
}

export default Payment;
