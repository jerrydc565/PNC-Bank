import React, { useState, useEffect, useRef } from "react";
import { transactionAPI } from "../services/api";

export default function Transactions() {
  const [showDetails, setShowDetails] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [selectedTx, setSelectedTx] = useState(null);
  const receiptRef = useRef(null);

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState(0);

  const formatCurrency = (value) => {
    return Math.abs(value).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "short" });
    const year = date.getFullYear();

    const suffix =
      day === 1 || day === 21 || day === 31
        ? "st"
        : day === 2 || day === 22
        ? "nd"
        : day === 3 || day === 23
        ? "rd"
        : "th";

    return `Date: ${day}${suffix} ${month}, ${year}`;
  };

  const generateRefId = () => {
    return Math.random().toString(36).substring(2, 12).toUpperCase();
  };

  const openDetails = (tx) => {
    setSelectedTx(tx);
    setShowDetails(true);
  };

  const closeDetails = () => {
    setShowDetails(false);
    setSelectedTx(null);
    setShowReceipt(false);
  };

  const handlePrint = () => {
    window.print();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [txData, balanceData] = await Promise.all([
          transactionAPI.getTransactions(),
          transactionAPI.getBalance(),
        ]);

        setBalance(balanceData || 0);

        const formatted = txData.map((tx) => {
          const accountName =
            localStorage.getItem("firstName") +
            " " +
            localStorage.getItem("secondName");
          const accountNumber =
            localStorage.getItem("accountNumber") || "3005397405";

          // Determine if it's a deposit or debit
          const isDeposit = tx.transactionType === "DEPOSIT";

          // Generate realistic bank and account names
          const banks = [
            "Banco de Venezuela",
            "BCA Bank Central Asia",
            "Banco de bogota",
            "Bank of Venezuela",
            "NEOUI/VIVIANA Bank",
            "ITAU UNIBANCO",
            "SAVINGS BANK/PUNYAWEE",
            "BCA/RIKA HERAWATI"
          ];
          
          const names = [
            "Leydi Pérez",
            "Eka Rizki Saputri",
            "Lina marcela arrieta pacheco",
            "Jessica Sierra",
            "Viviana Rodriguez",
            "Maria Santos",
            "Punyawee Chen",
            "Rika Herawati"
          ];
          
          const randomIndex = Math.floor(Math.random() * banks.length);
          const transferBank = banks[randomIndex];
          const transferName = names[randomIndex];

          // Generate description with bank and name details
          let description = tx.description || "Transaction";
          let fullDescription = description;
          
          if (isDeposit) {
            fullDescription = `Direct TF: ${transferBank}/${transferName}`;
          } else {
            fullDescription = `Direct TF: ${transferBank}/${transferName}`;
          }

          return {
            id: tx.id.toString(),
            date: tx.createdAt,
            description: fullDescription,
            amount: isDeposit ? tx.amount : -tx.amount,
            balance: tx.balanceAfter || 0,
            type: isDeposit ? "CREDIT" : "DEBIT",
            isDeposit: isDeposit,
            status: tx.status || "APPROVED",
            bankName: transferBank,
            accountName: transferName,
            accountNumber: accountNumber,
            beneficiaryPhone: "447045531099",
            refId: generateRefId(),
          };
        });
        setTransactions(formatted);
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="p-6">Loading transactions...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
        <h1 className="text-2xl font-bold text-blue-600">
          Welcome, {localStorage.getItem("firstName") || "User"}
        </h1>
        <div className="flex justify-between items-center mt-2">
          <p className="text-3xl font-bold">
            {balance.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded text-sm">
            MENU ▼
          </button>
        </div>
        <p className="text-green-600 text-sm">USD</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm mb-4">
        <div className="flex border-b">
          <button className="flex-1 py-3 text-center font-medium text-black border-b-2 border-black">
            Recent transactions
          </button>
          <button className="flex-1 py-3 text-center font-medium text-gray-500">
            Recent Withdrawals
          </button>
        </div>

        {/* Transaction List */}
        <div className="p-4 space-y-3">
          {transactions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No transactions found
            </div>
          ) : (
            transactions.map((tx) => (
              <div
                key={tx.id}
                onClick={() => openDetails(tx)}
                className="bg-white border border-gray-200 rounded-lg p-4 cursor-pointer hover:shadow-md transition"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-10 h-10 rounded-full ${
                      tx.isDeposit ? "bg-green-100" : "bg-red-100"
                    } flex items-center justify-center flex-shrink-0`}
                  >
                    <i
                      className={`fa-solid fa-arrow-down ${
                        tx.isDeposit ? "text-green-600" : "text-red-600"
                      }`}
                    ></i>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <p className="text-lg font-semibold">
                          {formatCurrency(tx.amount)}{" "}
                          <span className="text-sm text-gray-600">USD</span>
                        </p>
                        <p className="text-sm text-gray-600">
                          {tx.description}
                        </p>
                      </div>
                      <p
                        className={`${
                          tx.isDeposit ? "text-green-600" : "text-red-600"
                        } font-semibold text-sm whitespace-nowrap ml-2`}
                      >
                        {tx.type}
                      </p>
                    </div>
                    <p className="text-xs text-gray-500">
                      Balance: {formatCurrency(tx.balance)}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {formatDate(tx.date)}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Transaction Details Modal */}
      {showDetails && selectedTx && !showReceipt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
            <button
              onClick={closeDetails}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <i className="fa-solid fa-xmark text-xl"></i>
            </button>

            <h2 className="text-xl font-bold text-blue-600 mb-4">
              Transaction details
            </h2>
            <div className="border-b pb-4 mb-4">
              <p className="text-sm text-gray-600">Transaction information</p>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-start gap-3">
                <div
                  className={`w-10 h-10 rounded-full ${
                    selectedTx.isDeposit ? "bg-green-100" : "bg-blue-100"
                  } flex items-center justify-center flex-shrink-0`}
                >
                  <i
                    className={`fa-solid fa-arrow-down ${
                      selectedTx.isDeposit ? "text-green-600" : "text-blue-600"
                    }`}
                  ></i>
                </div>
                <div className="flex-1">
                  <p className="text-lg font-semibold">
                    {formatCurrency(selectedTx.amount)}{" "}
                    <span className="text-sm text-gray-600">USD</span>
                  </p>
                  <p className="text-sm text-gray-600">
                    {selectedTx.description}
                  </p>
                  <p className="text-sm font-semibold mt-2">
                    Beneficiary information's
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatDate(selectedTx.date)}
                  </p>
                </div>
                <span
                  className={`${
                    selectedTx.isDeposit ? "bg-green-500" : "bg-blue-500"
                  } text-white text-xs px-3 py-1 rounded`}
                >
                  {selectedTx.type}
                </span>
              </div>

              <div className="bg-gray-50 p-3 rounded space-y-2">
                <div>
                  <p className="font-semibold text-sm">Bank name:</p>
                  <p className="text-sm">{selectedTx.bankName}</p>
                </div>
                <div>
                  <p className="font-semibold text-sm">Account name:</p>
                  <p className="text-sm">{selectedTx.accountName}</p>
                </div>
                <div>
                  <p className="font-semibold text-sm">Account NO.:</p>
                  <p className="text-sm">{selectedTx.accountNumber}</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowReceipt(true)}
              className="w-full bg-green-600 text-white py-3 rounded font-semibold hover:bg-green-700 transition flex items-center justify-center gap-2"
            >
              <i className="fa-solid fa-print"></i>
              Print
            </button>
          </div>
        </div>
      )}

      {/* Transaction Receipt Modal */}
      {showDetails && selectedTx && showReceipt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg p-8 w-full max-w-md my-8">
            <div ref={receiptRef} className="print-content">
              {/* Receipt Header */}
              <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="w-10 h-10 bg-blue-600 rounded-full"></div>
                  <div className="text-left">
                    <h1 className="text-2xl font-bold text-gray-800">LONDON</h1>
                    <p className="text-xs text-blue-800">ECONOMICAL BANK</p>
                  </div>
                </div>
              </div>

              <h2 className="text-center text-xl font-bold mb-2">
                Transaction Receipt
              </h2>
              <p className="text-center text-sm text-blue-700 font-semibold mb-1">
                Thank You For Using London EconomicalBank
              </p>
              <p className="text-center text-xs text-gray-600 mb-4">
                Here Is Your Transaction Receipt.
                <br />
                See Transfer Transaction Below.
              </p>

              {/* Receipt Details */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="font-semibold">Reference ID:</span>
                  <span>{selectedTx.refId}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-semibold">Remark:</span>
                  <span>{selectedTx.type}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-semibold">Transaction Status:</span>
                  <span className="bg-green-600 text-white px-3 py-1 rounded text-xs">
                    Successful
                  </span>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded mb-4">
                <h3 className="font-bold text-sm mb-3 text-blue-900">
                  Transaction Details
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Debit Account:</span>
                    <span className="font-semibold">0102030235000611703</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Amount:</span>
                    <span className="font-semibold">
                      USD {formatCurrency(selectedTx.amount)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Description</span>
                    <span className="font-semibold">
                      {selectedTx.description}...
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Bank:</span>
                    <span className="font-semibold">{selectedTx.bankName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Account Number:</span>
                    <span className="font-semibold">
                      {selectedTx.accountNumber}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Beneficiary Name:</span>
                    <span className="font-semibold">
                      {selectedTx.accountName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Beneficiary Phone:</span>
                    <span className="font-semibold">
                      {selectedTx.beneficiaryPhone}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Transaction Date:</span>
                    <span className="font-semibold">
                      {formatDate(selectedTx.date).replace("Date: ", "")}
                    </span>
                  </div>
                </div>
              </div>

              {/* QR Code */}
              <div className="text-center mb-4">
                <p className="text-xs text-gray-600 mb-2">
                  Thanks for banking with us
                </p>
                <p className="text-xs text-gray-500 mb-3">
                  Receipt generated from https://londoneconomicalb.online/
                </p>
                <div className="flex justify-center">
                  <div className="p-2 bg-white">
                    {/* QR Code placeholder - you'll need to install react-qr-code */}
                    <div className="w-32 h-32 bg-gray-200 flex items-center justify-center">
                      <i className="fa-solid fa-qrcode text-4xl text-gray-400"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={handlePrint}
                className="flex-1 bg-green-600 text-white py-3 rounded font-semibold hover:bg-green-700 transition flex items-center justify-center gap-2"
              >
                <i className="fa-solid fa-print"></i>
                Print
              </button>
              <button
                onClick={closeDetails}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded font-semibold hover:bg-gray-300 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-content,
          .print-content * {
            visibility: visible;
          }
          .print-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
