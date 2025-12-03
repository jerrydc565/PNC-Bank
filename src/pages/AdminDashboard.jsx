import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTransactions: 0,
    activeAccounts: 0,
    pendingTransactions: 0,
  });
  const [users, setUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [pendingTransactions, setPendingTransactions] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [chatQueue, setChatQueue] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [chatMessage, setChatMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [depositUserId, setDepositUserId] = useState("");
  const [depositAmount, setDepositAmount] = useState("");
  const [depositMemo, setDepositMemo] = useState("");
  const [depositError, setDepositError] = useState("");

  useEffect(() => {
    fetchDashboardData();
    fetchChatQueue();

    // Listen for new chat messages
    const handleNewMessage = () => {
      fetchChatQueue();
    };

    window.addEventListener("newChatMessage", handleNewMessage);
    window.addEventListener("storage", handleNewMessage);

    // Poll for updates every 5 seconds
    const interval = setInterval(() => {
      fetchDashboardData();
      fetchChatQueue();
    }, 5000);

    return () => {
      window.removeEventListener("newChatMessage", handleNewMessage);
      window.removeEventListener("storage", handleNewMessage);
      clearInterval(interval);
    };
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("adminToken");

      // Fetch statistics
      const statsRes = await fetch(
        "https://pnc-bank-backend-2.onrender.com/api/admin/stats",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (statsRes.ok) {
        const data = await statsRes.json();
        setStats(data);
      }

      // Fetch users
      const usersRes = await fetch(
        "https://pnc-bank-backend-2.onrender.com/api/admin/users",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (usersRes.ok) {
        const data = await usersRes.json();
        setUsers(data);
      }

      // Fetch pending transactions
      const pendingRes = await fetch(
        "https://pnc-bank-backend-2.onrender.com/api/admin/transactions/pending",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (pendingRes.ok) {
        const data = await pendingRes.json();
        setPendingTransactions(data);
      }

      // Fetch recent transactions
      const recentRes = await fetch(
        "https://pnc-bank-backend-2.onrender.com/api/admin/transactions/recent",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (recentRes.ok) {
        const data = await recentRes.json();
        setRecentTransactions(data);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setLoading(false);
    }
  };

  const fetchChatQueue = () => {
    const queue = JSON.parse(localStorage.getItem("adminChatQueue") || "[]");
    setChatQueue(queue);
  };

  const handleTransactionAction = async (transactionId, action) => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(
        `https://pnc-bank-backend-2.onrender.com/api/admin/transactions/${transactionId}/${action}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        // Refresh data
        fetchDashboardData();

        // Notify user
        const transaction = pendingTransactions.find(
          (t) => t.id === transactionId
        );
        if (transaction) {
          const notification = {
            userId: transaction.userId,
            message: `Your transaction of $${transaction.amount} has been ${
              action === "approve" ? "approved" : "rejected"
            }`,
            timestamp: new Date().toISOString(),
            type: action === "approve" ? "success" : "error",
          };

          // Store notification in localStorage for user
          const userNotifications = JSON.parse(
            localStorage.getItem(`notifications_${transaction.userId}`) || "[]"
          );
          userNotifications.push(notification);
          localStorage.setItem(
            `notifications_${transaction.userId}`,
            JSON.stringify(userNotifications)
          );
        }
      }
    } catch (error) {
      console.error("Error handling transaction:", error);
    }
  };

  const handleSendChatMessage = () => {
    if (!chatMessage.trim() || !selectedChat) return;

    const userId = selectedChat.userId;
    const message = {
      id: Date.now(),
      text: chatMessage,
      sender: "admin",
      timestamp: new Date().toISOString(),
      read: false,
    };

    // Add to user's chat
    const userMessages = JSON.parse(
      localStorage.getItem(`chatMessages_${userId}`) || "[]"
    );
    userMessages.push(message);
    localStorage.setItem(
      `chatMessages_${userId}`,
      JSON.stringify(userMessages)
    );

    // Update chat queue
    const queue = JSON.parse(localStorage.getItem("adminChatQueue") || "[]");
    const chatIndex = queue.findIndex((chat) => chat.userId === userId);
    if (chatIndex !== -1) {
      queue[chatIndex].messages = userMessages;
      queue[chatIndex].unreadCount = 0;
      localStorage.setItem("adminChatQueue", JSON.stringify(queue));
    }

    // Update selected chat
    setSelectedChat({ ...selectedChat, messages: userMessages });
    setChatMessage("");

    // Notify user
    window.dispatchEvent(new Event("chatMessageReceived"));
  };

  const handleDeposit = async () => {
    setDepositError("");
    if (!depositUserId) {
      setDepositError("Please select a user");
      return;
    }
    if (!depositAmount || isNaN(depositAmount) || Number(depositAmount) <= 0) {
      setDepositError("Please enter a valid amount");
      return;
    }

    try {
      const description = `Admin Deposit${
        depositMemo ? " - " + depositMemo : ""
      }`;

      const response = await fetch(
        `https://pnc-bank-backend-2.onrender.com/api/transactions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: parseInt(depositUserId),
            transactionType: "DEPOSIT",
            amount: parseFloat(depositAmount),
            description: description,
          }),
        }
      );

      if (response.ok) {
        // Refresh dashboard data
        fetchDashboardData();

        // Close modal and reset form
        setShowDepositModal(false);
        setDepositUserId("");
        setDepositAmount("");
        setDepositMemo("");

        // Show success message
        alert("Deposit successful!");
      } else {
        const errorText = await response.text();
        console.error("Deposit error:", errorText);
        setDepositError(errorText || "Deposit failed");
      }
    } catch (error) {
      console.error("Deposit exception:", error);
      setDepositError(error.message || "Deposit failed");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminId");
    localStorage.removeItem("adminUsername");
    localStorage.removeItem("isAdmin");
    navigate("/admin/login");
  };

  const StatCard = ({ title, value, icon, color, trend }) => (
    <div
      className="bg-white rounded-lg shadow-md p-4 sm:p-6 border-l-4"
      style={{ borderLeftColor: color }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-xs sm:text-sm font-medium">
            {title}
          </p>
          <p className="text-2xl sm:text-3xl font-bold mt-2">{value}</p>
          {trend && (
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              <span className={trend > 0 ? "text-green-600" : "text-red-600"}>
                <i
                  className={`fas fa-arrow-${trend > 0 ? "up" : "down"} mr-1`}
                ></i>
                {Math.abs(trend)}%
              </span>{" "}
              from last month
            </p>
          )}
        </div>
        <div
          className="w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center shrink-0"
          style={{ backgroundColor: `${color}20` }}
        >
          <i className={`${icon} text-xl sm:text-2xl`} style={{ color }}></i>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-4xl text-[#c64c00] mb-4"></i>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="px-3 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-linear-to-br from-[#c64c00] to-[#a33d00] rounded-lg flex items-center justify-center">
              <i className="fas fa-shield-halved text-white text-base sm:text-lg"></i>
            </div>
            <div>
              <h1 className="text-lg sm:text-2xl font-bold text-gray-800">
                Admin Dashboard
              </h1>
              <p className="text-xs sm:text-sm text-gray-600">
                PNC Bank Administration Panel
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto justify-between sm:justify-end">
            <div className="text-left sm:text-right">
              <p className="text-xs sm:text-sm text-gray-600">Welcome back,</p>
              <p className="font-semibold text-gray-800 text-sm sm:text-base">
                {localStorage.getItem("adminUsername")}
              </p>
            </div>
            <button
              onClick={() => setShowDepositModal(true)}
              className="px-3 sm:px-4 py-1.5 sm:py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 text-sm sm:text-base"
            >
              <i className="fas fa-dollar-sign"></i>
              <span className="hidden sm:inline">Deposit</span>
            </button>
            <button
              onClick={handleLogout}
              className="px-3 sm:px-4 py-1.5 sm:py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 text-sm sm:text-base"
            >
              <i className="fas fa-sign-out-alt"></i>
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200 px-3 sm:px-6 overflow-x-auto">
        <div className="flex gap-1 min-w-max sm:min-w-0">
          {[
            { id: "overview", label: "Overview", icon: "fa-chart-line" },
            {
              id: "transactions",
              label: "Transactions",
              icon: "fa-exchange-alt",
            },
            { id: "users", label: "Users", icon: "fa-users" },
            {
              id: "chat",
              label: "Messages",
              icon: "fa-comments",
              badge: chatQueue.reduce(
                (sum, chat) => sum + (chat.unreadCount || 0),
                0
              ),
              link: "/admin/chat",
            },
          ].map((tab) =>
            tab.link ? (
              <button
                key={tab.id}
                onClick={() => navigate(tab.link)}
                className="px-3 sm:px-6 py-3 font-medium border-b-2 transition-colors relative border-transparent text-gray-600 hover:text-[#c64c00] hover:border-[#c64c00] text-sm sm:text-base"
              >
                <i className={`fas ${tab.icon} mr-1 sm:mr-2`}></i>
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">Msgs</span>
                {tab.badge > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {tab.badge}
                  </span>
                )}
              </button>
            ) : (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 sm:px-6 py-3 font-medium border-b-2 transition-colors relative text-sm sm:text-base ${
                  activeTab === tab.id
                    ? "border-[#c64c00] text-[#c64c00]"
                    : "border-transparent text-gray-600 hover:text-[#c64c00]"
                }`}
              >
                <i className={`fas ${tab.icon} mr-1 sm:mr-2`}></i>
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">
                  {tab.id === "overview"
                    ? "Stats"
                    : tab.id === "transactions"
                    ? "Trans"
                    : "Users"}
                </span>
                {tab.badge > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {tab.badge}
                  </span>
                )}
              </button>
            )
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="p-3 sm:p-6">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Total Users"
                value={stats.totalUsers}
                icon="fas fa-users"
                color="#c64c00"
                trend={12}
              />
              <StatCard
                title="Total Transactions"
                value={stats.totalTransactions}
                icon="fas fa-exchange-alt"
                color="#0051ff"
                trend={8}
              />
              <StatCard
                title="Active Accounts"
                value={stats.activeAccounts}
                icon="fas fa-check-circle"
                color="#00b300"
                trend={5}
              />
              <StatCard
                title="Pending Transactions"
                value={stats.pendingTransactions}
                icon="fas fa-clock"
                color="#ff8800"
                trend={-3}
              />
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Transactions */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <i className="fas fa-history text-[#c64c00]"></i>
                  Recent Transactions
                </h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {recentTransactions.slice(0, 10).map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            transaction.transactionType === "DEPOSIT"
                              ? "bg-green-100"
                              : transaction.transactionType === "WITHDRAW"
                              ? "bg-red-100"
                              : "bg-blue-100"
                          }`}
                        >
                          <i
                            className={`fas ${
                              transaction.transactionType === "DEPOSIT"
                                ? "fa-arrow-down text-green-600"
                                : transaction.transactionType === "WITHDRAW"
                                ? "fa-arrow-up text-red-600"
                                : "fa-exchange-alt text-blue-600"
                            }`}
                          ></i>
                        </div>
                        <div>
                          <p className="font-medium text-sm">
                            {transaction.description}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(
                              transaction.timestamp
                            ).toLocaleDateString()}{" "}
                            • User ID: {transaction.userId}
                          </p>
                        </div>
                      </div>
                      <p
                        className={`font-semibold ${
                          transaction.transactionType === "DEPOSIT"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {transaction.transactionType === "DEPOSIT" ? "+" : "-"}$
                        {transaction.amount.toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pending Approvals */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <i className="fas fa-clock text-orange-600"></i>
                  Pending Approvals
                </h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {pendingTransactions.length === 0 ? (
                    <p className="text-gray-500 text-sm text-center py-8">
                      No pending transactions
                    </p>
                  ) : (
                    pendingTransactions.map((transaction) => (
                      <div
                        key={transaction.id}
                        className="p-4 bg-orange-50 rounded-lg border border-orange-200"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <p className="font-medium">
                              {transaction.description}
                            </p>
                            <p className="text-sm text-gray-600">
                              User ID: {transaction.userId}
                            </p>
                            <p className="text-sm text-gray-500">
                              {new Date(transaction.timestamp).toLocaleString()}
                            </p>
                          </div>
                          <p className="text-xl font-bold text-orange-600">
                            ${transaction.amount.toFixed(2)}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              handleTransactionAction(transaction.id, "approve")
                            }
                            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                          >
                            <i className="fas fa-check mr-2"></i>
                            Approve
                          </button>
                          <button
                            onClick={() =>
                              handleTransactionAction(transaction.id, "reject")
                            }
                            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                          >
                            <i className="fas fa-times mr-2"></i>
                            Reject
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Transactions Tab */}
        {activeTab === "transactions" && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4">All Transactions</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      ID
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      User
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Type
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Amount
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Description
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {recentTransactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm">{transaction.id}</td>
                      <td className="px-4 py-3 text-sm">
                        {transaction.userId}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            transaction.transactionType === "DEPOSIT"
                              ? "bg-green-100 text-green-800"
                              : transaction.transactionType === "WITHDRAW"
                              ? "bg-red-100 text-red-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {transaction.transactionType}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold">
                        ${transaction.amount.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {transaction.description}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {new Date(transaction.timestamp).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            transaction.status === "APPROVED"
                              ? "bg-green-100 text-green-800"
                              : transaction.status === "PENDING"
                              ? "bg-orange-100 text-orange-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {transaction.status || "APPROVED"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4">User Management</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      ID
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Name
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Email
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Balance
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm">{user.id}</td>
                      <td className="px-4 py-3 text-sm font-medium">
                        {user.firstName} {user.secondName}
                      </td>
                      <td className="px-4 py-3 text-sm">{user.email}</td>
                      <td className="px-4 py-3 text-sm font-semibold">
                        ${user.balance?.toFixed(2) || "0.00"}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Active
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex gap-2">
                          <button className="text-[#c64c00] hover:text-[#a33d00] font-medium">
                            <i className="fas fa-eye mr-1"></i>
                            View
                          </button>
                          <button
                            onClick={() => {
                              setDepositUserId(user.id);
                              setShowDepositModal(true);
                            }}
                            className="text-green-600 hover:text-green-700 font-medium"
                          >
                            <i className="fas fa-dollar-sign mr-1"></i>
                            Deposit
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Chat Tab */}
        {activeTab === "chat" && (
          <div className="grid grid-cols-3 gap-6 h-[calc(100vh-250px)]">
            {/* Chat List */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-linear-to-r from-[#c64c00] to-[#a33d00] text-white p-4">
                <h3 className="font-semibold text-lg">User Messages</h3>
                <p className="text-sm text-white/80">
                  Click to view conversation
                </p>
              </div>
              <div className="overflow-y-auto h-[calc(100%-80px)]">
                {chatQueue.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <i className="fas fa-inbox text-4xl mb-3 text-gray-300"></i>
                    <p>No messages yet</p>
                  </div>
                ) : (
                  chatQueue.map((chat) => (
                    <div
                      key={chat.userId}
                      onClick={() => setSelectedChat(chat)}
                      className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors ${
                        selectedChat?.userId === chat.userId
                          ? "bg-orange-50"
                          : ""
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-semibold text-sm">{chat.userName}</p>
                        {chat.unreadCount > 0 && (
                          <span className="bg-red-600 text-white text-xs rounded-full px-2 py-1">
                            {chat.unreadCount}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-600 truncate">
                        {chat.lastMessage}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(chat.lastMessageTime).toLocaleString()}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Chat Window */}
            <div className="col-span-2 bg-white rounded-lg shadow-md flex flex-col">
              {selectedChat ? (
                <>
                  <div className="bg-linear-to-r from-[#c64c00] to-[#a33d00] text-white p-4">
                    <h3 className="font-semibold text-lg">
                      {selectedChat.userName}
                    </h3>
                    <p className="text-sm text-white/80">
                      {selectedChat.userEmail}
                    </p>
                  </div>

                  <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                    {selectedChat.messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.sender === "user"
                            ? "justify-start"
                            : "justify-end"
                        }`}
                      >
                        <div
                          className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                            message.sender === "user"
                              ? "bg-white text-gray-800 rounded-bl-none shadow-sm"
                              : "bg-[#c64c00] text-white rounded-br-none"
                          }`}
                        >
                          <p className="text-sm">{message.text}</p>
                          <p
                            className={`text-xs mt-1 ${
                              message.sender === "user"
                                ? "text-gray-500"
                                : "text-white/70"
                            }`}
                          >
                            {new Date(message.timestamp).toLocaleTimeString(
                              [],
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 border-t border-gray-200">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={chatMessage}
                        onChange={(e) => setChatMessage(e.target.value)}
                        onKeyPress={(e) =>
                          e.key === "Enter" && handleSendChatMessage()
                        }
                        placeholder="Type your reply..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-[#c64c00] focus:ring-1 focus:ring-[#c64c00]"
                      />
                      <button
                        onClick={handleSendChatMessage}
                        disabled={!chatMessage.trim()}
                        className="px-6 py-2 bg-[#c64c00] text-white rounded-full hover:bg-[#a33d00] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <i className="fas fa-paper-plane"></i>
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <i className="fas fa-comments text-6xl mb-4 text-gray-300"></i>
                    <p>Select a conversation to start chatting</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Deposit Modal */}
      {showDepositModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[90%] max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-semibold text-lg">Deposit to User Account</h4>
              <button
                className="text-[#595959]"
                onClick={() => {
                  setShowDepositModal(false);
                  setDepositError("");
                  setDepositUserId("");
                  setDepositAmount("");
                  setDepositMemo("");
                }}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div className="mt-4">
              <label className="text-sm font-medium">Select User</label>
              <select
                className="w-full border p-2 rounded mb-3 mt-1"
                value={depositUserId}
                onChange={(e) => setDepositUserId(e.target.value)}
              >
                <option value="">-- Select User --</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.firstName} {user.secondName} ({user.email})
                  </option>
                ))}
              </select>

              <label className="text-sm font-medium">Amount</label>
              <div className="w-full border p-2 rounded mb-3 mt-1">
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

              <label className="text-sm font-medium">Memo (optional)</label>
              <div className="w-full border p-2 rounded mb-4 mt-1">
                <input
                  className="w-full outline-none"
                  value={depositMemo}
                  onChange={(e) => setDepositMemo(e.target.value)}
                  placeholder="Add a note"
                />
              </div>

              {depositError && (
                <div className="text-red-600 text-sm mb-3 bg-red-50 p-2 rounded">
                  {depositError}
                </div>
              )}

              <div className="flex justify-end gap-3">
                <button
                  className="px-4 py-2 border rounded hover:bg-gray-50"
                  onClick={() => {
                    setShowDepositModal(false);
                    setDepositError("");
                    setDepositUserId("");
                    setDepositAmount("");
                    setDepositMemo("");
                  }}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  onClick={handleDeposit}
                >
                  <i className="fas fa-dollar-sign mr-2"></i>
                  Deposit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
