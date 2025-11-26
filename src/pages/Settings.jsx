import React, { useState, useEffect } from "react";

function Settings() {
  const [selectedTab, setSelectedTab] = useState("profile");
  const [userProfile, setUserProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Form state for editing
  const [formData, setFormData] = useState({
    firstName: "",
    secondName: "",
    email: "",
    phone: "",
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
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    // TODO: POST to backend to update user profile
    console.log("Saving user profile:", formData);
    setIsEditing(false);
    // After successful save, update userProfile state
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
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg">
                    Personal information
                  </h3>
                  <p className="text-sm text-[#595959]">
                    Update your public profile and contact details
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-[#cfcfcf] flex items-center justify-center text-white">
                    <i className="fa-regular fa-user text-2xl text-[#595959]"></i>
                  </div>
                  <button className="px-4 py-2 bg-[#c64c00] text-white rounded">
                    Change picture
                  </button>
                </div>
              </div>

              <form className="mt-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-[#595959]">First name</label>
                    <input
                      className="w-full border p-2 rounded mt-1"
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      readOnly={!isEditing}
                    />
                  </div>
                  <div>
                    <label className="text-sm text-[#595959]">Last name</label>
                    <input
                      className="w-full border p-2 rounded mt-1"
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
                    <label className="text-sm text-[#595959]">
                      Email address
                    </label>
                    <input
                      className="w-full border p-2 rounded mt-1"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      readOnly={!isEditing}
                    />
                  </div>
                  <div>
                    <label className="text-sm text-[#595959]">
                      Phone number
                    </label>
                    <input
                      className="w-full border p-2 rounded mt-1"
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      readOnly={!isEditing}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  {!isEditing ? (
                    <button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="px-4 py-2 bg-[#c64c00] text-white rounded"
                    >
                      Edit profile
                    </button>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={handleCancel}
                        className="px-4 py-2 border rounded"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleSave}
                        className="px-4 py-2 bg-[#c64c00] text-white rounded"
                      >
                        Save changes
                      </button>
                    </>
                  )}
                </div>
              </form>
            </section>
          )}

          {selectedTab === "notifications" && (
            <section className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg">Notifications</h3>
                  <p className="text-sm text-[#595959]">
                    Control how you receive notifications from the app
                  </p>
                </div>
              </div>

              <div className="mt-4 flex flex-col gap-3">
                <label className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <div className="font-medium">Email notifications</div>
                    <div className="text-sm text-[#595959]">
                      Get account updates and offers by email
                    </div>
                  </div>
                  <input type="checkbox" defaultChecked className="w-5 h-5" />
                </label>

                <label className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <div className="font-medium">SMS alerts</div>
                    <div className="text-sm text-[#595959]">
                      Receive important alerts via text message
                    </div>
                  </div>
                  <input type="checkbox" className="w-5 h-5" />
                </label>

                <label className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <div className="font-medium">Push notifications</div>
                    <div className="text-sm text-[#595959]">
                      Allow push notifications to this device
                    </div>
                  </div>
                  <input type="checkbox" defaultChecked className="w-5 h-5" />
                </label>
              </div>
            </section>
          )}

          {selectedTab === "payment" && (
            <section className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg">Payment methods</h3>
                  <p className="text-sm text-[#595959]">
                    Manage saved cards and bank accounts
                  </p>
                </div>
                <button className="px-4 py-2 bg-[#0022ff] text-white rounded">
                  Add method
                </button>
              </div>

              <div className="mt-4 flex flex-col gap-3">
                <div className="p-3 border rounded flex items-center justify-between">
                  <div>
                    <div className="font-medium">Premium Checking ****4832</div>
                    <div className="text-sm text-[#595959]">
                      Routing ending ••832
                    </div>
                  </div>
                  <div className="text-sm text-[#595959]">Primary</div>
                </div>
                <div className="p-3 border rounded flex items-center justify-between">
                  <div>
                    <div className="font-medium">Platinum Rewards ****3214</div>
                    <div className="text-sm text-[#595959]">Expires 12/27</div>
                  </div>
                  <div className="text-sm text-[#595959]">Card</div>
                </div>
              </div>
            </section>
          )}

          {selectedTab === "security" && (
            <section className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold text-lg">Security</h3>
              <p className="text-sm text-[#595959] mt-2">
                Manage passwords, 2FA, and device sessions
              </p>
              <div className="mt-4 grid grid-cols-1 gap-3">
                <div className="p-3 border rounded flex items-center justify-between">
                  <div>
                    <div className="font-medium">Password</div>
                    <div className="text-sm text-[#595959]">
                      Last changed: 3 months ago
                    </div>
                  </div>
                  <button className="px-3 py-1 border rounded">Change</button>
                </div>
                <div className="p-3 border rounded flex items-center justify-between">
                  <div>
                    <div className="font-medium">Two-factor authentication</div>
                    <div className="text-sm text-[#595959]">
                      Protect your account with an extra verification step
                    </div>
                  </div>
                  <button className="px-3 py-1 border rounded">Manage</button>
                </div>
              </div>
            </section>
          )}

          {selectedTab === "devices" && (
            <section className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold text-lg">Connected devices</h3>
              <p className="text-sm text-[#595959] mt-2">
                View and remove devices connected to your account
              </p>
              <div className="mt-4 grid grid-cols-1 gap-3">
                <div className="p-3 border rounded flex items-center justify-between">
                  <div>
                    <div className="font-medium">Chrome on Windows</div>
                    <div className="text-sm text-[#595959]">
                      Last active: Nov 20, 2025
                    </div>
                  </div>
                  <button className="px-3 py-1 border rounded">Remove</button>
                </div>
              </div>
            </section>
          )}

          {selectedTab === "help" && (
            <section className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold text-lg">Help & support</h3>
              <p className="text-sm text-[#595959] mt-2">
                Find answers or contact support
              </p>
              <div className="mt-4 flex gap-3">
                <button className="px-4 py-2 border rounded">FAQ</button>
                <button className="px-4 py-2 bg-[#c64c00] text-white rounded">
                  Contact support
                </button>
              </div>
            </section>
          )}
        </div>
      </section>
    </main>
  );
}

export default Settings;
