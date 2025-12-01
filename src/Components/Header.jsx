import React from "react";
import logo from "../assets/image/image.png";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
function Header() {
  const [downDrop, setDownDrop] = useState("Hide");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHalfScrolled, setIsHalfScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [mobileProducts, setMobileProducts] = useState(false);

  const handleMore = () => {
    if (downDrop === "Hide") {
      setDownDrop("Show");
    } else {
      setDownDrop("Hide");
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const heroHeight = window.innerHeight;
      if (window.scrollY > heroHeight) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);

    // Cleanup
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleHalfScroll = () => {
      if (window.scrollY > 100) {
        setIsHalfScrolled(true);
      } else {
        setIsHalfScrolled(false);
      }
    };
    window.addEventListener("scroll", handleHalfScroll);

    // Cleanup
    return () => window.removeEventListener("scroll", handleHalfScroll);
  }, []);

  const handleLess = () => {
    if (downDrop === "Show") {
      setDownDrop("Hide");
    } else {
      setDownDrop("Show");
    }
  };

  return (
    <div className=" sticky top-0 z-100   w-full left-0 right-0 ">
      <header
        className={`flex justify-between items-center p-4 sm:p-6 lg:px-20 absolute w-full ${
          isScrolled ? "bg-[#1e1b18e1] backdrop-blur-xl" : "bg-transparent"
        }  ${
          isHalfScrolled
            ? "bg-[#1e1b187e] backdrop-blur-[5px]"
            : "bg-transparent"
        } `}
      >
        <nav className="flex items-center gap-3 sm:gap-6">
          <img
            src={logo}
            alt="Logo"
            className="mr-4 sm:mr-6 lg:mr-10 w-12 sm:w-auto"
          />
          <ul className="hidden md:flex items-center gap-3 lg:gap-6 text-white font-medium text-sm lg:text-base">
            <Link to={"/"}>
              <li className="hover:underline hover:pb-1 hover:text-[#8f8f8f] duration-300 transition-all cursor-pointer">
                Home
              </li>
            </Link>

            <li className="flex items-center gap-2 hover:text-[#8f8f8f]">
              Products{" "}
              <i class="fa-solid fa-angle-down" onMouseEnter={handleMore}>
                {" "}
              </i>
            </li>
            <Link to={"/resources"}>
              {" "}
              <li className="hover:underline hover:pb-1 hover:text-[#8f8f8f]  duration-300 transition-all cursor-pointer">
                Resources
              </li>
            </Link>

            <Link to={"/support"}>
              {" "}
              <li className="hover:underline hover:pb-1 hover:text-[#8f8f8f]  duration-300 transition-all cursor-pointer">
                Support
              </li>
            </Link>
          </ul>
        </nav>
        <div className="flex items-center gap-3">
          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white text-2xl"
            onClick={() => setMobileMenu(!mobileMenu)}
          >
            <i
              className={mobileMenu ? "fa-solid fa-times" : "fa-solid fa-bars"}
            ></i>
          </button>

          <Link to={"/login"}>
            {" "}
            <button className="bg-[#cb8400] duration-300 transition-all cursor-pointer hover:bg-[#6b4500] p-1 px-4 sm:px-6 lg:px-10 rounded-xl text-white font-semibold text-sm sm:text-base">
              Login
            </button>
          </Link>
        </div>
      </header>

      {/* Mobile Menu */}
      <div
        className={`md:hidden fixed top-16 left-0 w-full bg-[#1e1b18f5] backdrop-blur-xl transition-all duration-300 overflow-hidden z-50 ${
          mobileMenu ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="flex flex-col p-4">
          <Link to={"/"} onClick={() => setMobileMenu(false)}>
            <div className="text-white py-3 px-4 hover:bg-[#2e2b28] rounded">
              Home
            </div>
          </Link>

          <div>
            <div
              className="text-white py-3 px-4 hover:bg-[#2e2b28] rounded flex justify-between items-center cursor-pointer"
              onClick={() => setMobileProducts(!mobileProducts)}
            >
              <span>Products</span>
              <i
                className={`fa-solid fa-angle-${
                  mobileProducts ? "up" : "down"
                }`}
              ></i>
            </div>
            {mobileProducts && (
              <div className="pl-4">
                <Link
                  to={"/checking-account"}
                  onClick={() => setMobileMenu(false)}
                >
                  <div className="text-[#9f9f9f] py-2 px-4 hover:text-white hover:bg-[#2e2b28] rounded">
                    Checking Accounts
                  </div>
                </Link>
                <Link
                  to={"/saving-account"}
                  onClick={() => setMobileMenu(false)}
                >
                  <div className="text-[#9f9f9f] py-2 px-4 hover:text-white hover:bg-[#2e2b28] rounded">
                    Savings Accounts
                  </div>
                </Link>
                <Link to={"/credit-card"} onClick={() => setMobileMenu(false)}>
                  <div className="text-[#9f9f9f] py-2 px-4 hover:text-white hover:bg-[#2e2b28] rounded">
                    Credit Cards
                  </div>
                </Link>
              </div>
            )}
          </div>

          <Link to={"/resources"} onClick={() => setMobileMenu(false)}>
            <div className="text-white py-3 px-4 hover:bg-[#2e2b28] rounded">
              Resources
            </div>
          </Link>

          <Link to={"/support"} onClick={() => setMobileMenu(false)}>
            <div className="text-white py-3 px-4 hover:bg-[#2e2b28] rounded">
              Support
            </div>
          </Link>
        </nav>
      </div>

      {/* Desktop Products Dropdown */}
      <ul
        className={`bg-white rounded flex flex-col w-[90%] sm:w-[40%] md:w-[30%] lg:w-[20%] gap-2 absolute top-15 overflow-hidden left-4 sm:left-32 md:left-48 lg:left-60 ${
          downDrop === "Hide" ? "hidden" : "block"
        } `}
        onMouseLeave={handleLess}
      >
        <Link to={"/checking-account"}>
          <li className="p-2 hover:bg-[#eaeaea]">Checking Accounts</li>
        </Link>

        <Link to={"/saving-account"}>
          {" "}
          <li className="p-2 hover:bg-[#eaeaea]">Savings Accounts</li>
        </Link>

        <Link to={"/credit-card"}>
          {" "}
          <li className="p-2 hover:bg-[#eaeaea]">Credit Cards</li>
        </Link>
      </ul>
    </div>
  );
}

export default Header;
