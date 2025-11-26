import React from "react";
import logo from "../assets/image/image.png";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <section className=" bg-[#1e1400] p-15">
      <section className=" flex justify-center items-center gap-7 pb-8 border-b border-[#303030] ">
        <div className="flex flex-col gap-4 w-full">
          <h3 className="text-xl font-bold md-5 text-white">PRODUCTS</h3>
          <ul className="flex flex-col gap-4 ">
            <Link to={"/checking-account"}>
              <li className="text-[#9f9f9f]  hover:text-white cursor-pointer duration-300 translate-all w-fit ">
               Checking
              </li>
            </Link>

            <Link to={"/saving-account"}>
              <li className="text-[#9f9f9f]  hover:text-white cursor-pointer duration-300 translate-all w-fit ">
                Savings
              </li>
            </Link>

            <Link to={"/credit-card"}>
              {" "}
              <li className="text-[#9f9f9f]  hover:text-white cursor-pointer duration-300 translate-all w-fit ">
                Credit Cards
              </li>
            </Link>
          </ul>
        </div>
        <div className="flex flex-col gap-4 w-full">
          {" "}
          <h3 className="text-xl font-bold md-5 text-white">Company</h3>
          <ul className="flex flex-col gap-4 ">
            <Link to={"/about-us"}>
              {" "}
              <li className="text-[#9f9f9f]  hover:text-white cursor-pointer duration-300 translate-all w-fit">
                About Us
              </li>
            </Link>
            <Link to={"/career"}>
              <li className="text-[#9f9f9f]  hover:text-white cursor-pointer duration-300 translate-all w-fit">
                Careers
              </li>
            </Link>
            <Link to={"/support"}>
              <li className="text-[#9f9f9f]  hover:text-white cursor-pointer duration-300 translate-all w-fit">
                Support
              </li>
            </Link>
          </ul>
        </div>
        <div className="flex flex-col gap-4 w-full">
          {" "}
          <h3 className="text-xl font-bold md-5 text-white"> LEGAL </h3>
          <ul className="flex flex-col gap-4 ">
            <Link to={"/privacy"}>
              {" "}
              <li className="text-[#9f9f9f]  hover:text-white cursor-pointer duration-300 translate-all w-fit ">
                Privacy Policy
              </li>
            </Link>
            <Link to={"/terms"}>
              <li className="text-[#9f9f9f]  hover:text-white cursor-pointer duration-300 translate-all w-fit ">
              Terms of Service
              </li>
            </Link>
            <Link to={"/security"}>
              <li className="text-[#9f9f9f]  hover:text-white cursor-pointer duration-300 translate-all w-fit ">
                Security
              </li>
            </Link>
          </ul>
        </div>
        
        <div className="flex flex-col gap-4 w-full">
          <Link to={"/"}>
            <img src={logo} alt="" className="w-25" />
          </Link>

          <p className="text-white">
            Making banking smarter, faster, and more secure for millions of
            customers worldwide.
          </p>
          <div className="flex gap-4 items-center mt-4">
            <i className="fa-brands fa-facebook-f text-[#9f9f9f] hover:text-white cursor-pointer duration-300 translate-all text-lg"></i>
            <i className="fa-brands fa-instagram  text-[#9f9f9f] hover:text-white cursor-pointer duration-300 translate-all text-lg "></i>
            <i className="fa-brands fa-linkedin-in  text-[#9f9f9f] hover:text-white cursor-pointer duration-300 translate-all text-lg"></i>
            <i className="fa-brands fa-x-twitter  text-[#9f9f9f] hover:text-white cursor-pointer duration-300 translate-all text-lg"></i>
          </div>
        </div>
      </section>
      <p className="text-center text-[#959595] mt-12">
        ©2025 The PNC Financial Services Group, Inc. All rights reserved.
      </p>
    </section>
  );
}

export default Footer;
