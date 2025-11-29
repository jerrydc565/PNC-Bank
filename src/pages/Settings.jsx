import React, { useState, useEffect } from "react";

function Settings() {
  const [selectedTab, setSelectedTab] = useState("profile");
  const [userProfile, setUserProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [showDeviceModal, setShowDeviceModal] = useState(false);

  // Form state for editing
  const [formData, setFormData] = useState({
    firstName: "",
    secondName: "",
    email: "",
    phone: "",
  });

  // Notification preferences
  const [notifications, setNotifications] = useState(() => {
    const userId = localStorage.getItem("userId");
    const saved = localStorage.getItem(`notifications_${userId}`);
    return saved
      ? JSON.parse(saved)
      : {
          email: true,
          sms: false,
          push: true,
          transactions: true,
          marketing: false,
          security: true,
        };
  });

  // 2FA state
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(() => {
    const userId = localStorage.getItem("userId");
    return localStorage.getItem(`2fa_${userId}`) === "true";
  });

  // Connected devices
  const [devices, setDevices] = useState(() => {
    const userId = localStorage.getItem("userId");
    const saved = localStorage.getItem(`devices_${userId}`);
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: "d1",
            name: "Chrome on Windows",
            lastActive: new Date().toISOString(),
            current: true,
          },
        ];
  });

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
          setFormData({
            firstName: data.firstName || "",
            secondName: data.secondName || "",
            email: data.email || "",
            phone: data.phone || "",
          });
        }
      } catch (error) {
        console.error("Error fetching user profile in Settings:", error);
      }
    };

    fetchUserProfile();

    // Load profile picture from localStorage
    const userId = localStorage.getItem("userId");
    const savedPicture = localStorage.getItem(`profilePicture_${userId}`);
    if (savedPicture) {
      setProfilePicture(savedPicture);
    }
  }, []);

  // Save notifications to localStorage
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      localStorage.setItem(
        `notifications_${userId}`,
        JSON.stringify(notifications)
      );
    }
  }, [notifications]);

  // Save devices to localStorage
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      localStorage.setItem(`devices_${userId}`, JSON.stringify(devices));
    }
  }, [devices]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setSaveError("Image size should be less than 5MB");
        return;
      }

      // Check file type
      if (!file.type.startsWith("image/")) {
        setSaveError("Please upload an image file");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const userId = localStorage.getItem("userId");
        setProfilePicture(reader.result);
        localStorage.setItem(`profilePicture_${userId}`, reader.result);

        // Dispatch custom event to notify other components
        window.dispatchEvent(new Event("profilePictureUpdated"));

        setSaveSuccess("Profile picture updated");
        setTimeout(() => setSaveSuccess(""), 2000);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNotificationChange = (key) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const removeDevice = (deviceId) => {
    setDevices((prev) => prev.filter((d) => d.id !== deviceId));
  };

  const toggle2FA = () => {
    const userId = localStorage.getItem("userId");
    const newValue = !twoFactorEnabled;
    setTwoFactorEnabled(newValue);
    localStorage.setItem(`2fa_${userId}`, newValue.toString());
    setShow2FAModal(false);
  };

  const handleSave = async () => {
    setSaveError("");
    setSaveSuccess("");
    setSaving(true);
    try {
      const targetEmail = userProfile?.email || localStorage.getItem("email");
      if (!targetEmail) {
        setSaveError("No user session found");
        return;
      }

      // Try PUT /api/user/{email} first
      let resp = await fetch(`http://localhost:8080/api/user/${targetEmail}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      // If endpoint not available, try fallback POST
      if (resp.status === 404) {
        resp = await fetch("http://localhost:8080/api/user/update", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      }

      const data = await resp.json();
      if (data.success) {
        // Update local state and localStorage
        const updated = {
          ...userProfile,
          firstName: data.firstName ?? formData.firstName,
          secondName: data.secondName ?? formData.secondName,
          email: data.email ?? formData.email,
          phone: data.phone ?? formData.phone,
        };
        setUserProfile(updated);
        localStorage.setItem("firstName", updated.firstName || "");
        localStorage.setItem("secondName", updated.secondName || "");
        localStorage.setItem("email", updated.email || "");
        setFormData({
          firstName: updated.firstName || "",
          secondName: updated.secondName || "",
          email: updated.email || "",
          phone: updated.phone || "",
        });
        setIsEditing(false);
        setSaveSuccess("Profile updated");
      } else {
        setSaveError(data.message || "Failed to update profile");
      }
    } catch (err) {
      console.error("Save profile error:", err);
      setSaveError(err.message || "Error updating profile");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset form to current profile data
    setFormData({
      firstName: userProfile?.firstName || "",
      secondName: userProfile?.secondName || "",
      email: userProfile?.email || "",
      phone: userProfile?.phone || "",
    });
    setIsEditing(false);
  };

  return (
    <main className="bg-[#f3f3f3] min-h-screen p-6">
      <header className="mb-6">
        <h2 className="text-2xl font-bold">Settings</h2>
        <p className="text-sm text-[#595959]">
          Manage your account settings and preferences
        </p>
      </header>

      <section className="flex gap-8">
        {/* Left navigation */}
        <aside className="w-[28%]">
          <div className="bg-white rounded-lg shadow p-6 sticky top-6">
            <nav className="flex flex-col gap-2">
              <button
                onClick={() => setSelectedTab("profile")}
                aria-current={selectedTab === "profile"}
                className={`text-left py-3 px-4 rounded-lg hover:bg-[#f5f5f5] flex items-center gap-3 font-medium ${
                  selectedTab === "profile"
                    ? "bg-[#fffefc] border border-[#e6d1c7]"
                    : ""
                }`}
              >
                <i className="fa-solid fa-user text-[#c64c00]"></i> Profile
              </button>

              <button
                onClick={() => setSelectedTab("security")}
                aria-current={selectedTab === "security"}
                className={`text-left py-3 px-4 rounded-lg hover:bg-[#f5f5f5] flex items-center gap-3 ${
                  selectedTab === "security"
                    ? "bg-[#fffefc] border border-[#e6d1c7]"
                    : ""
                }`}
              >
                <i className="fa-solid fa-lock text-[#595959]"></i> Security
              </button>

              <button
                onClick={() => setSelectedTab("notifications")}
                aria-current={selectedTab === "notifications"}
                className={`text-left py-3 px-4 rounded-lg hover:bg-[#f5f5f5] flex items-center gap-3 ${
                  selectedTab === "notifications"
                    ? "bg-[#fffefc] border border-[#e6d1c7]"
                    : ""
                }`}
              >
                <i className="fa-regular fa-bell text-[#595959]"></i>{" "}
                Notifications
              </button>

              <button
                onClick={() => setSelectedTab("payment")}
                aria-current={selectedTab === "payment"}
                className={`text-left py-3 px-4 rounded-lg hover:bg-[#f5f5f5] flex items-center gap-3 ${
                  selectedTab === "payment"
                    ? "bg-[#fffefc] border border-[#e6d1c7]"
                    : ""
                }`}
              >
                <i className="fa-solid fa-credit-card text-[#595959]"></i>{" "}
                Payment methods
              </button>

              <button
                onClick={() => setSelectedTab("devices")}
                aria-current={selectedTab === "devices"}
                className={`text-left py-3 px-4 rounded-lg hover:bg-[#f5f5f5] flex items-center gap-3 ${
                  selectedTab === "devices"
                    ? "bg-[#fffefc] border border-[#e6d1c7]"
                    : ""
                }`}
              >
                <i className="fa-solid fa-tv text-[#595959]"></i> Connected
                devices
              </button>

              <button
                onClick={() => setSelectedTab("help")}
                aria-current={selectedTab === "help"}
                className={`text-left py-3 px-4 rounded-lg hover:bg-[#f5f5f5] flex items-center gap-3 ${
                  selectedTab === "help"
                    ? "bg-[#fffefc] border border-[#e6d1c7]"
                    : ""
                }`}
              >
                <i className="fa-solid fa-circle-question text-[#595959]"></i>{" "}
                Help & support
              </button>
            </nav>
          </div>
        </aside>

        <div className="w-[72%] flex flex-col gap-6">
          {/* Right content switches based on selectedTab */}
          {selectedTab === "profile" && (
            <section className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-semibold text-lg">
                    Personal information
                  </h3>
                  <p className="text-sm text-[#595959]">
                    Update your public profile and contact details
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16 rounded-full bg-[#cfcfcf] flex items-center justify-center text-white overflow-hidden">
                    {profilePicture ? (
                      <img
                        src={profilePicture}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <i className="fa-regular fa-user text-2xl text-[#595959]"></i>
                    )}
                  </div>
                  <div>
                    <input
                      type="file"
                      id="profilePictureInput"
                      accept="image/*"
                      onChange={handlePictureChange}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        document.getElementById("profilePictureInput").click()
                      }
                      className="px-4 py-2 bg-[#c64c00] hover:bg-[#a03f00] text-white rounded transition-colors font-medium"
                    >
                      <i className="fa-solid fa-camera mr-2"></i>
                      Change picture
                    </button>
                    {profilePicture && (
                      <button
                        type="button"
                        onClick={() => {
                          const userId = localStorage.getItem("userId");
                          setProfilePicture(null);
                          localStorage.removeItem(`profilePicture_${userId}`);

                          // Dispatch custom event to notify other components
                          window.dispatchEvent(
                            new Event("profilePictureUpdated")
                          );

                          setSaveSuccess("Picture removed");
                          setTimeout(() => setSaveSuccess(""), 2000);
                        }}
                        className="mt-2 text-sm text-red-600 hover:text-red-800"
                      >
                        Remove picture
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <form className="mt-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-[#595959] mb-1 block">
                      First name
                    </label>
                    <input
                      className={`w-full border p-3 rounded-lg focus:outline-none focus:border-[#c64c00] ${
                        !isEditing ? "bg-[#f5f5f5]" : ""
                      }`}
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      readOnly={!isEditing}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-[#595959] mb-1 block">
                      Last name
                    </label>
                    <input
                      className={`w-full border p-3 rounded-lg focus:outline-none focus:border-[#c64c00] ${
                        !isEditing ? "bg-[#f5f5f5]" : ""
                      }`}
                      type="text"
                      name="secondName"
                      value={formData.secondName}
                      onChange={handleChange}
                      readOnly={!isEditing}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="text-sm font-medium text-[#595959] mb-1 block">
                      Email address
                    </label>
                    <input
                      className={`w-full border p-3 rounded-lg focus:outline-none focus:border-[#c64c00] ${
                        !isEditing ? "bg-[#f5f5f5]" : ""
                      }`}
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      readOnly={!isEditing}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-[#595959] mb-1 block">
                      Phone number
                    </label>
                    <input
                      className={`w-full border p-3 rounded-lg focus:outline-none focus:border-[#c64c00] ${
                        !isEditing ? "bg-[#f5f5f5]" : ""
                      }`}
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      readOnly={!isEditing}
                      placeholder="(555) 000-0000"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="text-sm font-medium text-[#595959] mb-1 block">
                    Account ID
                  </label>
                  <input
                    className="w-full border p-3 rounded-lg bg-[#f5f5f5]"
                    type="text"
                    value={`#${userProfile?.userId || "N/A"}`}
                    readOnly
                  />
                </div>

                <div className="flex justify-between items-center gap-3 mt-6 pt-6 border-t">
                  <div className="text-sm">
                    {saveError && (
                      <span className="text-red-600 flex items-center gap-2">
                        <i className="fa-solid fa-circle-exclamation"></i>
                        {saveError}
                      </span>
                    )}
                    {saveSuccess && (
                      <span className="text-green-600 flex items-center gap-2">
                        <i className="fa-solid fa-circle-check"></i>
                        {saveSuccess}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-3">
                    {!isEditing ? (
                      <button
                        type="button"
                        onClick={() => setIsEditing(true)}
                        className="px-6 py-2 bg-[#c64c00] hover:bg-[#a03f00] text-white rounded transition-colors font-medium"
                      >
                        <i className="fa-solid fa-pen mr-2"></i>
                        Edit profile
                      </button>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={handleCancel}
                          className="px-6 py-2 border border-[#d0d0d0] rounded hover:bg-[#f5f5f5] transition-colors font-medium"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={handleSave}
                          disabled={saving}
                          className="px-6 py-2 bg-[#c64c00] hover:bg-[#a03f00] text-white rounded transition-colors disabled:opacity-60 font-medium"
                        >
                          {saving ? (
                            <>
                              <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                              Saving...
                            </>
                          ) : (
                            <>
                              <i className="fa-solid fa-check mr-2"></i>
                              Save changes
                            </>
                          )}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </form>
            </section>
          )}

          {selectedTab === "notifications" && (
            <section className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-semibold text-lg">
                    Notification Preferences
                  </h3>
                  <p className="text-sm text-[#595959]">
                    Control how you receive notifications from the app
                  </p>
                </div>
              </div>

              <div className="mt-4 flex flex-col gap-3">
                <label className="flex items-center justify-between p-4 border border-[#e0e0e0] rounded-lg hover:border-[#c64c00] transition-colors cursor-pointer">
                  <div>
                    <div className="font-semibold flex items-center gap-2">
                      <i className="fa-regular fa-envelope text-[#c64c00]"></i>
                      Email notifications
                    </div>
                    <div className="text-sm text-[#595959] mt-1">
                      Get account updates and offers by email
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications.email}
                    onChange={() => handleNotificationChange("email")}
                    className="w-5 h-5 accent-[#c64c00] cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-4 border border-[#e0e0e0] rounded-lg hover:border-[#c64c00] transition-colors cursor-pointer">
                  <div>
                    <div className="font-semibold flex items-center gap-2">
                      <i className="fa-solid fa-message text-[#0064de]"></i>
                      SMS alerts
                    </div>
                    <div className="text-sm text-[#595959] mt-1">
                      Receive important alerts via text message
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications.sms}
                    onChange={() => handleNotificationChange("sms")}
                    className="w-5 h-5 accent-[#c64c00] cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-4 border border-[#e0e0e0] rounded-lg hover:border-[#c64c00] transition-colors cursor-pointer">
                  <div>
                    <div className="font-semibold flex items-center gap-2">
                      <i className="fa-solid fa-bell text-[#ffc107]"></i>
                      Push notifications
                    </div>
                    <div className="text-sm text-[#595959] mt-1">
                      Allow push notifications to this device
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications.push}
                    onChange={() => handleNotificationChange("push")}
                    className="w-5 h-5 accent-[#c64c00] cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-4 border border-[#e0e0e0] rounded-lg hover:border-[#c64c00] transition-colors cursor-pointer">
                  <div>
                    <div className="font-semibold flex items-center gap-2">
                      <i className="fa-solid fa-money-bill-transfer text-[#28a745]"></i>
                      Transaction alerts
                    </div>
                    <div className="text-sm text-[#595959] mt-1">
                      Get notified of all account transactions
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications.transactions}
                    onChange={() => handleNotificationChange("transactions")}
                    className="w-5 h-5 accent-[#c64c00] cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-4 border border-[#e0e0e0] rounded-lg hover:border-[#c64c00] transition-colors cursor-pointer">
                  <div>
                    <div className="font-semibold flex items-center gap-2">
                      <i className="fa-solid fa-bullhorn text-[#ff6600]"></i>
                      Marketing communications
                    </div>
                    <div className="text-sm text-[#595959] mt-1">
                      Receive promotional offers and news
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications.marketing}
                    onChange={() => handleNotificationChange("marketing")}
                    className="w-5 h-5 accent-[#c64c00] cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-4 border border-[#e0e0e0] rounded-lg hover:border-[#c64c00] transition-colors cursor-pointer">
                  <div>
                    <div className="font-semibold flex items-center gap-2">
                      <i className="fa-solid fa-shield-halved text-[#dc3545]"></i>
                      Security alerts
                    </div>
                    <div className="text-sm text-[#595959] mt-1">
                      Important security notifications (recommended)
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications.security}
                    onChange={() => handleNotificationChange("security")}
                    className="w-5 h-5 accent-[#c64c00] cursor-pointer"
                  />
                </label>
              </div>

              <div className="mt-6 p-4 bg-[#e7f3ff] border border-[#b3d9ff] rounded-lg">
                <p className="text-sm text-[#004085]">
                  <i className="fa-solid fa-info-circle mr-2"></i>
                  Your notification preferences are saved automatically. Changes
                  take effect immediately.
                </p>
              </div>
            </section>
          )}

          {selectedTab === "payment" && (
            <section className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-semibold text-lg">Payment Methods</h3>
                  <p className="text-sm text-[#595959]">
                    Manage your linked accounts and cards
                  </p>
                </div>
              </div>

              <div className="mt-4 flex flex-col gap-3">
                <div className="p-4 border border-[#e0e0e0] rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#c6400022] flex items-center justify-center">
                      <i className="fa-solid fa-building-columns text-[#c64c00] text-xl"></i>
                    </div>
                    <div>
                      <div className="font-semibold">
                        Premium Checking ****4832
                      </div>
                      <div className="text-sm text-[#595959]">
                        Primary checking account
                      </div>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-[#28a74522] text-[#28a745] text-sm font-medium rounded-full">
                    Primary
                  </span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-[#fff3cd] border border-[#ffc107] rounded-lg">
                <p className="text-sm text-[#856404]">
                  <i className="fa-solid fa-info-circle mr-2"></i>
                  Your primary account is used for transactions and transfers by
                  default.
                </p>
              </div>
            </section>
          )}

          {selectedTab === "security" && (
            <section className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold text-lg mb-2">Security Settings</h3>
              <p className="text-sm text-[#595959] mb-6">
                Manage passwords, 2FA, and device sessions
              </p>
              <div className="mt-4 grid grid-cols-1 gap-4">
                <div className="p-4 border border-[#e0e0e0] rounded-lg flex items-center justify-between hover:border-[#c64c00] transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#00a65122] flex items-center justify-center">
                      <i className="fa-solid fa-key text-[#28a745] text-xl"></i>
                    </div>
                    <div>
                      <div className="font-semibold">Password</div>
                      <div className="text-sm text-[#595959]">
                        Last changed: 3 months ago
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowPasswordModal(true)}
                    className="px-4 py-2 border border-[#d0d0d0] rounded-lg hover:bg-[#f5f5f5] transition-colors font-medium"
                  >
                    Change
                  </button>
                </div>
                <div className="p-4 border border-[#e0e0e0] rounded-lg flex items-center justify-between hover:border-[#c64c00] transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#0064de22] flex items-center justify-center">
                      <i className="fa-solid fa-shield-halved text-[#0064de] text-xl"></i>
                    </div>
                    <div>
                      <div className="font-semibold">
                        Two-factor authentication
                      </div>
                      <div className="text-sm text-[#595959]">
                        {twoFactorEnabled
                          ? "Enabled - Extra security active"
                          : "Not enabled - Add extra security"}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setShow2FAModal(true)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      twoFactorEnabled
                        ? "bg-[#28a745] text-white hover:bg-[#218838]"
                        : "border border-[#d0d0d0] hover:bg-[#f5f5f5]"
                    }`}
                  >
                    {twoFactorEnabled ? "Enabled" : "Enable"}
                  </button>
                </div>
              </div>

              <div className="mt-6 p-4 bg-[#fff3cd] border border-[#ffc107] rounded-lg">
                <p className="text-sm text-[#856404] font-semibold mb-2">
                  <i className="fa-solid fa-triangle-exclamation mr-2"></i>
                  Security Recommendation
                </p>
                <p className="text-sm text-[#856404]">
                  We strongly recommend enabling two-factor authentication to
                  protect your account from unauthorized access.
                </p>
              </div>
            </section>
          )}

          {selectedTab === "devices" && (
            <section className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold text-lg mb-2">Connected Devices</h3>
              <p className="text-sm text-[#595959] mb-6">
                Manage devices that have access to your account
              </p>
              <div className="mt-4 grid grid-cols-1 gap-4">
                {devices.map((device) => (
                  <div
                    key={device.id}
                    className="p-4 border border-[#e0e0e0] rounded-lg flex items-center justify-between hover:border-[#c64c00] transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-[#0064de22] flex items-center justify-center">
                        <i className="fa-solid fa-desktop text-[#0064de] text-xl"></i>
                      </div>
                      <div>
                        <div className="font-semibold flex items-center gap-2">
                          {device.name}
                          {device.current && (
                            <span className="px-2 py-0.5 bg-[#28a74522] text-[#28a745] text-xs font-medium rounded-full">
                              Current
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-[#595959]">
                          Last active:{" "}
                          {new Date(device.lastActive).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    {!device.current && (
                      <button
                        onClick={() => removeDevice(device.id)}
                        className="px-4 py-2 border border-[#dc3545] text-[#dc3545] rounded-lg hover:bg-[#dc3545] hover:text-white transition-colors font-medium"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {devices.length === 1 && (
                <div className="mt-6 p-4 bg-[#e7f3ff] border border-[#b3d9ff] rounded-lg">
                  <p className="text-sm text-[#004085]">
                    <i className="fa-solid fa-info-circle mr-2"></i>
                    This is your only connected device. You can log in from
                    other devices to see them here.
                  </p>
                </div>
              )}
            </section>
          )}

          {selectedTab === "help" && (
            <section className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold text-lg mb-2">Help & Support</h3>
              <p className="text-sm text-[#595959] mb-6">
                Get assistance with your account
              </p>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-6 border border-[#e0e0e0] rounded-lg hover:border-[#c64c00] transition-colors cursor-pointer">
                  <div className="w-12 h-12 rounded-full bg-[#0064de22] flex items-center justify-center mb-4">
                    <i className="fa-solid fa-book text-[#0064de] text-xl"></i>
                  </div>
                  <h4 className="font-semibold mb-2">Knowledge Base</h4>
                  <p className="text-sm text-[#595959]">
                    Browse articles and guides
                  </p>
                </div>

                <div className="p-6 border border-[#e0e0e0] rounded-lg hover:border-[#c64c00] transition-colors cursor-pointer">
                  <div className="w-12 h-12 rounded-full bg-[#28a74522] flex items-center justify-center mb-4">
                    <i className="fa-solid fa-comments text-[#28a745] text-xl"></i>
                  </div>
                  <h4 className="font-semibold mb-2">Live Chat</h4>
                  <p className="text-sm text-[#595959]">
                    Chat with our support team
                  </p>
                </div>

                <div className="p-6 border border-[#e0e0e0] rounded-lg hover:border-[#c64c00] transition-colors cursor-pointer">
                  <div className="w-12 h-12 rounded-full bg-[#c6400022] flex items-center justify-center mb-4">
                    <i className="fa-solid fa-envelope text-[#c64c00] text-xl"></i>
                  </div>
                  <h4 className="font-semibold mb-2">Email Support</h4>
                  <p className="text-sm text-[#595959]">support@pncbank.com</p>
                </div>

                <div className="p-6 border border-[#e0e0e0] rounded-lg hover:border-[#c64c00] transition-colors cursor-pointer">
                  <div className="w-12 h-12 rounded-full bg-[#ffc10722] flex items-center justify-center mb-4">
                    <i className="fa-solid fa-phone text-[#ffc107] text-xl"></i>
                  </div>
                  <h4 className="font-semibold mb-2">Phone Support</h4>
                  <p className="text-sm text-[#595959]">1-800-PNC-BANK</p>
                </div>
              </div>

              <div className="border-t pt-6">
                <h4 className="font-semibold mb-4">
                  Frequently Asked Questions
                </h4>
                <div className="space-y-3">
                  <details className="p-3 border border-[#e0e0e0] rounded-lg">
                    <summary className="font-medium cursor-pointer">
                      How do I reset my password?
                    </summary>
                    <p className="text-sm text-[#595959] mt-2">
                      Go to Security settings and click "Change" next to
                      Password.
                    </p>
                  </details>
                  <details className="p-3 border border-[#e0e0e0] rounded-lg">
                    <summary className="font-medium cursor-pointer">
                      How do I enable two-factor authentication?
                    </summary>
                    <p className="text-sm text-[#595959] mt-2">
                      Navigate to Security settings and click "Enable" next to
                      Two-factor authentication.
                    </p>
                  </details>
                  <details className="p-3 border border-[#e0e0e0] rounded-lg">
                    <summary className="font-medium cursor-pointer">
                      How do I update my contact information?
                    </summary>
                    <p className="text-sm text-[#595959] mt-2">
                      Go to Profile settings, click "Edit profile", make your
                      changes, and click "Save changes".
                    </p>
                  </details>
                </div>
              </div>
            </section>
          )}
        </div>
      </section>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[90%] max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h4 className="font-semibold text-xl">Change Password</h4>
              <button
                className="text-[#595959] hover:text-black"
                onClick={() => setShowPasswordModal(false)}
              >
                <i className="fa-solid fa-xmark text-xl"></i>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Current Password
                </label>
                <input
                  type="password"
                  className="w-full border border-[#d0d0d0] p-3 rounded-lg focus:outline-none focus:border-[#c64c00]"
                  placeholder="Enter current password"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">
                  New Password
                </label>
                <input
                  type="password"
                  className="w-full border border-[#d0d0d0] p-3 rounded-lg focus:outline-none focus:border-[#c64c00]"
                  placeholder="Enter new password"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  className="w-full border border-[#d0d0d0] p-3 rounded-lg focus:outline-none focus:border-[#c64c00]"
                  placeholder="Confirm new password"
                />
              </div>
              <div className="p-3 bg-[#e7f3ff] border border-[#b3d9ff] rounded-lg">
                <p className="text-sm text-[#004085]">
                  <i className="fa-solid fa-info-circle mr-2"></i>
                  Password must be at least 8 characters with uppercase,
                  lowercase, and numbers.
                </p>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  className="px-6 py-2 border border-[#d0d0d0] rounded-lg hover:bg-[#f5f5f5] transition-colors font-medium"
                  onClick={() => setShowPasswordModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-6 py-2 bg-[#c64c00] hover:bg-[#a03f00] text-white rounded-lg transition-colors font-medium"
                  onClick={() => {
                    setShowPasswordModal(false);
                    setSaveSuccess("Password updated successfully");
                    setTimeout(() => setSaveSuccess(""), 3000);
                  }}
                >
                  Update Password
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2FA Modal */}
      {show2FAModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[90%] max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h4 className="font-semibold text-xl">
                Two-Factor Authentication
              </h4>
              <button
                className="text-[#595959] hover:text-black"
                onClick={() => setShow2FAModal(false)}
              >
                <i className="fa-solid fa-xmark text-xl"></i>
              </button>
            </div>
            <div className="space-y-4">
              {!twoFactorEnabled ? (
                <>
                  <div className="text-center py-4">
                    <div className="w-20 h-20 rounded-full bg-[#0064de22] flex items-center justify-center mx-auto mb-4">
                      <i className="fa-solid fa-shield-halved text-[#0064de] text-4xl"></i>
                    </div>
                    <h5 className="font-semibold text-lg mb-2">
                      Enable Two-Factor Authentication
                    </h5>
                    <p className="text-sm text-[#595959]">
                      Add an extra layer of security to your account by
                      requiring a verification code in addition to your
                      password.
                    </p>
                  </div>
                  <div className="p-4 bg-[#e7f3ff] border border-[#b3d9ff] rounded-lg">
                    <p className="text-sm text-[#004085] font-semibold mb-2">
                      How it works:
                    </p>
                    <ul className="text-sm text-[#004085] space-y-1">
                      <li>• Receive a code via SMS or email</li>
                      <li>• Enter the code when logging in</li>
                      <li>• Your account stays protected</li>
                    </ul>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-center py-4">
                    <div className="w-20 h-20 rounded-full bg-[#28a74522] flex items-center justify-center mx-auto mb-4">
                      <i className="fa-solid fa-check-circle text-[#28a745] text-4xl"></i>
                    </div>
                    <h5 className="font-semibold text-lg mb-2">
                      2FA is Currently Enabled
                    </h5>
                    <p className="text-sm text-[#595959]">
                      Your account is protected with two-factor authentication.
                    </p>
                  </div>
                  <div className="p-4 bg-[#fff3cd] border border-[#ffc107] rounded-lg">
                    <p className="text-sm text-[#856404]">
                      <i className="fa-solid fa-triangle-exclamation mr-2"></i>
                      Disabling 2FA will make your account less secure.
                    </p>
                  </div>
                </>
              )}
              <div className="flex justify-end gap-3 pt-4">
                <button
                  className="px-6 py-2 border border-[#d0d0d0] rounded-lg hover:bg-[#f5f5f5] transition-colors font-medium"
                  onClick={() => setShow2FAModal(false)}
                >
                  Cancel
                </button>
                <button
                  className={`px-6 py-2 rounded-lg transition-colors font-medium ${
                    twoFactorEnabled
                      ? "bg-[#dc3545] hover:bg-[#c82333] text-white"
                      : "bg-[#28a745] hover:bg-[#218838] text-white"
                  }`}
                  onClick={toggle2FA}
                >
                  {twoFactorEnabled ? "Disable 2FA" : "Enable 2FA"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default Settings;
