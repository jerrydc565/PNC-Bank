import React, { useState } from "react";
import { Link } from "react-router-dom";

function Account() {
  // accounts state — start with the three existing accounts
  const [accounts, setAccounts] = useState([
    {
      id: "a1",
      type: "checking",
      title: "Premium Checking",
      mask: "****4832",
      balance: 5289,
    },
    {
      id: "a2",
      type: "savings",
      title: "High-Yield-Savings",
      mask: "****7232",
      balance: 15289,
    },
    {
      id: "a3",
      type: "credit",
      title: "Platinum Rewards",
      mask: "****3214",
      balance: 1289,
    },
  ]);

  // Add Account modal state & form
  const [showAddAccountModal, setShowAddAccountModal] = useState(false);
  const [newAccountType, setNewAccountType] = useState("checking");
  const [newAccountName, setNewAccountName] = useState("");
  const [newAccountInitial, setNewAccountInitial] = useState("");

  // simple toast for confirmations
  const [toast, setToast] = useState({ text: "", visible: false });
  const showToast = (text, duration = 2000) => {
    setToast({ text, visible: true });
    setTimeout(() => setToast({ text: "", visible: false }), duration);
  };

  const confirmAddAccount = () => {
    const name = (newAccountName || "").trim();
    const initial = Number(newAccountInitial || 0);
    if (!name) return showToast("Please enter an account name");
    if (isNaN(initial) || initial < 0)
      return showToast("Enter a valid initial deposit");

    const id = `a${Date.now()}`;
    const mask = `****${Math.floor(1000 + Math.random() * 9000)}`;
    const acc = {
      id,
      type: newAccountType,
      title: name,
      mask,
      balance: initial,
    };
    setAccounts((s) => [acc, ...s]);
    setShowAddAccountModal(false);
    setNewAccountName("");
    setNewAccountInitial("");
    setNewAccountType("checking");
    showToast("Account created");
  };
  return (
    <main className="bg-[#efefef] p-5">
      <section className="flex justify-between items-center mb-5">
        <div>
          <h3 className="font-bold text-xl">Accounts</h3>
          <p className="text-[#595959] text-[13px] mt-1">
            View and manage your accounts
          </p>
        </div>
        <button
          className="p-1 px-8 rounded-lg  bg-[#c64c00] text-white"
          onClick={() => setShowAddAccountModal(true)}
        >
          <i className="fa-solid fa-plus"></i> Add account
        </button>
      </section>

      <Link to={"/checking-details"} className="block">
        <section className="rounded-lg pt-2 bg-[#c78100] shadow hover:shadow-md cursor-pointer overflow-hidden  ">
          <div className="bg-white p-7 flex justify-between ">
            <div>
              <p className="text-[#595959]   text-[13px] mb-1">
                Checking Account
              </p>
              <h3 className="font-semibold text-xl mb-1">Premium Checking</h3>
              <p className="text-[#595959] text-[13px] mb-6">****4832</p>

              <p className="text-[#595959] text-[13px] mb-1">
                Available Balance
              </p>
              <h3 className="text-[#000000] font-medium text-[13px]">
                $5,289.00
              </h3>
            </div>

            <div>
              <p className="text-[#595959] text-[13px] mb-1">Current Balance</p>
              <h3 className="font-semibold text-xl">$5,289.00</h3>
            </div>
          </div>
        </section>
      </Link>

      <Link to={"/saving-details"} className="block">
        <section className="rounded-lg pt-2 bg-[#26a300] shadow hover:shadow-md cursor-pointer overflow-hidden mb-5 mt-5 ">
          <div className="bg-white p-7 flex justify-between ">
            <div>
              <p className="text-[#595959]   text-[13px] mb-1">
                Savings Account
              </p>
              <h3 className="font-semibold text-xl mb-1">High-Yield-Savings</h3>
              <p className="text-[#595959] text-[13px] mb-6">****7232</p>

              <p className="text-[#595959] text-[13px] mb-1">
                Available Balance
              </p>
              <h3 className="text-[#000000] font-medium text-[13px]">
                $15,289.00
              </h3>
            </div>

            <div>
              <p className="text-[#595959] text-[13px] mb-1">Current Balance</p>
              <h3 className="font-semibold text-xl">$15,289.00</h3>
            </div>
          </div>
        </section>
      </Link>

      <Link to={"/credit-details"} className="block">
        <section className="rounded-lg pt-2 bg-[#6300c7] shadow hover:shadow-md cursor-pointer overflow-hidden  ">
          <div className="bg-white p-7 flex justify-between ">
            <div>
              <p className="text-[#595959]   text-[13px] mb-1">Credit Card</p>
              <h3 className="font-semibold text-xl mb-1">Platiinum Rewards</h3>
              <p className="text-[#595959] text-[13px] mb-6">****3214</p>

              <p className="text-[#595959] text-[13px] mb-1">
                Available Balance
              </p>
              <h3 className="text-[#000000] font-medium text-[13px]">
                $8,289.00
              </h3>
            </div>

            <div>
              <p className="text-[#595959] text-[13px] mb-1">Current Balance</p>
              <h3 className="font-semibold text-xl">$1,289.00</h3>

              <p className="text-[#595959] text-[13px] mb-1">Payment Due</p>
              <h3 className="font-semibold text-xl"> 12/15/2025</h3>
            </div>
          </div>
        </section>
      </Link>

      {/* Add Account Modal */}
      {showAddAccountModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[90%] max-w-md">
            <div className="flex justify-between items-center">
              <h4 className="font-semibold text-lg">Add Account</h4>
              <button
                className="text-[#595959]"
                onClick={() => setShowAddAccountModal(false)}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <div className="mt-4">
              <label className="text-sm">Account type</label>
              <select
                className="w-full border p-2 rounded mb-3"
                value={newAccountType}
                onChange={(e) => setNewAccountType(e.target.value)}
              >
                <option value="checking">Checking</option>
                <option value="savings">Savings</option>
                <option value="credit">Credit</option>
              </select>

              <label className="text-sm">Account name</label>
              <input
                className="w-full border p-2 rounded mb-3"
                value={newAccountName}
                onChange={(e) => setNewAccountName(e.target.value)}
                placeholder="e.g. My Checking"
              />

              <label className="text-sm">Initial deposit</label>
              <input
                className="w-full border p-2 rounded mb-4"
                value={newAccountInitial}
                onChange={(e) => setNewAccountInitial(e.target.value)}
                placeholder="0"
                inputMode="numeric"
              />

              <div className="flex justify-end gap-3">
                <button
                  className="px-4 py-2 border rounded"
                  onClick={() => setShowAddAccountModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-[#c64c00] text-white rounded"
                  onClick={confirmAddAccount}
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      <div aria-live="polite">
        <div
          className={`fixed right-6 bottom-6 transition-opacity duration-200 ${
            toast.visible ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <div className="bg-white border rounded-lg shadow p-4 w-80">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-[#c64c00] flex items-center justify-center text-white">
                ✓
              </div>
              <div>
                <p className="font-medium">{toast.text}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Account;
