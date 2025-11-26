import React from "react";
import Logo from "../assets/image/image.png";
import { Link } from "react-router-dom";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import view from "../assets/image/view.png";
import hide from "../assets/image/hide.png";
function Dashboard() {
  const navigate = useNavigate();

  // ✅ NEW: Fetch user profile from backend
  const [userProfile, setUserProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedTx, setSelectedTx] = useState(null);
  const [hideValue, setHideValue] = useState("Show");
  const [hideValue2, setHideValue2] = useState("Show");
  const [hideValue3, setHideValue3] = useState("Show");
  const [transactions] = useState([
    {
      id: "t1",
      title: "Jason Walker",
      date: "22 Jun 2025, 09:15 AM",
      amount: "+$513.00",
      amountValue: 513.0,
      type: "received",
      category: "Received",
      icon: "fa-solid fa-user",
      note: "Salary reimbursement",
      ts: new Date("2025-06-22T09:15:00"),
    },
    {
      id: "t2",
      title: "Netflix",
      date: "20 Jun 2025, 12:15 PM",
      amount: "-$50.00",
      amountValue: -50.0,
      type: "subscription",
      category: "Subscription",
      icon: "fa-solid fa-clapperboard",
      note: "Monthly plan",
      ts: new Date("2025-06-20T12:15:00"),
    },
    {
      id: "t3",
      title: "Sandra Micheal",
      date: "17 Jun 2025, 09:15 AM",
      amount: "+$1,000.00",
      amountValue: 1000.0,
      type: "received",
      category: "Received",
      icon: "fa-solid fa-user",
      note: "Invoice payment",
      ts: new Date("2025-06-17T09:15:00"),
    },
    {
      id: "t4",
      title: "Sandra Micheal",
      date: "16 Jun 2025, 01:15 PM",
      amount: "-$1,000.00",
      amountValue: -1000.0,
      type: "debit",
      category: "Debit",
      icon: "fa-solid fa-user",
      note: "Refund",
      ts: new Date("2025-06-16T13:15:00"),
    },
    {
      id: "t5",
      title: "Uber",
      date: "10 Jun 2025, 08:15 AM",
      amount: "-$24.34",
      amountValue: -24.34,
      type: "debit",
      category: "Debit",
      icon: "fa-solid fa-taxi",
      note: "Ride",
      ts: new Date("2025-06-10T08:15:00"),
    },
    {
      id: "t6",
      title: "Whole Foods",
      date: "6 Jun 2025, 09:15 AM",
      amount: "-$313.00",
      amountValue: -313.0,
      type: "debit",
      category: "Debit",
      icon: "fa-solid fa-basket-shopping",
      note: "Groceries",
      ts: new Date("2025-06-06T09:15:00"),
    },
  ]);
  const filteredTransactions = useMemo(() => {
    let list = transactions.slice();
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
    // sort
    if (sortBy === "newest") {
      list.sort((a, b) => b.ts - a.ts);
    } else if (sortBy === "oldest") {
      list.sort((a, b) => a.ts - b.ts);
    } else if (sortBy === "amountDesc") {
      list.sort((a, b) => b.amountValue - a.amountValue);
    } else if (sortBy === "amountAsc") {
      list.sort((a, b) => a.amountValue - b.amountValue);
    }
    return list;
  }, [transactions, search, filterType, sortBy]);
  const [bills, setBills] = useState([
    {
      id: "b1",
      title: "Rent Payment",
      dueIn: 2,
      dueDate: "In 2 days",
      amount: 1345.0,
      paid: false,
    },
    {
      id: "b2",
      title: "Electric Bill",
      dueIn: 5,
      dueDate: "In 5 days",
      amount: 95.72,
      paid: false,
    },
    {
      id: "b3",
      title: "Credit Card Payment",
      dueIn: 8,
      dueDate: "In 8 days",
      amount: 345.0,
      paid: false,
    },
  ]);
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
  const [goals, setGoals] = useState([
    { id: "g1", title: "Vacation Fund", saved: 3250, target: 5000 },
    { id: "g2", title: "New Car", saved: 5000, target: 20000 },
    { id: "g3", title: "Emergency Fund", saved: 8000, target: 10000 },
  ]);

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

        const response = await fetch(`http://localhost:8080/api/user/${email}`);
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
    { id: "checking", label: "Premium Checking (****4832) - $5,289" },
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

  const confirmAddFunds = () => {
    const amt = Number(fundAmount);
    if (!fundGoalId) return showToast("No goal selected");
    if (!amt || isNaN(amt) || amt <= 0)
      return showToast("Enter a valid amount");
    addToGoal(fundGoalId, amt);
    setShowAddFundsModal(false);
    setFundAmount("");
    setFundGoalId(null);
    setFundFrom("checking");
    showToast("Amount added to goal");
  };

  return (
    <main className="bg-[#f3f3f3] pb-20">
      <section className="flex justify-between px-10 p-5">
        <div>
          <h2 className="font-bold text-2xl">Welcome back, {firstName}!</h2>
          <p className="text-[14px] text-[#595959]">
            Last login: Today, 10:32 AM
          </p>
          {userProfile && (
            <p className="text-[12px] text-[#888]">
              User ID: #{userProfile.userId}
            </p>
          )}
        </div>
      </section>

      <section className="flex gap-8 px-10">
        <section className="bg-white rounded-lg shadow p-10 w-[70%] flex flex-col gap-6  ">
          <div className="flex justify-between items-center ">
            <h3 className="font-semibold text-lg"> Your Accounts </h3>
            <Link to={"/account"}>
              <h4 className="text-[14px] hover:text-[#b14400] font-medium text-[#c64c00] ">
                View All <i className="fa-solid fa-angle-right text-lg"></i>
              </h4>
            </Link>
          </div>
          <div className="bg-[#c78100] w-full rounded-lg p-5 ">
            <p className="text-[10px] text-[#ffffff]">Checking Account</p>
            <p className="text-xl font-semibold text-white  ">
              Premium Checking
            </p>
            <p className="text-l text-[#ffffff] mb-3">****4832</p>
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
              $5,289.00
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
              $5,289.00
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

          <div className="bg-[#008504] w-full rounded-lg p-5 ">
            <p className="text-[10px] text-[#ffffff]">Saving Account</p>
            <p className="text-xl font-semibold text-white ">
              High-Yield Savings
            </p>
            <p className="text-l text-[#ffffff] mb-3">****7232</p>
            <p className="flex items-center justify-between text-[10px] text-[#ffffff]  ">
              Current Balance{" "}
              <span onClick={handleChange2}>
                <img
                  src={view}
                  alt=""
                  className={` w-5  ${
                    hideValue2 == "Hide" ? "hidden" : "block"
                  }`}
                />
                <img
                  src={hide}
                  alt=""
                  className={` w-5  ${
                    hideValue2 == "Hide" ? "block" : "hidden"
                  }`}
                />
              </span>
            </p>
            <p
              className={`text-xl font-bold text-white mb-3 ${
                hideValue2 == "Hide" ? "hidden" : "block"
              } `}
            >
              $15,289.00
            </p>
            <p
              className={`text-xl font-bold text-white mb-3 ${
                hideValue2 == "Hide" ? "block" : "hidden"
              } `}
            >
              {" "}
              ••••••
            </p>

            <p className="text-[10px] text-[#ffffff]">Available Balance</p>
            <p
              className={`text-l font-semibold text-white mb-5  ${
                hideValue2 == "Hide" ? "hidden" : "block"
              } `}
            >
              $15,289.00
            </p>
            <p
              className={`text-l font-semibold text-white mb-5  ${
                hideValue2 == "Hide" ? "block" : "hidden"
              } `}
            >
              {" "}
              ••••••
            </p>

            <Link to={"/saving-details"}>
              {" "}
              <p className="text-[14px]  text-white text-right">
                View details <i className="fa-solid fa-angle-right "></i>
              </p>
            </Link>
          </div>
          <div className="bg-[#660085] w-full rounded-lg p-5 ">
            <p className="text-[10px] text-[#ffffff]">Credit Card</p>
            <p className="text-xl font-semibold text-white ">
              Platinum Rewards
            </p>
            <p className="text-l text-[#ffffff] mb-3">****3214</p>
            <p className="flex items-center justify-between text-[10px] text-[#ffffff]  ">
              Current Balance{" "}
              <span onClick={handleChange3}>
                <img
                  src={view}
                  alt=""
                  className={` w-5  ${
                    hideValue3 == "Hide" ? "hidden" : "block"
                  }`}
                />
                <img
                  src={hide}
                  alt=""
                  className={` w-5  ${
                    hideValue3 == "Hide" ? "block" : "hidden"
                  }`}
                />
              </span>
            </p>
            <p
              className={`text-xl font-bold text-white mb-3 ${
                hideValue3 == "Hide" ? "hidden" : "block"
              } `}
            >
              $1,289.00
            </p>
            <p
              className={`text-xl font-bold text-white mb-3 ${
                hideValue3 == "Hide" ? "block" : "hidden"
              } `}
            >
              {" "}
              ••••••
            </p>

            <p className="text-[10px] text-[#ffffff]">Available Balance</p>
            <p
              className={`text-l font-semibold text-white mb-5  ${
                hideValue3 == "Hide" ? "hidden" : "block"
              } `}
            >
              $8,289.00
            </p>
            <p
              className={`text-l font-semibold text-white mb-5  ${
                hideValue3 == "Hide" ? "block" : "hidden"
              } `}
            >
              {" "}
              ••••••
            </p>
            <div className="w-full rounded-2xl  bg-[#ffffff2c] mb-5  ">
              <div className="rounded p-1 bg-white w-[20%]"></div>
            </div>
            <Link to={"/credit-details"}>
              {" "}
              <p className="text-[14px]  text-white text-right">
                View details <i className="fa-solid fa-angle-right "></i>
              </p>
            </Link>
          </div>
        </section>
        <section className="w-[30%] flex flex-col gap-7 ">
          <div className="p-5 bg-white rounded-lg shadow grid grid-cols-3 gap-4 ">
            <Link to={"/payment"}>
              {" "}
              <section className="w-full p-4 flex flex-col items-center justify-center rounded-lg hover:bg-[#bababa73] cursor-pointer">
                <button className="w-11 cursor-pointer h-11 rounded-full bg-[#0022ff43] mb-2">
                  <i className="fa-solid fa-arrow-right-arrow-left text-xl text-[#0022ff]"></i>
                </button>
                <p className="text-[10px] text-[#595959]">Transfer</p>
              </section>
            </Link>

            <Link to={"/payment"}>
              {" "}
              <section className="w-full p-4 flex flex-col items-center justify-center rounded-lg hover:bg-[#bababa73] cursor-pointer">
                <button className="w-11 cursor-pointer h-11 rounded-full bg-[#7700ff43] mb-2">
                  {" "}
                  <i className="fa-regular fa-credit-card text-xl text-[#7700ff]"></i>
                </button>
                <p className="text-[10px] text-[#595959]">Pay cards</p>
              </section>
            </Link>
            <Link to={"/payment"}>
              <section className="w-full p-4 flex flex-col items-center justify-center rounded-lg hover:bg-[#bababa73] cursor-pointer">
                <button className="w-11 cursor-pointer h-11 rounded-full bg-[#ffc40043] mb-2">
                  {" "}
                  <i className="fa-regular fa-file text-xl text-[#ffc400]"></i>
                </button>
                <p className="text-[10px] text-[#595959]">Pay bills</p>
              </section>
            </Link>

            <Link to={"/account"}>
              <section className="w-full p-4 flex flex-col items-center justify-center rounded-lg hover:bg-[#bababa73] cursor-pointer">
                <button className="w-11 cursor-pointer h-11 rounded-full bg-[#04ff0043] mb-2">
                  {" "}
                  <i className="fa-solid fa-dollar-sign text-xl text-[#04ff00]"></i>
                </button>
                <p className="text-[10px] text-[#595959]">Deposit</p>
              </section>
            </Link>
            <Link to={"/account"}>
              <section className="w-full p-4 flex flex-col items-center justify-center rounded-lg hover:bg-[#bababa73] cursor-pointer">
                <button className="w-11 cursor-pointer h-11 rounded-full bg-[#ff000043] mb-2">
                  {" "}
                  <i className="fa-solid fa-piggy-bank text-xl text-[#ff0000]"></i>
                </button>
                <p className="text-[10px] text-[#595959]">Savings</p>
              </section>
            </Link>
            <Link to={"/card"}>
              {" "}
              <section className="w-full p-4 flex flex-col items-center justify-center rounded-lg hover:bg-[#bababa73] cursor-pointer">
                <button className="w-11 cursor-pointer h-11 rounded-full bg-[#0022ff43] mb-2">
                  {" "}
                  <i className="fa-solid fa-gift text-xl text-[#0022ff]"></i>
                </button>
                <p className="text-[10px] text-[#595959]">Rewards</p>
              </section>
            </Link>
          </div>
          <div className="p-5 bg-white rounded-lg shadow grid grid-cols-1 gap-4">
            <section className="flex justify-between items-center">
              <h3 className="font-semibold text-lg">Upcoming Bills</h3>
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
                className={`flex p-3 rounded-lg items-center justify-between ${
                  b.paid
                    ? "bg-[#e6ffe6]"
                    : b.dueIn <= 2
                    ? "bg-[#ffefef]"
                    : "bg-[#f5f5f5]"
                }`}
              >
                <div className="flex gap-3 items-center">
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
          <div className="p-5 bg-white rounded-lg shadow grid grid-cols-1 gap-4 ">
            <section className="flex justify-between items-center">
              <h4 className="font-semibold text-l ">Savings Goals</h4>
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
      <section className="bg-white rounded-lg shadow pb-4  w-[65%] m-10">
        <div className="flex justify-between pb-5 p-10 border-b border-[#ececec]">
          <h3 className="font-semibold text-lg">Recent Transactions</h3>
          <div className="flex items-center gap-3 relative">
            <button
              className="p-1 px-4 rounded-lg bg-[#ffffff] border border-[#e3e3e3] flex items-center gap-2"
              onClick={() => setShowFilters((s) => !s)}
              aria-expanded={showFilters}
              aria-controls="tx-filters"
            >
              <i className="fa-solid fa-filter"></i>
              <span className="capitalize">filter</span>
            </button>
            <Link to={"/transaction"}>
              <h4 className="font-medium text-l text-[#c64c00] hover:text-[#833200]">
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

        <section className="flex flex-col gap-2">
          {filteredTransactions.length === 0 && (
            <div className="p-4 text-center text-sm text-[#595959]">
              No transactions found
            </div>
          )}
          {filteredTransactions.map((tx) => (
            <div
              key={tx.id}
              className="p-2 px-3 border-t border-[#ececec] flex items-center justify-between cursor-pointer hover:bg-[#fafafa]"
              onClick={() => openDetails(tx)}
            >
              <div className="flex  gap-3 items-center">
                <button
                  className={`w-9 h-9 rounded-full p-1 ${
                    tx.type === "received"
                      ? "bg-[#0064de44]"
                      : tx.type === "subscription"
                      ? "bg-[#dc00004a]"
                      : "bg-[#0064de44]"
                  }`}
                >
                  {tx.icon && <i className={tx.icon}></i>}
                </button>
                <section className="flex flex-col gap-1 ">
                  <h5 className="font-semibold text-[15px] ">{tx.title}</h5>
                  <p className="text-[#595959] text-[11px]">{tx.date}</p>
                </section>
              </div>
              <div className="flex flex-col gap-1 items-center">
                <h5
                  className={`font-semibold text-[15px] ${
                    tx.type === "received" ? "text-[#00dc3b]" : "text-[#dc0000]"
                  }`}
                >
                  {tx.amount}
                </h5>
                <p className="text-[#595959] text-[11px]">{tx.category}</p>
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
    </main>
  );
}

export default Dashboard;
