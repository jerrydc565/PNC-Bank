import React from "react";
import { motion } from "framer-motion";
import support from "../assets/image/support.jpg";
import { useState } from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";

const fadeInUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

function Support() {
  const [showMap, setSetMap] = useState(false);

  const handleShowMap = () => {
    if (showMap === false) {
      setSetMap(true);
    } else {
      setSetMap(false);
    }
  };

  const handleHideMap = () => {
    if (showMap === true) {
      setSetMap(false);
    } else {
      setSetMap(true);
    }
  };

  useEffect(() => {
    if (showMap === true) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [showMap]);

  return (
    <main className="bg-white">
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeInUp}
        className="bg-linear-to-r from-[#563800] to-[#1d1300]"
      >
        <section className="p-4 sm:p-6 lg:p-10 pt-25 sm:pt-20 lg:pt-30 min-h-[200px] sm:h-130 flex flex-col lg:flex-row items-center pb-10 justify-between gap-6 max-w-5xl 2xl:max-w-7xl mx-auto w-full">
          <div className="w-full lg:w-[50%]">
            {" "}
            <h1 className="text-white font-bold text-2xl sm:text-3xl lg:text-4xl mb-3 sm:mb-4 2xl:text-5xl">
              We're here to help
            </h1>
            <p className="text-[#bebebe] text-sm sm:text-base lg:text-lg max-w-xl">
              Get the support you need, when you need it. Our customer service
              team is available 24/7 to assist you.
            </p>
          </div>
          <div className="hidden lg:block">
            {" "}
            <img
              src={support}
              alt=""
              className="w-full max-w-md lg:w-100 2xl:w-130 rounded-2xl"
            />
          </div>
        </section>
      </motion.section>

      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeInUp}
        className="pt-10 sm:pt-20 relative"
      >
        <h1 className="font-black text-xl sm:text-2xl mb-2 sm:mb-3 text-center">
          Contact us{" "}
        </h1>
        <p className="text-center text-sm sm:text-base text-[#595959]">
          Choose the best way to reach us
        </p>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 p-4 sm:p-6 lg:p-10 max-w-6xl mx-auto">
          <div className="bg-white hover:shadow-2xl rounded-2xl p-10 text-center w-full">
            <button className="w-15 h-15 p-2 rounded-full bg-[#c781006e]">
              <i className="fa-regular fa-comment text-3xl text-[#c78100] "></i>
            </button>
            <p className="text-xl font-semibold mt-4 mb-3"> Live Chat </p>
            <p className="text-[#595959] mb-4 ">Chat with an agent</p>
            <li className="list-none font-medium text-[#c78200] hover:text-[#986300] cursor-pointer ">
              Start Chat
            </li>
          </div>
          <div className="bg-white hover:shadow-2xl rounded-2xl p-10 text-center w-full">
            <button className="w-15 h-15 p-2 rounded-full bg-[#c781006e]">
              <i className="fa-regular fa-envelope text-3xl text-[#c78100]"></i>
            </button>
            <p className="text-xl font-semibold mt-4 mb-3">Email</p>
            <p className="text-[#595959] mb-4 ">Response within 24 hours</p>
            <a href="mailto:jerrydc56538@gmail.com" className="">
              <li className="list-none font-medium text-[#c78200] hover:text-[#986300] cursor-pointer ">
                support@PNCBank.com
              </li>
            </a>
          </div>
          <div className="bg-white hover:shadow-2xl rounded-2xl p-10 text-center w-full">
            <button className="w-15 h-15 p-2 rounded-full bg-[#c781006e]">
              <i className="fa-solid fa-location-dot text-3xl text-[#c78100]"></i>
            </button>
            <p className="text-xl font-semibold mt-4 mb-3">Branch</p>
            <p className="text-[#595959] mb-4 "> visit us in person</p>
            <li
              className="list-none font-medium text-[#c78200] hover:text-[#986300] cursor-pointer "
              onClick={handleShowMap}
            >
              Find Location
            </li>
          </div>
        </section>
        <div
          className={`flex justify-center items-center w-full h-screen fixed top-0 left-0 z-50 bg-[#000000c1] cursor-pointer p-4 ${
            showMap === false ? "hidden" : "block"
          }`}
          onClick={handleHideMap}
        >
          <div className="relative w-full h-full max-w-7xl max-h-[90vh] flex items-center justify-center">
            <button
              className="absolute top-4 right-4 z-10 bg-white hover:bg-gray-200 text-gray-800 font-bold rounded-full w-10 h-10 flex items-center justify-center shadow-lg"
              onClick={handleHideMap}
            >
              <i className="fa-solid fa-xmark text-xl"></i>
            </button>
            <iframe
              className="rounded-2xl w-full h-full"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d50103184.48591061!2d-148.9996136!3d39.962507500000015!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c6c7cb9df49c79%3A0xdadf335533ab7488!2sPNC%20Bank!5e0!3m2!1sen!2sng!4v1762962947400!5m2!1sen!2sng"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              onClick={(e) => e.stopPropagation()}
            ></iframe>
          </div>
        </div>
      </motion.section>
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeInUp}
      >
        <h2 className="font-black text-xl sm:text-2xl text-center mt-10 sm:mt-20 mb-3 sm:mb-4">
          Frequently Asked Questions
        </h2>
        <p className="text-[#595959] text-center text-sm sm:text-base">
          Quick answers to common questions
        </p>
      </motion.section>
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeInUp}
        className="mt-6 sm:mt-9 flex flex-col gap-4 sm:gap-5 max-w-3xl mx-auto px-4 sm:px-6"
      >
        <div className="shadow-md rounded-xl p-6 sm:p-10 w-full">
          <p className="font-semibold text-xl mb-2">
            How do I reset my password?
          </p>
          <p className="text-[#595959]  ">
            Click on "Forgot Password" on the login page and follow the
            instructions sent to your email.
          </p>
        </div>
        <div className="shadow-md rounded-xl p-10 pr-20 w-full">
          <p className="font-semibold text-xl mb-2">
            What are your business hours?
          </p>
          <p className="text-[#595959]  ">
            Our phone support is available 24/7. Branch locations are open
            Monday-Friday 9 AM - 5 PM, and Saturday 9 AM - 1 PM.
          </p>
        </div>
        <div className="shadow-md rounded-xl p-10 pr-20 w-full">
          <p className="font-semibold text-xl mb-2">
            How do I report a lost or stolen card?
          </p>
          <p className="text-[#595959]  ">
            Call us immediately at 1-800-BANKSMRT or use the mobile app to lock
            your card instantly.
          </p>
        </div>
        <div className="shadow-md rounded-xl p-10 pr-20 w-full">
          <p className="font-semibold text-xl mb-2">
            How long does a transfer take?
          </p>
          <p className="text-[#595959]  ">
            Internal transfers are instant. External transfers typically take
            1-3 business days.
          </p>
        </div>
        <div className="shadow-md rounded-xl p-10 pr-20 w-full">
          <p className="font-semibold text-xl mb-2">
            Are there any monthly fees?
          </p>
          <p className="text-[#595959]  ">
            Our Basic Checking account has no monthly fees. Premium and Elite
            accounts have monthly fees that can be waived with minimum balance
            requirements.
          </p>
        </div>
      </motion.section>

      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeInUp}
        className="p-10 m-20 flex flex-col gap-7 rounded-2xl  bg-[#c781001d] "
      >
        <h3 className="font-bold text-2xl">Support Hours</h3>

        <p className=" text-[#595959]">
          <span className="font-bold "> Live Chat: </span>
          Monday - Sunday, 6 AM - 12 AM EST
        </p>
        <p className=" text-[#595959]">
          <span className="font-bold "> Email: </span>
          Responses wthin 24 hours
        </p>
        <p className=" text-[#595959]">
          <span className="font-bold "> Branch Location: </span>
          Monday - Friday, 9 AM - 5 PM | Saturday, 9 AM - 1 PM
        </p>
      </motion.section>
    </main>
  );
}

export default Support;
