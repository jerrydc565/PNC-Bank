import React, { useMemo, useState, useEffect } from "react";
import { transactionAPI } from "../services/api";

const mockTransactions = [
  {
    id: "t1",
    date: "2025-11-18",
    description: "Starbucks",
    category: "Coffee",
    amount: -4.5,
    balance: 1245.5,
  },
  {
    id: "t2",
    date: "2025-11-17",
    description: "Payroll",
    category: "Income",
    amount: 1500,
    balance: 1250,
  },
  {
    id: "t3",
    date: "2025-11-16",
    description: "Grocery Store",
    category: "Groceries",
    amount: -68.32,
    balance: 1181.68,
  },
  {
    id: "t4",
    date: "2025-11-15",
    description: "Gym Membership",
    category: "Health",
    amount: -29.99,
    balance: 1250,
  },
  {
    id: "t5",
    date: "2025-11-14",
    description: "Electric Bill",
    category: "Utilities",
    amount: -95.12,
    balance: 1279.99,
  },
  {
    id: "t6",
    date: "2025-11-10",
    description: "Amazon",
    category: "Shopping",
    amount: -45.0,
    balance: 1375.11,
  },
  {
    id: "t7",
    date: "2025-11-05",
    description: "Transfer from savings",
    category: "Transfer",
    amount: 300,
    balance: 1420.11,
  },
];

function formatCurrency(value) {
  return value.toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
  });
}

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleDateString();
  } catch (e) {
    return iso;
  }
}

function getCategoryIcon(category) {
  // Map categories to Font Awesome icon classes used across the app
  const map = {
    Coffee: "fa-solid fa-mug-hot",
    Income: "fa-solid fa-money-bill-wave",
    Groceries: "fa-solid fa-cart-shopping",
    Health: "fa-solid fa-dumbbell",
    Utilities: "fa-solid fa-bolt",
    Shopping: "fa-solid fa-basket-shopping",
    Transfer: "fa-solid fa-arrow-right-arrow-left",
    "": "fa-solid fa-receipt",
  };

  return map[category] || "fa-solid fa-circle-dollar-sign";
}

