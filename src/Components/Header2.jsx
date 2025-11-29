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
      <header className="flex justify-between p-5 px-10 items-center bg-[#291b00] shadow-md">
        <img src={Logo} alt="" className="w-20" />
        <div className="flex gap-2 items-center text-[#dfdfdf] relative">
          <div className="flex gap-3 items-center ">
            <i className="fa-regular fa-bell text-[#ffffff] text-xl"></i>
            <div className="w-8 flex items-center justify-center h-8 rounded-full bg-[#0008ff] bg-cover bg-center overflow-hidden">
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
              <div className="absolute right-0 mt-2 w-44 bg-white rounded-lg shadow z-50">
                <nav className="flex flex-col">
                  <NavLink
                    to="/user-home"
                    className="px-4 py-2 text-sm hover:bg-[#f5f5f5] border-b"
                    role="menuitem"
                    onClick={() => setOpen(false)}
                  >
                    Profile
                  </NavLink>
                  <NavLink
                    to="/setting"
                    className="px-4 py-2 text-sm hover:bg-[#f5f5f5] border-b"
                    role="menuitem"
                    onClick={() => setOpen(false)}
                  >
                    Settings
                  </NavLink>
                  <button
                    type="button"
                    className="text-left px-4 py-2 text-sm hover:bg-[#f5f5f5]"
                    role="menuitem"
                    onClick={() => {
                      localStorage.removeItem("firstName");
                      localStorage.removeItem("secondName");
                      localStorage.removeItem("email");
                      setOpen(false);
                      setUserProfile(null);
                      navigate("/login");
                    }}
                  >
                    Logout
                  </button>
                </nav>
              </div>
            )}
          </div>
        </div>
      </header>
      <section
        className=" 
       px-10 pb-4 pt-4  bg-white shadow"
      >
        <ul className="flex gap-8">
          <li>
            <NavLink
              to="/user-home"
              className={({ isActive }) =>
                `pb-4 border-b-2 font-medium cursor-pointer ${
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
