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
        const response = await fetch(`http://localhost:8080/api/user/${email}`);
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

  const [cards, setCards] = useState([
    {
      id: "c1",
      kind: "credit",
      title: "Platinum Rewards",
      number: "•••• •••• •••• 3214",
      current: 1289,
      available: 8289,
      locked: false,
      reported: false,
    },
  ]);

  // apply modal
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applyType, setApplyType] = useState("credit");
  const [applyName, setApplyName] = useState("");
  const [applyDesign, setApplyDesign] = useState("default");

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
    if (!applyName) return showToast("Please provide a card name");
    const id = `c${Date.now()}`;
    const newCard = {
      id,
      kind: applyType,
      title: applyName,
      number: "•••• •••• •••• " + Math.floor(1000 + Math.random() * 9000),
      current: 0,
      available: applyType === "credit" ? 5000 : 0,
      locked: false,
      reported: false,
    };
    setCards((s) => [newCard, ...s]);
    setShowApplyModal(false);
    setApplyName("");
    setApplyType("credit");
    setApplyDesign("default");
    showToast("Application submitted");
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
                  <section className="rounded-lg overflow-hidden mt-5 border border-[#b1b1b1] bg-white w-[50%]">
                    <div className="p-5 bg-[#6600cb]">
                      <div className="flex justify-between items-center mb-6">
                        <span>
                          <p className="font-medium text-[#e4e4e4] mb-1 text-[14px]">
                            Credit Card
                          </p>
                          <h3 className="font-semibold text-xl text-white">
                            {cards[0].title}
                          </h3>
                        </span>
                        <button className="h-10 w-10 p-2 rounded-full bg-[#6500cb57]">
                          <i className="fa-solid fa-ellipsis-vertical text-white"></i>
                        </button>
                      </div>
                      <div className="flex flex-col gap-2 mb-3">
                        <p className="font-medium text-[#e4e4e4] text-[14px]">
                          Card Number
                        </p>
                        <h3 className="font-semibold text-xl text-white">
                          {cards[0].number}
                        </h3>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>
                          <p className="font-medium mb-1 text-[#cdcdcd] text-[14px]">
                            VALID THRU
                          </p>
                          <h4 className="text-lg text-white font-medium">
                            05/28
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
                          <h4 className="text-lg text-white font-medium">
                            {fullName}
                          </h4>
                        </span>
                      </div>
                    </div>
                    <div className="bg-white p-5">
                      <div className="flex mb-3 items-center justify-between">
                        <span>
                          <p className="text-[#595959] mb-1">Current Balance</p>
                          <h4 className="font-semibold text-xl text-black">
                            ${cards[0].current.toLocaleString()}
                          </h4>
                        </span>
                        <span>
                          <p className="text-[#595959] mb-1">
                            Available Credit
                          </p>
                          <h4 className="font-medium text-xl text-black">
                            ${cards[0].available.toLocaleString()}
                          </h4>
                        </span>
                      </div>
                      <div className="flex gap-3">
                        <button
                          className="p-2 px-8 rounded-lg bg-[#bababa]"
                          onClick={() => toggleLock(cards[0].id)}
                        >
                          {cards[0].locked ? "Unlock Card" : "Lock Card"}
                        </button>
                        <button
                          className="p-2 px-8 rounded-lg bg-[#bababa]"
                          onClick={() => reportLost(cards[0].id)}
                        >
                          Report Lost
                        </button>
                        <button
                          className="p-2 px-8 rounded-lg bg-[#bababa]"
                          onClick={() => openSettings(cards[0])}
                        >
                          Card Settings
                        </button>
                      </div>
                    </div>
                  </section>

                  <section className=" w-[50%] m-5 p-5 bg-white rounded-lg border-dotted border border-[#c0c0c0] flex items-center justify-center">
                    <div className="text-center">
                      <button className="w-12 h-12 rounded-full p-2 bg-[#eaeaea] mb-2">
                        <i className="fa-solid fa-plus"></i>
                      </button>
                      <h4 className=" font-semibold text-lg mb-3">
                        Add a new card
                      </h4>
                      <p className="text-[13px] text-[#595959]">
                        Apply for a new credit or debit card
                      </p>
                      <button
                        className="px-6 p-2 rounded-lg text-white bg-[#c64c00] mt-3"
                        onClick={() => setShowApplyModal(true)}
                      >
                        Apply now
                      </button>
                    </div>
                  </section>
                </>
              )}

              {tab === "Visual" && (
                <section className="w-full mt-5 grid grid-cols-2 gap-6">
                  {/* Visual card previews */}
                  {["default", "sunset", "ocean", "mono"].map((design) => {
                    const bgClass =
                      design === "default"
                        ? "bg-[#6600cb]"
                        : design === "sunset"
                        ? "bg-gradient-to-r from-orange-400 to-pink-500"
                        : design === "ocean"
                        ? "bg-gradient-to-r from-blue-400 to-cyan-500"
                        : "bg-[#111]";
                    return (
                      <div
                        key={design}
                        className="p-4 bg-white rounded-lg border flex items-center justify-between"
                      >
                        <div>
                          <div className="mb-2">
                            <div
                              className={`w-40 h-24 rounded-lg flex items-center justify-center text-white ${bgClass}`}
                            >
                              <span className="font-semibold">
                                {design.toUpperCase()}
                              </span>
                            </div>
                          </div>
                          <h4 className="font-semibold">
                            Visual Card — {design}
                          </h4>
                          <p className="text-sm text-[#595959]">
                            Personalize your card design
                          </p>
                        </div>
                        <div>
                          <button
                            className="px-4 py-2 bg-[#c64c00] text-white rounded"
                            onClick={() => {
                              setApplyDesign(design);
                              setShowApplyModal(true);
                            }}
                          >
                            Choose
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </section>
              )}

              {tab === "Rewards" && (
                <section className="w-full mt-5 p-6 bg-white rounded-lg">
                  <h4 className="font-semibold text-lg mb-3">Rewards</h4>
                  <p className="text-sm text-[#595959] mb-4">
                    You have <span className="font-bold">12,340</span> points
                    available.
                  </p>
                  <div className="flex gap-3">
                    <button
                      className="px-4 py-2 bg-[#c64c00] text-white rounded"
                      onClick={() => showToast("Redeemed 1000 points")}
                    >
                      Redeem
                    </button>
                    <button
                      className="px-4 py-2 border rounded"
                      onClick={() => showToast("Points history")}
                    >
                      History
                    </button>
                  </div>
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
            <div className="flex justify-between items-center">
              <h4 className="font-semibold text-lg">Apply for a new card</h4>
              <button
                className="text-[#595959]"
                onClick={() => setShowApplyModal(false)}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <div className="mt-4">
              <label className="text-sm">Card type</label>
              <select
                className="w-full border p-2 rounded mb-3"
                value={applyType}
                onChange={(e) => setApplyType(e.target.value)}
              >
                <option value="credit">Credit</option>
                <option value="debit">Debit</option>
              </select>

              <label className="text-sm">Card name</label>
              <input
                className="w-full border p-2 rounded mb-3"
                value={applyName}
                onChange={(e) => setApplyName(e.target.value)}
                placeholder="e.g. My Platinum"
              />

              <label className="text-sm">Design</label>
              <select
                className="w-full border p-2 rounded mb-4"
                value={applyDesign}
                onChange={(e) => setApplyDesign(e.target.value)}
              >
                <option value="default">Default</option>
                <option value="sunset">Sunset</option>
                <option value="ocean">Ocean</option>
                <option value="mono">Mono</option>
              </select>

              <div className="flex justify-end gap-3">
                <button
                  className="px-4 py-2 border rounded"
                  onClick={() => setShowApplyModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-[#c64c00] text-white rounded"
                  onClick={confirmApply}
                >
                  Apply
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
            <div className="flex justify-between items-center">
              <h4 className="font-semibold text-lg">Card Settings</h4>
              <button
                className="text-[#595959]"
                onClick={() => setShowSettings(false)}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <div className="mt-4">
              <label className="text-sm">Card nickname</label>
              <input
                className="w-full border p-2 rounded mb-3"
                defaultValue={settingsCard.title}
                onBlur={(e) => saveSettings({ title: e.target.value })}
              />
              <div className="flex justify-end gap-3">
                <button
                  className="px-4 py-2 border rounded"
                  onClick={() => setShowSettings(false)}
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
