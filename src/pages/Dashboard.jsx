import React from "react";
import Logo from "../assets/image/image.png";
import { Link } from "react-router-dom";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import view from "../assets/image/view.png";
import hide from "../assets/image/hide.png";
import { transactionAPI } from "../services/api";
function Dashboard() {
  const navigate = useNavigate();

  const [balance, setBalance] = useState(0);
  const [accountNumber, setAccountNumber] = useState("");
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedTx, setSelectedTx] = useState(null);
  const [hideValue, setHideValue] = useState("Show");
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState("");
  const [depositMemo, setDepositMemo] = useState("");
  const [depositError, setDepositError] = useState("");

  const filteredTransactions = useMemo(() => {
    let list = recentTransactions.slice();
    // search
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q) ||
          t.amount.toLowerCase().includes(q)
      );
    }
    // filter type
    if (filterType !== "all") {
      list = list.filter((t) => t.type === filterType);
    }
    return list;
  }, [recentTransactions, search, filterType]);
  const [bills, setBills] = useState([]);
  const [showPayModal, setShowPayModal] = useState(false);
  const [payTarget, setPayTarget] = useState(null);
  const [payFrom, setPayFrom] = useState("checking");
  const [payLoading, setPayLoading] = useState(false);

  // Add Goal / Add Funds modal state
  const [showAddGoalModal, setShowAddGoalModal] = useState(false);
  const [newGoalTitle, setNewGoalTitle] = useState("");
  const [newGoalTarget, setNewGoalTarget] = useState("");

  const [showAddFundsModal, setShowAddFundsModal] = useState(false);
  const [fundGoalId, setFundGoalId] = useState(null);
  const [fundAmount, setFundAmount] = useState("");
  const [fundFrom, setFundFrom] = useState("checking");

  const [toast, setToast] = useState({ text: "", visible: false });
  const [goals, setGoals] = useState(() => {
    const userId = localStorage.getItem("userId");
    const savedGoals = localStorage.getItem(`goals_${userId}`);
    return savedGoals ? JSON.parse(savedGoals) : [];
  });

  const [notice, setNotice] = useState("");

  const firstName =
    userProfile?.firstName || localStorage.getItem("firstName") || "User";
  const secondName =
    userProfile?.secondName || localStorage.getItem("secondName") || "User";
  const email = userProfile?.email || localStorage.getItem("email");

  console.log("📖 Reading firstName:", firstName);
  console.log("📖 Reading secondName:", secondName);
  console.log("📖 Reading email:", email);
  const fullName = `${firstName} ${secondName}`;

  // Save goals to localStorage whenever they change
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      localStorage.setItem(`goals_${userId}`, JSON.stringify(goals));
    }
  }, [goals]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get account number from localStorage or fetch from API
        const storedAccountNumber = localStorage.getItem("accountNumber");
        if (storedAccountNumber) {
          setAccountNumber(storedAccountNumber);
        } else {
          const userId = localStorage.getItem("userId");
          if (userId) {
            try {
              const response = await fetch(
                `https://pnc-bank-backend-2.onrender.com/api/user/${userId}/account`
              );
              const data = await response.json();
              if (data.accountNumber) {
                setAccountNumber(data.accountNumber);
                localStorage.setItem("accountNumber", data.accountNumber);
              }
            } catch (err) {
              console.error("Failed to fetch account number:", err);
            }
          }
        }

        // Fetch balance
        const userBalance = await transactionAPI.getBalance();
        setBalance(userBalance || 0);

        // Fetch recent transactions (last 4) from backend
        const allTransactions = await transactionAPI.getTransactions();

        // Transform backend data to match frontend format
        const formatted = allTransactions.slice(0, 4).map((tx) => {
          // Safely parse date
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
            title: tx.description || "Transaction",
            date: dateStr,
            amount:
              tx.transactionType === "DEPOSIT"
                ? `+$${tx.amount.toFixed(2)}`
                : `-$${tx.amount.toFixed(2)}`,
            type: tx.transactionType === "DEPOSIT" ? "received" : "debit",
            category: tx.transactionType,
            note: tx.description,
            icon: icon,
            iconColor: iconColor,
          };
        });

        setRecentTransactions(formatted);
        console.log("🎨 Recent transactions with icons:", formatted);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      }
    };

    fetchData();
  }, []);

  // ✅ NEW: Fetch user data on component mount
  useEffect(() => {
    const email = localStorage.getItem("email");
    console.log("📧 Email from localStorage:", email); // Check what email is stored

    const fetchUserProfile = async () => {
      if (!email) {
        navigate("/login");
        return;
      }

      try {
        console.log("🔍 Fetching profile for:", email); // Check what we're fetching

        const response = await fetch(`https://pnc-bank-backend-2.onrender.com/api/user/${email}`);
        const data = await response.json();

        console.log("📦 Backend response:", data); // Check what backend returns
        console.log("🔍 Backend response firstName:", data.firstName); // Check firstName
        console.log("🔍 Backend response secondName:", data.secondName); // Check secondName
        console.log("🔍 Backend response email:", data.email); // Check email

        if (data.success) {
          console.log("✅ Setting userProfile state to:", data);
          setUserProfile(data);
        } else {
          console.error("Failed to fetch user profile:", data.message);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  // ✅ ADD LOADING CHECK (before your existing code)
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f3f3f3] flex items-center justify-center">
        <div className="text-xl">Loading your dashboard...</div>
      </div>
    );
  }

  const handleChange = () => {
    if (hideValue == "Show") {
      setHideValue("Hide");
    } else {
      setHideValue("Show");
    }
  };

  const handleChange2 = () => {
    if (hideValue2 == "Show") {
      setHideValue2("Hide");
    } else {
      setHideValue2("Show");
    }
  };

  const handleChange3 = () => {
    if (hideValue3 == "Show") {
      setHideValue3("Hide");
    } else {
      setHideValue3("Show");
    }
  };

  // Transactions state (sample data driven from static markup)

  // UI state: search, filters, sorting and details modal

  const openDetails = (tx) => {
    setSelectedTx(tx);
    setShowDetails(true);
  };
  const closeDetails = () => {
    setShowDetails(false);
    setSelectedTx(null);
  };

  // Upcoming bills and savings goals (functional)

  const payBill = (id) => {
    // legacy quick-pay kept for backward compatibility (not used)
    setBills((s) => s.map((b) => (b.id === id ? { ...b, paid: true } : b)));
    setNotice("Payment sent");
    setTimeout(() => setNotice(""), 1800);
  };

  // Payment modal state for Upcoming Bills

  const accountsForPayment = [
    {
      id: "checking",
      label: `Premium Checking (${
        accountNumber ? `****${accountNumber.slice(-4)}` : "****----"
      }) - $${(balance || 0).toLocaleString()}`,
    },
    { id: "savings", label: "High-Yield Savings (****7232) - $15,289" },
    { id: "credit", label: "Platinum Rewards (****3214) - $8,289" },
  ];

  const openPayModal = (bill) => {
    setPayTarget(bill);
    setPayFrom("checking");
    setShowPayModal(true);
  };

  const confirmPay = () => {
    if (!payTarget) return;
    setPayLoading(true);
    setTimeout(() => {
      setBills((s) =>
        s.map((b) => (b.id === payTarget.id ? { ...b, paid: true } : b))
      );
      setShowPayModal(false);
      setPayLoading(false);
      setPayTarget(null);
      showToast("Payment successful");
    }, 900);
  };

  const cancelPay = () => {
    setShowPayModal(false);
    setPayTarget(null);
  };

  // Toast (pop-out) state

  const showToast = (text, duration = 2000) => {
    setToast({ text, visible: true });
    setTimeout(() => setToast({ text: "", visible: false }), duration);
  };

  const handleDeposit = async () => {
    setDepositError("");
    if (!depositAmount || isNaN(depositAmount) || Number(depositAmount) <= 0) {
      setDepositError("Please enter a valid amount");
      return;
    }

    try {
      const description = `Deposit${depositMemo ? " - " + depositMemo : ""}`;
      await transactionAPI.createTransaction(
        "DEPOSIT",
        Number(depositAmount),
        description
      );

      // Refresh balance and transactions after deposit
      const newBalance = await transactionAPI.getBalance();
      setBalance(newBalance);

      // Refresh recent transactions
      const allTransactions = await transactionAPI.getTransactions();
      const formatted = allTransactions.slice(0, 4).map((tx) => {
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
          title: tx.description || "Transaction",
          date: dateStr,
          amount:
            tx.transactionType === "DEPOSIT"
              ? `+$${tx.amount.toFixed(2)}`
              : `-$${tx.amount.toFixed(2)}`,
          type: tx.transactionType === "DEPOSIT" ? "received" : "debit",
          category: tx.transactionType,
          note: tx.description,
          icon: icon,
          iconColor: iconColor,
        };
      });
      setRecentTransactions(formatted);

      showToast("Deposit successful");
      setShowDepositModal(false);
      setDepositAmount("");
      setDepositMemo("");
    } catch (error) {
      setDepositError(error.message || "Deposit failed");
    }
  };
  const addToGoal = (id, amount) => {
    setGoals((s) =>
      s.map((g) =>
        g.id === id ? { ...g, saved: Math.min(g.target, g.saved + amount) } : g
      )
    );
  };

  const addGoal = (title, target) => {
    const next = { id: `g${Date.now()}`, title, saved: 0, target };
    setGoals((s) => [next, ...s]);
  };

  // Confirm handlers for modals
  const confirmAddGoal = () => {
    const title = newGoalTitle && newGoalTitle.trim();
    const target = Number(newGoalTarget);
    if (!title) return showToast("Please enter a goal name");
    if (!target || isNaN(target) || target <= 0)
      return showToast("Please enter a valid target amount");
    addGoal(title, target);
    setShowAddGoalModal(false);
    setNewGoalTitle("");
    setNewGoalTarget("");
    showToast("Goal added");
  };

  const confirmAddFunds = async () => {
    const amt = Number(fundAmount);
    if (!fundGoalId) return showToast("No goal selected");
    if (!amt || isNaN(amt) || amt <= 0)
      return showToast("Enter a valid amount");

    try {
      // Check if user has sufficient balance
      const currentBalance = await transactionAPI.getBalance();
      if (currentBalance < amt) {
        showToast("Insufficient funds");
        return;
      }

      // Create a WITHDRAW transaction for the goal contribution
      const goalName =
        goals.find((g) => g.id === fundGoalId)?.title || "Savings Goal";
      await transactionAPI.createTransaction(
        "WITHDRAW",
        amt,
        `Contribution to ${goalName}`
      );

      // Update balance
      const newBalance = await transactionAPI.getBalance();
      setBalance(newBalance);

      // Refresh recent transactions
      const allTransactions = await transactionAPI.getTransactions();
      const formatted = allTransactions.slice(0, 4).map((tx) => {
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
          title: tx.description || "Transaction",
          date: dateStr,
          amount:
            tx.transactionType === "DEPOSIT"
              ? `+$${tx.amount.toFixed(2)}`
              : `-$${tx.amount.toFixed(2)}`,
          type: tx.transactionType === "DEPOSIT" ? "received" : "debit",
          category: tx.transactionType,
          note: tx.description,
          icon: icon,
          iconColor: iconColor,
        };
      });
      setRecentTransactions(formatted);

      // Add funds to goal
      addToGoal(fundGoalId, amt);

      setShowAddFundsModal(false);
      setFundAmount("");
      setFundGoalId(null);
      setFundFrom("checking");
      showToast("Amount added to goal");
    } catch (error) {
      showToast(error.message || "Failed to add funds");
    }
  };

  return (
    <main className="bg-[#f3f3f3] pb-20">
      <section className="flex justify-between px-3 sm:px-5 lg:px-10 p-3 sm:p-5">
        <div>
          <h2 className="font-bold text-xl sm:text-2xl">
            Welcome back, {firstName}!
          </h2>
          <p className="text-[12px] sm:text-[14px] text-[#595959]">
            Last login: Today, 10:32 AM
          </p>
        </div>
      </section>

      <section className="flex flex-col md:flex-row gap-5 md:gap-8 px-2 sm:px-5 lg:px-10">
        <section className="bg-white rounded-lg shadow p-5 sm:p-8 lg:p-10 md:w-[70%] flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-base sm:text-lg">
              Your Accounts
            </h3>
            <Link to={"/account"}>
              <h4 className="text-[14px] hover:text-[#b14400] font-medium text-[#c64c00] ">
                View All <i className="fa-solid fa-angle-right text-lg"></i>
              </h4>
            </Link>
          </div>
          <div className="bg-[#c78100] w-full rounded-lg p-4 sm:p-5">
            <p className="text-[10px] sm:text-[11px] text-[#ffffff]">
              Checking Account
            </p>
            <p className="text-lg sm:text-xl font-semibold text-white">
              Premium Checking
            </p>
            <p className="text-base sm:text-lg text-[#ffffff] mb-3">
              {accountNumber ? `****${accountNumber.slice(-4)}` : "****----"}
            </p>
            <p className="flex items-center justify-between text-[10px] text-[#ffffff]  ">
              Current Balance{" "}
              <span onClick={handleChange}>
                <img
                  src={view}
                  alt=""
                  className={` w-5  ${
                    hideValue == "Hide" ? "hidden" : "block"
                  }`}
                />
                <img
                  src={hide}
                  alt=""
                  className={` w-5  ${
                    hideValue == "Hide" ? "block" : "hidden"
                  }`}
                />
              </span>
            </p>
            <p
              className={`text-xl font-bold text-white mb-3 ${
                hideValue == "Hide" ? "hidden" : "block"
              } `}
            >
              $
              {(balance || 0).toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
            <p
              className={`text-xl font-bold text-white mb-3 ${
                hideValue == "Hide" ? "block" : "hidden"
              } `}
            >
              {" "}
              ••••••
            </p>
            <p className="text-[10px] text-[#ffffff]">Available Balance</p>
            <p
              className={`text-l font-semibold text-white mb-5  ${
                hideValue == "Hide" ? "hidden" : "block"
              } `}
            >
              $
              {balance.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
            <p
              className={`text-l font-semibold text-white mb-5  ${
                hideValue == "Hide" ? "block" : "hidden"
              } `}
            >
              {" "}
              ••••••
            </p>
            <Link to={"/checking-details"}>
              {" "}
              <p className="text-[14px]  text-white text-right">
                View details <i className="fa-solid fa-angle-right "></i>
              </p>
            </Link>
          </div>

          {/* Hidden: Mock Savings and Credit accounts - user has one real account */}
        </section>
        <section className="md:w-[30%] mt-5 md:mt-0 flex flex-col gap-5 md:gap-7">
          <div className="p-3 sm:p-5 bg-white rounded-lg shadow grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
            <Link to={"/payment"}>
              {" "}
              <section className="w-full p-2 sm:p-4 flex flex-col items-center justify-center rounded-lg hover:bg-[#bababa73] cursor-pointer">
                <button className="w-9 sm:w-11 cursor-pointer h-9 sm:h-11 rounded-full bg-[#0022ff43] mb-1 sm:mb-2">
                  <i className="fa-solid fa-arrow-right-arrow-left text-lg sm:text-xl text-[#0022ff]"></i>
                </button>
                <p className="text-[9px] sm:text-[10px] text-[#595959]">
                  Transfer
                </p>
              </section>
            </Link>

            <Link to={"/payment"}>
              {" "}
              <section className="w-full p-2 sm:p-4 flex flex-col items-center justify-center rounded-lg hover:bg-[#bababa73] cursor-pointer">
                <button className="w-9 sm:w-11 cursor-pointer h-9 sm:h-11 rounded-full bg-[#7700ff43] mb-1 sm:mb-2">
                  {" "}
                  <i className="fa-regular fa-credit-card text-lg sm:text-xl text-[#7700ff]"></i>
                </button>
                <p className="text-[9px] sm:text-[10px] text-[#595959]">
                  Pay cards
                </p>
              </section>
            </Link>
            <Link to={"/payment"}>
              <section className="w-full p-2 sm:p-4 flex flex-col items-center justify-center rounded-lg hover:bg-[#bababa73] cursor-pointer">
                <button className="w-9 sm:w-11 cursor-pointer h-9 sm:h-11 rounded-full bg-[#ffc40043] mb-1 sm:mb-2">
                  {" "}
                  <i className="fa-regular fa-file text-lg sm:text-xl text-[#ffc400]"></i>
                </button>
                <p className="text-[9px] sm:text-[10px] text-[#595959]">
                  Pay bills
                </p>
              </section>
            </Link>

            <section
              className="w-full p-2 sm:p-4 flex flex-col items-center justify-center rounded-lg hover:bg-[#bababa73] cursor-pointer"
              onClick={() => setShowDepositModal(true)}
            >
              <button className="w-9 sm:w-11 cursor-pointer h-9 sm:h-11 rounded-full bg-[#04ff0043] mb-1 sm:mb-2">
                {" "}
                <i className="fa-solid fa-dollar-sign text-lg sm:text-xl text-[#04ff00]"></i>
              </button>
              <p className="text-[9px] sm:text-[10px] text-[#595959]">
                Deposit
              </p>
            </section>
            <Link to={"/account"}>
              <section className="w-full p-2 sm:p-4 flex flex-col items-center justify-center rounded-lg hover:bg-[#bababa73] cursor-pointer">
                <button className="w-9 sm:w-11 cursor-pointer h-9 sm:h-11 rounded-full bg-[#ff000043] mb-1 sm:mb-2">
                  {" "}
                  <i className="fa-solid fa-piggy-bank text-lg sm:text-xl text-[#ff0000]"></i>
                </button>
                <p className="text-[9px] sm:text-[10px] text-[#595959]">
                  Savings
                </p>
              </section>
            </Link>
            <Link to={"/card"}>
              {" "}
              <section className="w-full p-2 sm:p-4 flex flex-col items-center justify-center rounded-lg hover:bg-[#bababa73] cursor-pointer">
                <button className="w-9 sm:w-11 cursor-pointer h-9 sm:h-11 rounded-full bg-[#0022ff43] mb-1 sm:mb-2">
                  {" "}
                  <i className="fa-solid fa-gift text-lg sm:text-xl text-[#0022ff]"></i>
                </button>
                <p className="text-[9px] sm:text-[10px] text-[#595959]">
                  Rewards
                </p>
              </section>
            </Link>
          </div>
          <div className="p-3 sm:p-5 bg-white rounded-lg shadow grid grid-cols-1 gap-3 sm:gap-4">
            <section className="flex justify-between items-center">
              <h3 className="font-semibold text-base sm:text-lg">
                Upcoming Bills
              </h3>
              <Link to={"/payment"}>
                <h4 className="text-[14px] font-medium text-[#c64c00] hover:text-[#803100] ">
                  View All <i className="fa-solid fa-angle-right"></i>
                </h4>
              </Link>
            </section>
            {notice && <div className="text-sm text-green-600">{notice}</div>}
            {bills.map((b) => (
              <section
                key={b.id}
                className={`flex flex-col sm:flex-row p-2 sm:p-3 rounded-lg items-start sm:items-center justify-between gap-2 sm:gap-0 ${
                  b.paid
                    ? "bg-[#e6ffe6]"
                    : b.dueIn <= 2
                    ? "bg-[#ffefef]"
                    : "bg-[#f5f5f5]"
                }`}
              >
                <div className="flex gap-2 sm:gap-3 items-center">
                  <button
                    className={`w-10 h-10 rounded-lg ${
                      b.paid ? "bg-[#cceccc]" : "bg-[#ff00002e]"
                    }`}
                  >
                    <i className="fa-regular fa-file text-[#ff0000] text-xl "></i>
                  </button>
                  <div>
                    <h5 className="font-semibold text-[12px]">{b.title}</h5>
                    <p className="text-[10px]">{b.dueDate}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <h5 className="font-semibold text-[12px]">
                    ${b.amount.toLocaleString()}
                  </h5>
                  {!b.paid ? (
                    <>
                      <button
                        className="text-[12px] rounded-2xl p-1 px-3 bg-[#c64c00] text-white"
                        onClick={() => openPayModal(b)}
                      >
                        Pay Now
                      </button>
                    </>
                  ) : (
                    <span className="text-[12px] rounded-2xl p-1 px-3 bg-[#2ec7003d] text-[#2ec700]">
                      Paid
                    </span>
                  )}
                </div>
              </section>
            ))}
          </div>
          <div className="p-3 sm:p-5 bg-white rounded-lg shadow grid grid-cols-1 gap-3 sm:gap-4">
            <section className="flex justify-between items-center">
              <h4 className="font-semibold text-base sm:text-lg">
                Savings Goals
              </h4>
              <button
                className="font-medium text-[12px] bg-[#c64c00] text-white rounded-2xl px-3 p-1"
                onClick={() => setShowAddGoalModal(true)}
              >
                Add Goal
              </button>
            </section>

            {goals.map((g) => {
              const pct = Math.min(100, Math.round((g.saved / g.target) * 100));
              return (
                <section key={g.id} className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <h5 className=" font-medium text-[10px]">{g.title}</h5>
                    <span className=" font-medium text-[10px]">{pct}%</span>
                  </div>
                  <div className="w-full rounded-2xl bg-[#cfcfcf2f] h-3 overflow-hidden">
                    <div
                      className="p-1 rounded-2xl bg-[#c64c00] h-full"
                      style={{ width: pct + "%" }}
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-[9px] text-[#595959]">
                      ${g.saved.toLocaleString()} saved
                    </p>
                    <div className="flex items-center gap-2">
                      <p className="text-[9px] text-[#595959]">
                        ${g.target.toLocaleString()} goal
                      </p>
                      <button
                        className="text-[11px] rounded-2xl p-1 px-2 bg-[#c64c00] text-white"
                        onClick={() => {
                          setFundGoalId(g.id);
                          setFundAmount("");
                          setFundFrom("checking");
                          setShowAddFundsModal(true);
                        }}
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </section>
              );
            })}
          </div>
        </section>
      </section>
      {/* Recent Transactions: functional list with search, filters and details modal */}
      <section className="bg-white rounded-lg shadow pb-4 w-full md:w-[65%] m-2 sm:m-5 mt-5 md:m-10">
        <div className="flex flex-col sm:flex-row justify-between gap-3 pb-3 sm:pb-5 p-3 sm:p-5 lg:p-10 border-b border-[#ececec]">
          <h3 className="font-semibold text-base sm:text-lg">
            Recent Transactions
          </h3>
          <div className="flex items-center gap-2 sm:gap-3 relative">
            <button
              className="p-1 px-3 sm:px-4 rounded-lg bg-[#ffffff] border border-[#e3e3e3] flex items-center gap-1 sm:gap-2 text-sm"
              onClick={() => setShowFilters((s) => !s)}
              aria-expanded={showFilters}
              aria-controls="tx-filters"
            >
              <i className="fa-solid fa-filter"></i>
              <span className="capitalize hidden sm:inline">filter</span>
            </button>
            <Link to={"/transaction"}>
              <h4 className="font-medium lg:text-lg text-[14px]  text-[#c64c00] hover:text-[#833200]">
                View all <i className="fa-solid fa-angle-right"></i>
              </h4>
            </Link>
            {showFilters && (
              <div
                id="tx-filters"
                className="absolute right-0 mt-12 bg-white border p-3 rounded shadow w-56"
              >
                <label className="text-sm">Type</label>
                <select
                  className="w-full p-2 border rounded my-2"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <option value="all">All</option>
                  <option value="received">Received</option>
                  <option value="debit">Debit</option>
                  <option value="subscription">Subscription</option>
                </select>
                <label className="text-sm">Sort</label>
                <select
                  className="w-full p-2 border rounded my-2"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                  <option value="amountDesc">Amount (high)</option>
                  <option value="amountAsc">Amount (low)</option>
                </select>
                <button
                  className="mt-2 w-full p-2 bg-[#c64c00] text-white rounded"
                  onClick={() => setShowFilters(false)}
                >
                  Apply
                </button>
              </div>
            )}
          </div>
        </div>

        <div className=" mx-5 m-5 rounded-lg border border-[#dadada]   ">
          <input
            type="search"
            name=""
            id=""
            className="outline-none border-none w-full p-2"
            placeholder="Search transactions"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Table Header */}
        <section className="hidden md:grid grid-cols-3 gap-4 px-5 pb-3 border-b border-[#cecece]">
          <div>
            <h4 className="text-[#595959] font-bold text-sm">DESCRIPTION</h4>
          </div>
          <div>
            <h4 className="text-[#595959] font-bold text-sm">DATE</h4>
          </div>
          <div className="flex items-center justify-end">
            <h4 className="text-[#595959] font-bold text-sm">AMOUNT</h4>
          </div>
        </section>

        {/* Transaction Rows */}
        <section className="flex flex-col">
          {filteredTransactions.length === 0 && (
            <div className="p-4 text-center text-sm text-[#595959]">
              No transactions found
            </div>
          )}
          {filteredTransactions.map((tx) => (
            <div
              key={tx.id}
              className="flex flex-col md:grid md:grid-cols-3 gap-2 md:gap-4 px-3 sm:px-5 py-3 md:py-4 border-b border-[#e6e6e6] cursor-pointer hover:bg-[#fafafa]"
              onClick={() => openDetails(tx)}
            >
              <div className="flex items-center gap-3">
                <button
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center p-1 flex-shrink-0"
                  style={{ backgroundColor: `${tx.iconColor || "#0064de"}22` }}
                >
                  <i
                    className={tx.icon || "fa-solid fa-money-bill-transfer"}
                    style={{ color: tx.iconColor || "#0064de" }}
                  ></i>
                </button>
                <div className="flex-1">
                  <h5 className="font-semibold text-[14px] sm:text-[15px]">
                    {tx.title}
                  </h5>
                  <p className="text-[#595959] text-[12px] md:hidden">
                    {tx.date}
                  </p>
                </div>
                <h5
                  className={`font-semibold text-[14px] sm:text-[15px] md:hidden ${
                    tx.type === "received" ? "text-[#00dc3b]" : "text-[#dc0000]"
                  }`}
                >
                  {tx.amount}
                </h5>
              </div>
              <div className="hidden md:block">
                <p className="text-[#595959] text-[13px]">{tx.date}</p>
              </div>
              <div className="hidden md:flex items-center justify-end">
                <h5
                  className={`font-semibold text-[15px] ${
                    tx.type === "received" ? "text-[#00dc3b]" : "text-[#dc0000]"
                  }`}
                >
                  {tx.amount}
                </h5>
              </div>
            </div>
          ))}
        </section>
      </section>

      {/* Detail modal */}
      {showDetails && selectedTx && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[90%] max-w-xl">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-semibold text-lg">{selectedTx.title}</h4>
                <p className="text-sm text-[#595959]">{selectedTx.date}</p>
              </div>
              <button className="text-[#595959]" onClick={closeDetails}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <div className="mt-4">
              <p className="text-xl font-bold">{selectedTx.amount}</p>
              <p className="text-sm text-[#595959] mt-2">
                Category: {selectedTx.category}
              </p>
              <p className="text-sm text-[#595959] mt-2">
                Note: {selectedTx.note || "—"}
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
      {/* Payment Modal for Upcoming Bills */}
      {showPayModal && payTarget && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[90%] max-w-md">
            <div className="flex justify-between items-center">
              <h4 className="font-semibold text-lg">Pay {payTarget.title}</h4>
              <button className="text-[#595959]" onClick={cancelPay}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <div className="mt-4">
              <p className="text-sm text-[#595959]">Amount</p>
              <p className="text-2xl font-bold mb-3">
                ${payTarget.amount.toLocaleString()}
              </p>

              <label className="text-sm">From</label>
              <select
                className="w-full border p-2 rounded mb-3"
                value={payFrom}
                onChange={(e) => setPayFrom(e.target.value)}
              >
                {accountsForPayment.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.label}
                  </option>
                ))}
              </select>

              <label className="text-sm">Memo (optional)</label>
              <input
                className="w-full border p-2 rounded mb-4"
                placeholder="Add a note"
              />

              <div className="flex justify-end gap-3">
                <button
                  className="px-4 py-2 border rounded"
                  onClick={cancelPay}
                  disabled={payLoading}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-[#c64c00] text-white rounded"
                  onClick={confirmPay}
                  disabled={payLoading}
                >
                  {payLoading ? "Processing..." : "Confirm Payment"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Goal Modal */}
      {showAddGoalModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[90%] max-w-md">
            <div className="flex justify-between items-center">
              <h4 className="font-semibold text-lg">Add Savings Goal</h4>
              <button
                className="text-[#595959]"
                onClick={() => setShowAddGoalModal(false)}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <div className="mt-4">
              <label className="text-sm">Goal name</label>
              <input
                className="w-full border p-2 rounded mb-3"
                value={newGoalTitle}
                onChange={(e) => setNewGoalTitle(e.target.value)}
                placeholder="e.g. Vacation"
              />
              <label className="text-sm">Target amount</label>
              <input
                className="w-full border p-2 rounded mb-4"
                value={newGoalTarget}
                onChange={(e) => setNewGoalTarget(e.target.value)}
                placeholder="e.g. 5000"
                inputMode="numeric"
              />

              <div className="flex justify-end gap-3">
                <button
                  className="px-4 py-2 border rounded"
                  onClick={() => setShowAddGoalModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-[#c64c00] text-white rounded"
                  onClick={confirmAddGoal}
                >
                  Create Goal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Funds Modal */}
      {showAddFundsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[90%] max-w-md">
            <div className="flex justify-between items-center">
              <h4 className="font-semibold text-lg">Add Funds</h4>
              <button
                className="text-[#595959]"
                onClick={() => setShowAddFundsModal(false)}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <div className="mt-4">
              <p className="text-sm text-[#595959]">
                Goal: {goals.find((g) => g.id === fundGoalId)?.title || "—"}
              </p>
              <label className="text-sm mt-3">Amount</label>
              <input
                className="w-full border p-2 rounded mb-3"
                value={fundAmount}
                onChange={(e) => setFundAmount(e.target.value)}
                placeholder="e.g. 250"
                inputMode="numeric"
              />

              <label className="text-sm">From</label>
              <select
                className="w-full border p-2 rounded mb-4"
                value={fundFrom}
                onChange={(e) => setFundFrom(e.target.value)}
              >
                {accountsForPayment.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.label}
                  </option>
                ))}
              </select>

              <div className="flex justify-end gap-3">
                <button
                  className="px-4 py-2 border rounded"
                  onClick={() => setShowAddFundsModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-[#c64c00] text-white rounded"
                  onClick={confirmAddFunds}
                >
                  Add Funds
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast pop-out */}
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

      {/* Deposit Modal */}
      {showDepositModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[90%] max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-semibold text-lg">Make a Deposit</h4>
              <button
                className="text-[#595959]"
                onClick={() => {
                  setShowDepositModal(false);
                  setDepositError("");
                }}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div className="mt-4">
              <label className="text-sm">Amount</label>
              <div className="w-full border p-2 rounded mb-3">
                <input
                  className="w-full outline-none"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  placeholder="0.00"
                  type="number"
                  min="0.01"
                  step="0.01"
                />
              </div>

              <label className="text-sm">Memo (optional)</label>
              <div className="w-full border p-2 rounded mb-4">
                <input
                  className="w-full outline-none"
                  value={depositMemo}
                  onChange={(e) => setDepositMemo(e.target.value)}
                  placeholder="Add a note"
                />
              </div>

              {depositError && (
                <div className="text-red-600 text-sm mb-3">{depositError}</div>
              )}

              <div className="flex justify-end gap-3">
                <button
                  className="px-4 py-2 border rounded"
                  onClick={() => {
                    setShowDepositModal(false);
                    setDepositError("");
                  }}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-[#c64c00] text-white rounded"
                  onClick={handleDeposit}
                >
                  Deposit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default Dashboard;
