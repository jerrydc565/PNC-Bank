import React, { useState, useEffect } from "react";
import Logo from "../assets/image/image.png";
import { NavLink } from "react-router-dom";
// header uses static display; auth helper removed per revert
import { useNavigate } from "react-router-dom";
function Header2() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);

  const firstName =
    userProfile?.firstName || localStorage.getItem("firstName") || "User";
  const secondName =
    userProfile?.secondName || localStorage.getItem("secondName") || "User";
  const email = userProfile?.email || localStorage.getItem("email");

  const fullName = `${firstName} ${secondName}`;
  const initials = `${(firstName || "A")[0]}${
    (secondName || "J")[0]
  }`.toUpperCase();

  // ✅ Fetch user profile from backend on mount
  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    if (!storedEmail) return; // Not logged in

    const fetchUserProfile = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/user/${storedEmail}`
        );
        const data = await response.json();
        if (data.success) {
          setUserProfile(data);
        }
      } catch (error) {
        console.error("Error fetching user profile in Header2:", error);
      }
    };

    fetchUserProfile();

    // Load profile picture from localStorage
    const userId = localStorage.getItem("userId");
    const savedPicture = localStorage.getItem(`profilePicture_${userId}`);
    if (savedPicture) {
      setProfilePicture(savedPicture);
    }

    // Listen for profile picture updates
    const handleStorageChange = () => {
      const updatedPicture = localStorage.getItem(`profilePicture_${userId}`);
      setProfilePicture(updatedPicture);
    };

    window.addEventListener("storage", handleStorageChange);

    // Also listen for custom event for same-window updates
    window.addEventListener("profilePictureUpdated", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("profilePictureUpdated", handleStorageChange);
    };
  }, []);

  return (
    <>
      <header className="flex justify-between p-3 sm:p-5 px-4 sm:px-10 items-center bg-[#291b00] shadow-md">
        <img src={Logo} alt="" className="w-16 sm:w-20" />
        <div className="flex gap-2 items-center text-[#dfdfdf] relative">
          <div className="flex gap-2 sm:gap-3 items-center ">
            <button
              onClick={() => navigate("/notifications")}
              className="hover:opacity-80 transition-opacity"
              aria-label="Notifications"
            >
              <i className="fa-regular fa-bell text-[#ffffff] text-lg sm:text-xl"></i>
            </button>
            <div className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full bg-[#0008ff] bg-cover bg-center overflow-hidden">
              {profilePicture ? (
                <img
                  src={profilePicture}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-white font-semibold text-sm">
                  {initials}
                </span>
              )}
            </div>
          </div>

          {/* User dropdown: toggle on click */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setOpen((s) => !s)}
              className="flex items-center gap-2 text-[#dfdfdf] focus:outline-none"
              aria-haspopup="menu"
              aria-expanded={open}
            >
              <span className="hidden sm:inline"> {fullName}!</span>
              <i
                className={`fa-solid fa-angle-down text-lg transition-transform duration-150 ${
                  open ? "rotate-180" : ""
                }`}
              ></i>
            </button>

            {open && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-9999">
                <nav className="flex flex-col py-1">
                  <NavLink
                    to="/user-home"
                    className="px-4 py-3 text-sm text-gray-700 hover:bg-[#f5f5f5] border-b transition-colors"
                    role="menuitem"
                    onClick={() => setOpen(false)}
                  >
                    <i className="fa-solid fa-user mr-2 text-gray-600"></i>
                    Profile
                  </NavLink>
                  <NavLink
                    to="/setting"
                    className="px-4 py-3 text-sm text-gray-700 hover:bg-[#f5f5f5] border-b transition-colors"
                    role="menuitem"
                    onClick={() => setOpen(false)}
                  >
                    <i className="fa-solid fa-gear mr-2 text-gray-600"></i>
                    Settings
                  </NavLink>
                  <button
                    type="button"
                    className="text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    role="menuitem"
                    onClick={() => {
                      localStorage.removeItem("firstName");
                      localStorage.removeItem("secondName");
                      localStorage.removeItem("email");
                      localStorage.removeItem("userId");
                      setOpen(false);
                      setUserProfile(null);
                      window.location.href = "/login";
                    }}
                  >
                    <i className="fa-solid fa-right-from-bracket mr-2"></i>
                    Logout
                  </button>
                </nav>
              </div>
            )}
          </div>
        </div>
      </header>
      <section className="px-3 sm:px-6 lg:px-10 pb-3 sm:pb-4 pt-3 sm:pt-4 bg-white shadow overflow-x-auto">
        <ul className="flex gap-4 sm:gap-6 lg:gap-8 min-w-max sm:min-w-0">
          <li>
            <NavLink
              to="/user-home"
              className={({ isActive }) =>
                `pb-3 sm:pb-4 border-b-2 font-medium cursor-pointer text-sm sm:text-base whitespace-nowrap ${
                  isActive
                    ? "border-[#c64c00] text-[#c64c00]"
                    : "border-transparent hover:border-[#c64c00] hover:text-[#c64c00]"
                }`
              }
            >
              Overview
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/account"
              className={({ isActive }) =>
                `pb-4 border-b-2 font-medium cursor-pointer ${
                  isActive
                    ? "border-[#c64c00] text-[#c64c00]"
                    : "border-transparent hover:border-[#c64c00] hover:text-[#c64c00]"
                }`
              }
            >
              Accounts
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/transaction"
              className={({ isActive }) =>
                `pb-4 border-b-2 font-medium cursor-pointer ${
                  isActive
                    ? "border-[#c64c00] text-[#c64c00]"
                    : "border-transparent hover:border-[#c64c00] hover:text-[#c64c00]"
                }`
              }
            >
              Transactions
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/payment"
              className={({ isActive }) =>
                `pb-4 border-b-2 font-medium cursor-pointer ${
                  isActive
                    ? "border-[#c64c00] text-[#c64c00]"
                    : "border-transparent hover:border-[#c64c00] hover:text-[#c64c00]"
                }`
              }
            >
              Payments & Transfer
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/card"
              className={({ isActive }) =>
                `pb-4 border-b-2 font-medium cursor-pointer ${
                  isActive
                    ? "border-[#c64c00] text-[#c64c00]"
                    : "border-transparent hover:border-[#c64c00] hover:text-[#c64c00]"
                }`
              }
            >
              Cards
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/setting"
              className={({ isActive }) =>
                `pb-4 border-b-2 font-medium cursor-pointer ${
                  isActive
                    ? "border-[#c64c00] text-[#c64c00]"
                    : "border-transparent hover:border-[#c64c00] hover:text-[#c64c00]"
                }`
              }
            >
              Setting
            </NavLink>
          </li>
        </ul>
      </section>
    </>
  );
}

export default Header2;