export default function Transactions() {
  const [showDetails, setShowDetails] = useState(false);
  const [selectedTx, setSelectedTx] = useState(null);

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("date_desc");

  const openDetails = (tx) => {
    setSelectedTx(tx);
    setShowDetails(true);
  };

  const closeDetails = () => {
    setShowDetails(false);
    setSelectedTx(null);
  };
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const data = await transactionAPI.getTransactions();
        // Transform backend data to frontend format
        const formatted = data.map((tx) => {
          // Safely parse date - handle null/invalid dates
          let dateStr;
          try {
            dateStr = tx.createdAt
              ? new Date(tx.createdAt).toISOString().split("T")[0]
              : new Date().toISOString().split("T")[0];
          } catch (e) {
            dateStr = new Date().toISOString().split("T")[0];
          }

          // Determine icon based on transaction type and description
          let icon = "fa-solid fa-money-bill-transfer";
          let iconColor = "#0064de";
          const desc = (tx.description || "").toLowerCase();

          if (tx.transactionType === "DEPOSIT") {
            icon = "fa-solid fa-arrow-down";
            iconColor = "#00dc3b";
          } else if (desc.includes("bill")) {
            icon = "fa-regular fa-file";
            iconColor = "#ff6600";
          } else if (desc.includes("transfer")) {
            icon = "fa-solid fa-arrow-right-arrow-left";
            iconColor = "#0064de";
          } else if (
            desc.includes("goal") ||
            desc.includes("contribution") ||
            desc.includes("savings")
          ) {
            icon = "fa-solid fa-piggy-bank";
            iconColor = "#ff0000";
          } else {
            icon = "fa-solid fa-arrow-up";
            iconColor = "#dc0000";
          }

          return {
            id: tx.id.toString(),
            date: dateStr,
            description: tx.description || "Transaction",
            category: tx.transactionType,
            amount: tx.transactionType === "DEPOSIT" ? tx.amount : -tx.amount,
            balance: tx.balanceAfter || 0,
            icon: icon,
            iconColor: iconColor,
            status: tx.status || "APPROVED",
          };
        });
        setTransactions(formatted);
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = transactions.filter(
      (t) =>
        t.description.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q)
    );

    if (sort === "date_desc")
      list = list.sort((a, b) => new Date(b.date) - new Date(a.date));
    if (sort === "date_asc")
      list = list.sort((a, b) => new Date(a.date) - new Date(b.date));
    if (sort === "amount_desc") list = list.sort((a, b) => b.amount - a.amount);
    if (sort === "amount_asc") list = list.sort((a, b) => a.amount - b.amount);

    return list;
  }, [transactions, query, sort]);

  if (loading) {
    return <div className="p-6">Loading transactions...</div>;
  }

  return (
    <div className="p-3 sm:p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold">Transactions</h2>
          <p className="text-xs sm:text-sm text-gray-600">
            Recent activity on your accounts
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
          <input
            aria-label="Search transactions"
            className="border rounded p-2 text-sm sm:text-base w-full sm:w-auto"
            placeholder="Search description or category"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <select
            className="border rounded p-2 text-sm sm:text-base w-full sm:w-auto"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="date_desc">Date: newest</option>
            <option value="date_asc">Date: oldest</option>
            <option value="amount_desc">Amount: high → low</option>
            <option value="amount_asc">Amount: low → high</option>
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12 sm:py-16">
          <p className="text-base sm:text-lg mb-3">No transactions found</p>
          <p className="text-xs sm:text-sm text-gray-600">
            Try a different search or date range.
          </p>
        </div>
      ) : (
        <section className="bg-white rounded-lg p-3 sm:p-6 shadow">
          <section className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3">
            <div className="flex gap-2 sm:gap-3 items-center w-full sm:w-auto">
              <div className="rounded-lg border border-[#b3b3b3] flex-1 sm:flex-initial">
                <input
                  type="search"
                  aria-label="Search transactions"
                  placeholder="Search Transactions"
                  className="border-none outline-none p-2 px-3 sm:px-6 text-left text-sm sm:text-base w-full"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              <select
                className="border rounded p-2 text-sm sm:text-base"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="date_desc">Date: newest</option>
                <option value="date_asc">Date: oldest</option>
                <option value="amount_desc">Amount: high → low</option>
                <option value="amount_asc">Amount: low → high</option>
              </select>
            </div>
          </section>

          <section className="hidden md:grid grid-cols-4 gap-4 mt-4 border-b pb-3 border-[#cecece]">
            <div>
              <h4 className="text-[#595959] font-bold text-sm">DESCRIPTION</h4>
            </div>
            <div>
              <h4 className="text-[#595959] font-bold text-sm">DATE</h4>
            </div>
            <div>
              <h4 className="text-[#595959] font-bold text-sm">TYPE</h4>
            </div>
            <div className="flex items-center justify-end">
              <h4 className="text-[#595959] font-bold text-sm">AMOUNT</h4>
            </div>
          </section>

          <section>
            {filtered.map((t) => (
              <section
                key={t.id}
                onClick={() => openDetails(t)}
                role="button"
                tabIndex={0}
                className="flex flex-col md:grid md:grid-cols-4 items-start md:items-center gap-3 md:gap-4 border-b border-[#e6e6e6] py-4 px-3 md:px-0 cursor-pointer hover:bg-[#fafafa]"
              >
                <div className="flex items-center gap-3 md:gap-4 w-full md:w-auto">
                  <button
                    className="w-10 h-10 md:w-9 md:h-9 rounded-full flex items-center justify-center p-1 shrink-0"
                    style={{ backgroundColor: `${t.iconColor}22` }}
                  >
                    <i className={t.icon} style={{ color: t.iconColor }}></i>
                  </button>
                  <div className="flex-1 md:flex-initial">
                    <h5 className="font-semibold text-sm md:text-[15px]">
                      {t.description}
                    </h5>
                    <p className="text-[#595959] text-xs md:text-sm">
                      {t.category}
                    </p>
                  </div>
                </div>
                <div className="flex justify-between w-full md:w-auto md:block">
                  <span className="text-xs text-[#595959] md:hidden">
                    Date:
                  </span>
                  <p className="text-[#595959] text-sm">{formatDate(t.date)}</p>
                </div>
                <div className="flex justify-between w-full md:w-auto md:block">
                  <span className="text-xs text-[#595959] md:hidden">
                    Type:
                  </span>
                  <p className="text-sm md:text-[15px]">
                    {t.amount < 0 ? "Debit" : "Received"}
                  </p>
                </div>
                <div className="flex items-center justify-between w-full md:w-auto">
                  <span className="text-xs text-[#595959] md:hidden">
                    Amount:
                  </span>
                  <div className="flex items-center gap-2">
                    <p
                      className={`${
                        t.amount < 0 ? "text-[#c70000]" : "text-[#2ec700]"
                      } font-semibold text-sm md:text-base`}
                    >
                      {formatCurrency(t.amount)}
                    </p>
                    {t.status === "PENDING" ? (
                      <span className="rounded-2xl px-2 py-1 bg-[#ff880033] text-[#ff8800] text-xs">
                        Pending
                      </span>
                    ) : t.status === "REJECTED" ? (
                      <span className="rounded-2xl px-2 py-1 bg-[#ff000033] text-[#ff0000] text-xs">
                        Rejected
                      </span>
                    ) : (
                      <span className="rounded-2xl px-2 py-1 bg-[#2ec7003d] text-[#2ec700] text-xs">
                        Completed
                      </span>
                    )}
                  </div>
                </div>
              </section>
            ))}
          </section>
        </section>
      )}

      {/* Detail modal for a single transaction */}
      {showDetails && selectedTx && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[90%] max-w-lg">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-semibold text-lg">
                  {selectedTx.description}
                </h4>
                <p className="text-sm text-[#595959]">
                  {formatDate(selectedTx.date)}
                </p>
              </div>
              <button
                className="text-[#595959]"
                onClick={closeDetails}
                aria-label="Close transaction details"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <div className="mt-4">
              <p className="text-xl font-bold">
                {formatCurrency(selectedTx.amount)}
              </p>
              <p className="text-sm text-[#595959] mt-2">
                Category: {selectedTx.category}
              </p>
              <p className="text-sm text-[#595959] mt-2">
                Status:{" "}
                <span
                  className={`font-semibold ${
                    selectedTx.status === "PENDING"
                      ? "text-[#ff8800]"
                      : selectedTx.status === "REJECTED"
                      ? "text-[#ff0000]"
                      : "text-[#2ec700]"
                  }`}
                >
                  {selectedTx.status || "APPROVED"}
                </span>
              </p>
              <p className="text-sm text-[#595959] mt-2">
                Balance after: {formatCurrency(selectedTx.balance)}
              </p>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button className="px-4 py-2 border rounded">Dispute</button>
              <button
                className="px-4 py-2 bg-[#c64c00] text-white rounded"
                onClick={closeDetails}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 text-sm text-gray-500">
        Showing {filtered.length} transactions
      </div>
    </div>
  );
}
