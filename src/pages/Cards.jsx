import React, { useState, useEffect } from "react";

function Cards() {
  const [tab, setTab] = useState("Physical");
  const [userProfile, setUserProfile] = useState(null);

  const firstName =
    userProfile?.firstName || localStorage.getItem("firstName") || "User";
  const secondName =
    userProfile?.secondName || localStorage.getItem("secondName") || "User";
  const fullName = `${firstName} ${secondName}`;

  // ✅ Fetch user profile from backend on mount
  useEffect(() => {
    const email = localStorage.getItem("email");
    if (!email) return;

    const fetchUserProfile = async () => {
      try {
        const response = await fetch(`https://pnc-bank-backend-2.onrender.com/api/user/${email}`);
        const data = await response.json();
        if (data.success) {
          setUserProfile(data);
        }
      } catch (error) {
        console.error("Error fetching user profile in Cards:", error);
      }
    };

    fetchUserProfile();
  }, []);

  // Initialize cards from localStorage per user
  const [cards, setCards] = useState(() => {
    const userId = localStorage.getItem("userId");
    const savedCards = localStorage.getItem(`cards_${userId}`);
    return savedCards ? JSON.parse(savedCards) : [];
  });

  // Save cards to localStorage whenever they change
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      localStorage.setItem(`cards_${userId}`, JSON.stringify(cards));
    }
  }, [cards]);

  // apply modal
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applyType, setApplyType] = useState("credit");
  const [applyName, setApplyName] = useState("");
  const [applyDesign, setApplyDesign] = useState("default");
  const [applyLoading, setApplyLoading] = useState(false);

  // settings modal
  const [showSettings, setShowSettings] = useState(false);
  const [settingsCard, setSettingsCard] = useState(null);

  // toast
  const [toast, setToast] = useState({ text: "", visible: false });
  const showToast = (text, duration = 2000) => {
    setToast({ text, visible: true });
    setTimeout(() => setToast({ text: "", visible: false }), duration);
  };

  const toggleLock = (id) => {
    setCards((s) =>
      s.map((c) => (c.id === id ? { ...c, locked: !c.locked } : c))
    );
    showToast("Card lock toggled");
  };

  const reportLost = (id) => {
    setCards((s) => s.map((c) => (c.id === id ? { ...c, reported: true } : c)));
    showToast("Card reported lost");
  };

  const openSettings = (card) => {
    setSettingsCard(card);
    setShowSettings(true);
  };

  const saveSettings = (changes) => {
    setCards((s) =>
      s.map((c) => (c.id === settingsCard.id ? { ...c, ...changes } : c))
    );
    setShowSettings(false);
    setSettingsCard(null);
    showToast("Settings saved");
  };

  const confirmApply = () => {
    if (!applyName || applyName.trim() === "")
      return showToast("Please provide a card name");

    setApplyLoading(true);

    // Simulate application processing
    setTimeout(() => {
      const id = `c${Date.now()}`;
      const lastFour = Math.floor(1000 + Math.random() * 9000);
      const newCard = {
        id,
        kind: applyType,
        title: applyName.trim(),
        number: `•••• •••• •••• ${lastFour}`,
        current: 0,
        available: applyType === "credit" ? 5000 : 0,
        locked: false,
        reported: false,
        design: applyDesign,
        appliedDate: new Date().toISOString(),
      };
      setCards((s) => [...s, newCard]);
      setShowApplyModal(false);
      setApplyName("");
      setApplyType("credit");
      setApplyDesign("default");
      setApplyLoading(false);
      showToast("Card application approved! Your card has been added.");
    }, 1500);
  };

  return (
    <>
      <main className="bg-[#ececec] p-5">
        <section className="py-10">
          <h3 className="font-bold text-2xl"> Payment & Transfers</h3>
          <p className="text-[15px] text-[#595959] mt-1">
            Send money, pay bills, and manage scheduled payments
          </p>
        </section>
        <section className=" ">
          <section className="w-full bg-white rounded-lg shadow p-5 ">
            <header className=" pt-3 px-3 border-b border-[#acacac]">
              <ul className="flex gap-6">
                {[
                  { key: "Physical", label: "Physical Cards" },
                  { key: "Visual", label: "Visual Cards" },
                  { key: "Rewards", label: "Rewards" },
                ].map((t) => (
                  <li
                    key={t.key}
                    className={`font-semibold pb-3 cursor-pointer transition-colors ${
                      tab === t.key
                        ? "text-[#c64c00] border-b-2 border-[#c64c00]"
                        : "hover:text-[#c64c00] border-b-2 border-transparent hover:border-[#c64c00]"
                    }`}
                    onClick={() => setTab(t.key)}
                  >
                    {t.label}
                  </li>
                ))}
              </ul>
            </header>
            <section className="flex gap-5">
              {tab === "Physical" && (
                <>
                  {cards.length === 0 ? (
                    // No cards - show empty state
                    <section className="w-full m-5 p-10 bg-white rounded-lg border-dotted border-2 border-[#c0c0c0] flex items-center justify-center">
                      <div className="text-center max-w-md">
                        <div className="w-20 h-20 rounded-full p-5 bg-[#f5f5f5] mb-4 mx-auto flex items-center justify-center">
                          <i className="fa-regular fa-credit-card text-4xl text-[#c64c00]"></i>
                        </div>
                        <h4 className="font-bold text-2xl mb-3">
                          No Cards Yet
                        </h4>
                        <p className="text-[15px] text-[#595959] mb-6">
                          You don't have any credit or debit cards. Apply for a
                          card to start earning rewards and managing your
                          finances.
                        </p>
                        <button
                          className="px-8 py-3 rounded-lg text-white bg-[#c64c00] hover:bg-[#a03f00] transition-colors font-semibold"
                          onClick={() => setShowApplyModal(true)}
                        >
                          Apply for Your First Card
                        </button>
                      </div>
                    </section>
                  ) : (
                    // Has cards - show card list and add new option
                    <>
                      <section className="w-[70%] flex flex-col gap-5">
                        {cards.map((card) => {
                          const bgClass =
                            card.design === "sunset"
                              ? "bg-linear-to-r from-orange-400 to-pink-500"
                              : card.design === "ocean"
                              ? "bg-linear-to-r from-blue-400 to-cyan-500"
                              : card.design === "mono"
                              ? "bg-[#111]"
                              : "bg-[#6600cb]";

                          return (
                            <div
                              key={card.id}
                              className="rounded-lg overflow-hidden mt-5 border border-[#b1b1b1] bg-white"
                            >
                              <div className={`p-5 ${bgClass}`}>
                                <div className="flex justify-between items-center mb-6">
                                  <span>
                                    <p className="font-medium text-[#e4e4e4] mb-1 text-[14px]">
                                      {card.kind === "credit"
                                        ? "Credit Card"
                                        : "Debit Card"}
                                    </p>
                                    <h3 className="font-semibold text-xl text-white">
                                      {card.title}
                                    </h3>
                                  </span>
                                  <button
                                    className="h-10 w-10 p-2 rounded-full bg-[#ffffff22] hover:bg-[#ffffff33] transition-colors"
                                    onClick={() => openSettings(card)}
                                  >
                                    <i className="fa-solid fa-ellipsis-vertical text-white"></i>
                                  </button>
                                </div>
                                <div className="flex flex-col gap-2 mb-3">
                                  <p className="font-medium text-[#e4e4e4] text-[14px]">
                                    Card Number
                                  </p>
                                  <h3 className="font-semibold text-xl text-white">
                                    {card.number}
                                  </h3>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span>
                                    <p className="font-medium mb-1 text-[#cdcdcd] text-[14px]">
                                      VALID THRU
                                    </p>
                                    <h4 className="text-lg text-white font-medium">
                                      {new Date(
                                        new Date(card.appliedDate).setFullYear(
                                          new Date(
                                            card.appliedDate
                                          ).getFullYear() + 3
                                        )
                                      ).getMonth() + 1}
                                      /
                                      {new Date(
                                        new Date(card.appliedDate).setFullYear(
                                          new Date(
                                            card.appliedDate
                                          ).getFullYear() + 3
                                        )
                                      )
                                        .getFullYear()
                                        .toString()
                                        .slice(2)}
                                    </h4>
                                  </span>
                                  <span>
                                    <p className="font-medium mb-1 text-[#cdcdcd] text-[14px]">
                                      CVV
                                    </p>
                                    <h4 className="text-lg text-white font-medium">
                                      •••
                                    </h4>
                                  </span>
                                  <span>
                                    <p className="font-medium mb-1 text-[#cdcdcd] text-[14px]">
                                      CARDHOLDER
                                    </p>
                                    <h4 className="text-lg text-white font-medium uppercase">
                                      {fullName}
                                    </h4>
                                  </span>
                                </div>
                              </div>
                              <div className="bg-white p-5">
                                <div className="flex mb-4 items-center justify-between">
                                  {card.kind === "credit" ? (
                                    <>
                                      <span>
                                        <p className="text-[#595959] mb-1 text-[14px]">
                                          Current Balance
                                        </p>
                                        <h4 className="font-semibold text-xl text-black">
                                          $
                                          {card.current.toLocaleString(
                                            "en-US",
                                            {
                                              minimumFractionDigits: 2,
                                              maximumFractionDigits: 2,
                                            }
                                          )}
                                        </h4>
                                      </span>
                                      <span>
                                        <p className="text-[#595959] mb-1 text-[14px]">
                                          Available Credit
                                        </p>
                                        <h4 className="font-semibold text-xl text-[#00a651]">
                                          $
                                          {card.available.toLocaleString(
                                            "en-US",
                                            {
                                              minimumFractionDigits: 2,
                                              maximumFractionDigits: 2,
                                            }
                                          )}
                                        </h4>
                                      </span>
                                    </>
                                  ) : (
                                    <span>
                                      <p className="text-[#595959] mb-1 text-[14px]">
                                        Card Status
                                      </p>
                                      <h4 className="font-semibold text-lg text-[#00a651]">
                                        Active
                                      </h4>
                                    </span>
                                  )}
                                </div>
                                {card.reported && (
                                  <div className="mb-3 p-3 bg-[#fff3cd] border border-[#ffc107] rounded-lg">
                                    <p className="text-sm text-[#856404]">
                                      <i className="fa-solid fa-triangle-exclamation mr-2"></i>
                                      This card has been reported lost/stolen
                                      and is disabled.
                                    </p>
                                  </div>
                                )}
                                <div className="flex gap-3 flex-wrap">
                                  <button
                                    className={`p-2 px-6 rounded-lg ${
                                      card.locked
                                        ? "bg-[#ffc107] hover:bg-[#e0a800]"
                                        : "bg-[#bababa] hover:bg-[#a0a0a0]"
                                    } transition-colors font-medium`}
                                    onClick={() => toggleLock(card.id)}
                                    disabled={card.reported}
                                  >
                                    <i
                                      className={`fa-solid ${
                                        card.locked ? "fa-lock-open" : "fa-lock"
                                      } mr-2`}
                                    ></i>
                                    {card.locked ? "Unlock Card" : "Lock Card"}
                                  </button>
                                  <button
                                    className="p-2 px-6 rounded-lg bg-[#dc3545] hover:bg-[#c82333] text-white transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                    onClick={() => reportLost(card.id)}
                                    disabled={card.reported}
                                  >
                                    <i className="fa-solid fa-exclamation-triangle mr-2"></i>
                                    Report Lost
                                  </button>
                                  <button
                                    className="p-2 px-6 rounded-lg bg-[#6c757d] hover:bg-[#5a6268] text-white transition-colors font-medium"
                                    onClick={() => openSettings(card)}
                                  >
                                    <i className="fa-solid fa-gear mr-2"></i>
                                    Settings
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </section>

                      <section className="w-[30%] m-5 p-5 bg-white rounded-lg border-dotted border-2 border-[#c0c0c0] flex items-center justify-center self-start">
                        <div className="text-center">
                          <button className="w-12 h-12 rounded-full p-2 bg-[#f5f5f5] hover:bg-[#e0e0e0] transition-colors mb-3 mx-auto">
                            <i className="fa-solid fa-plus text-[#c64c00]"></i>
                          </button>
                          <h4 className="font-semibold text-lg mb-2">
                            Add Another Card
                          </h4>
                          <p className="text-[13px] text-[#595959] mb-4">
                            Apply for a new credit or debit card
                          </p>
                          <button
                            className="px-6 py-2 rounded-lg text-white bg-[#c64c00] hover:bg-[#a03f00] transition-colors font-medium"
                            onClick={() => setShowApplyModal(true)}
                          >
                            Apply Now
                          </button>
                        </div>
                      </section>
                    </>
                  )}
                </>
              )}

              {tab === "Visual" && (
                <section className="w-full mt-5">
                  <div className="mb-6 p-4 bg-[#e7f3ff] border border-[#b3d9ff] rounded-lg">
                    <h4 className="font-semibold mb-2 text-[#004085]">
                      <i className="fa-solid fa-info-circle mr-2"></i>
                      Personalize Your Card
                    </h4>
                    <p className="text-sm text-[#004085]">
                      Choose a design when applying for a new card. Your visual
                      card design helps you quickly identify your card.
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    {/* Visual card previews */}
                    {["default", "sunset", "ocean", "mono"].map((design) => {
                      const bgClass =
                        design === "default"
                          ? "bg-[#6600cb]"
                          : design === "sunset"
                          ? "bg-linear-to-r from-orange-400 to-pink-500"
                          : design === "ocean"
                          ? "bg-linear-to-r from-blue-400 to-cyan-500"
                          : "bg-[#111]";
                      return (
                        <div
                          key={design}
                          className="p-5 bg-white rounded-lg border border-[#e0e0e0] hover:border-[#c64c00] transition-colors"
                        >
                          <div className="mb-4">
                            <div
                              className={`w-full h-32 rounded-lg flex items-center justify-center text-white shadow-lg ${bgClass}`}
                            >
                              <div className="text-center">
                                <i className="fa-regular fa-credit-card text-3xl mb-2"></i>
                                <p className="font-semibold text-sm uppercase tracking-wider">
                                  {design}
                                </p>
                              </div>
                            </div>
                          </div>
                          <h4 className="font-semibold text-lg mb-1 capitalize">
                            {design} Design
                          </h4>
                          <p className="text-sm text-[#595959] mb-4">
                            {design === "default" && "Classic purple design"}
                            {design === "sunset" && "Warm linear theme"}
                            {design === "ocean" && "Cool blue linear"}
                            {design === "mono" && "Sleek black design"}
                          </p>
                          <button
                            className="w-full px-4 py-2 bg-[#c64c00] hover:bg-[#a03f00] text-white rounded transition-colors font-medium"
                            onClick={() => {
                              setApplyDesign(design);
                              setShowApplyModal(true);
                            }}
                          >
                            Apply with This Design
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}

              {tab === "Rewards" && (
                <section className="w-full mt-5 p-8 bg-white rounded-lg">
                  {cards.length === 0 ? (
                    <div className="text-center py-10">
                      <div className="w-20 h-20 rounded-full p-5 bg-[#f5f5f5] mb-4 mx-auto flex items-center justify-center">
                        <i className="fa-solid fa-gift text-4xl text-[#c64c00]"></i>
                      </div>
                      <h4 className="font-bold text-xl mb-3">No Rewards Yet</h4>
                      <p className="text-[15px] text-[#595959] mb-6 max-w-md mx-auto">
                        Apply for a credit card to start earning rewards on
                        every purchase.
                      </p>
                      <button
                        className="px-8 py-3 rounded-lg text-white bg-[#c64c00] hover:bg-[#a03f00] transition-colors font-semibold"
                        onClick={() => setShowApplyModal(true)}
                      >
                        Apply for a Card
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="mb-6 p-6 bg-linear-to-r from-[#c64c00] to-[#ff6600] rounded-lg text-white">
                        <h4 className="font-semibold text-lg mb-2">
                          Your Rewards Balance
                        </h4>
                        <p className="text-4xl font-bold mb-2">
                          0 <span className="text-xl font-normal">points</span>
                        </p>
                        <p className="text-sm opacity-90">
                          Start using your cards to earn rewards
                        </p>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="p-4 bg-[#f8f9fa] rounded-lg">
                          <p className="text-sm text-[#595959] mb-1">
                            Cash Back
                          </p>
                          <h5 className="text-2xl font-bold">$0.00</h5>
                        </div>
                        <div className="p-4 bg-[#f8f9fa] rounded-lg">
                          <p className="text-sm text-[#595959] mb-1">
                            Points Earned
                          </p>
                          <h5 className="text-2xl font-bold">0</h5>
                        </div>
                        <div className="p-4 bg-[#f8f9fa] rounded-lg">
                          <p className="text-sm text-[#595959] mb-1">
                            Points Redeemed
                          </p>
                          <h5 className="text-2xl font-bold">0</h5>
                        </div>
                      </div>

                      <div className="border-t pt-6">
                        <h5 className="font-semibold text-lg mb-4">
                          How to Earn Rewards
                        </h5>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#e7f3ff] flex items-center justify-center shrink-0">
                              <i className="fa-solid fa-shopping-cart text-[#0064de]"></i>
                            </div>
                            <div>
                              <h6 className="font-semibold mb-1">
                                Shop with your card
                              </h6>
                              <p className="text-sm text-[#595959]">
                                Earn 1 point per $1 spent
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#fff3cd] flex items-center justify-center shrink-0">
                              <i className="fa-solid fa-utensils text-[#ffc107]"></i>
                            </div>
                            <div>
                              <h6 className="font-semibold mb-1">
                                Dining rewards
                              </h6>
                              <p className="text-sm text-[#595959]">
                                Earn 2x points on dining
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#d4edda] flex items-center justify-center shrink-0">
                              <i className="fa-solid fa-gas-pump text-[#28a745]"></i>
                            </div>
                            <div>
                              <h6 className="font-semibold mb-1">
                                Gas stations
                              </h6>
                              <p className="text-sm text-[#595959]">
                                Earn 2x points on gas
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#f8d7da] flex items-center justify-center shrink-0">
                              <i className="fa-solid fa-plane text-[#dc3545]"></i>
                            </div>
                            <div>
                              <h6 className="font-semibold mb-1">
                                Travel bonus
                              </h6>
                              <p className="text-sm text-[#595959]">
                                Earn 3x points on travel
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </section>
              )}
            </section>
          </section>
        </section>
      </main>

      {/* Apply modal */}
      {showApplyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[90%] max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h4 className="font-semibold text-xl">Apply for a New Card</h4>
              <button
                className="text-[#595959] hover:text-black"
                onClick={() => {
                  if (!applyLoading) {
                    setShowApplyModal(false);
                    setApplyName("");
                    setApplyType("credit");
                    setApplyDesign("default");
                  }
                }}
                disabled={applyLoading}
              >
                <i className="fa-solid fa-xmark text-xl"></i>
              </button>
            </div>
            <div className="mt-4">
              <label className="text-sm font-medium mb-1 block">
                Card Type
              </label>
              <select
                className="w-full border border-[#d0d0d0] p-3 rounded-lg mb-4 focus:outline-none focus:border-[#c64c00]"
                value={applyType}
                onChange={(e) => setApplyType(e.target.value)}
                disabled={applyLoading}
              >
                <option value="credit">Credit Card</option>
                <option value="debit">Debit Card</option>
              </select>

              <label className="text-sm font-medium mb-1 block">
                Card Name
              </label>
              <input
                className="w-full border border-[#d0d0d0] p-3 rounded-lg mb-4 focus:outline-none focus:border-[#c64c00]"
                value={applyName}
                onChange={(e) => setApplyName(e.target.value)}
                placeholder="e.g. My Platinum Card"
                disabled={applyLoading}
              />

              <label className="text-sm font-medium mb-1 block">
                Card Design
              </label>
              <select
                className="w-full border border-[#d0d0d0] p-3 rounded-lg mb-6 focus:outline-none focus:border-[#c64c00]"
                value={applyDesign}
                onChange={(e) => setApplyDesign(e.target.value)}
                disabled={applyLoading}
              >
                <option value="default">Default (Purple)</option>
                <option value="sunset">Sunset (Orange-Pink)</option>
                <option value="ocean">Ocean (Blue)</option>
                <option value="mono">Mono (Black)</option>
              </select>

              {applyType === "credit" && (
                <div className="mb-4 p-3 bg-[#e7f3ff] border border-[#b3d9ff] rounded-lg">
                  <p className="text-sm text-[#004085]">
                    <i className="fa-solid fa-info-circle mr-2"></i>
                    Initial credit limit: $5,000.00
                  </p>
                </div>
              )}

              <div className="flex justify-end gap-3">
                <button
                  className="px-6 py-2 border border-[#d0d0d0] rounded-lg hover:bg-[#f5f5f5] transition-colors font-medium"
                  onClick={() => {
                    setShowApplyModal(false);
                    setApplyName("");
                    setApplyType("credit");
                    setApplyDesign("default");
                  }}
                  disabled={applyLoading}
                >
                  Cancel
                </button>
                <button
                  className="px-6 py-2 bg-[#c64c00] hover:bg-[#a03f00] text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={confirmApply}
                  disabled={applyLoading}
                >
                  {applyLoading ? (
                    <>
                      <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                      Processing...
                    </>
                  ) : (
                    "Submit Application"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings modal */}
      {showSettings && settingsCard && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[90%] max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h4 className="font-semibold text-xl">Card Settings</h4>
              <button
                className="text-[#595959] hover:text-black"
                onClick={() => {
                  setShowSettings(false);
                  setSettingsCard(null);
                }}
              >
                <i className="fa-solid fa-xmark text-xl"></i>
              </button>
            </div>
            <div className="mt-4">
              <div className="mb-4 p-3 bg-[#f8f9fa] rounded-lg">
                <p className="text-sm text-[#595959] mb-1">Card Number</p>
                <p className="font-semibold">{settingsCard.number}</p>
              </div>

              <label className="text-sm font-medium mb-1 block">
                Card Nickname
              </label>
              <input
                className="w-full border border-[#d0d0d0] p-3 rounded-lg mb-4 focus:outline-none focus:border-[#c64c00]"
                defaultValue={settingsCard.title}
                onBlur={(e) => {
                  if (e.target.value.trim()) {
                    saveSettings({ title: e.target.value.trim() });
                  }
                }}
                placeholder="Enter card nickname"
              />

              <div className="mb-4 p-4 bg-[#fff3cd] border border-[#ffc107] rounded-lg">
                <h5 className="font-semibold text-sm mb-2 text-[#856404]">
                  <i className="fa-solid fa-shield-halved mr-2"></i>
                  Security Options
                </h5>
                <div className="space-y-2 text-sm text-[#856404]">
                  <p>• Lock/unlock card instantly</p>
                  <p>• Report lost or stolen card</p>
                  <p>• Set transaction alerts</p>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  className="px-6 py-2 border border-[#d0d0d0] rounded-lg hover:bg-[#f5f5f5] transition-colors font-medium"
                  onClick={() => {
                    setShowSettings(false);
                    setSettingsCard(null);
                  }}
                >
                  Close
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
    </>
  );
}

export default Cards;
