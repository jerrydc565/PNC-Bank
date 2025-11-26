import React from "react";
import logo from "../assets/image/image.png";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
function Header() {
    const [downDrop, setDownDrop] = useState("Hide");
    const [isScrolled, setIsScrolled] = useState(false);
    const [isHalfScrolled, setIsHalfScrolled] = useState(false);
    
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
        className={`flex justify-between items-center p-4 absolute px-20  w-full ${
          isScrolled ? "bg-[#1e1b18e1] backdrop-blur-xl" : "bg-transparent"
        }  ${isHalfScrolled ? "bg-[#1e1b187e] backdrop-blur-[5px]" : "bg-transparent"} `}
      >
        <nav className=" flex items-center gap-6">
          <img src={logo} alt="Logo" className="mr-10" />
          <ul className="flex items-center gap-6 text-white font-medium">
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
        <Link to={"/login"}>
          {" "}
          <button className="bg-[#cb8400] duration-300 transition-all cursor-pointer hover:bg-[#6b4500]  p-1 px-10 rounded-xl text-white font-semibold ">
            Login
          </button>
        </Link>
      </header>
      <ul
        className={`bg-white rounded flex flex-col w-[20%] gap-2 absolute top-15 overflow-hidden left-60 ${
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
