import React from "react";
import { motion } from "framer-motion";

const fadeInUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

function Security() {
  return (
    <main className="bg-[#f8f8f8] pb-10">
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeInUp}
        className="bg-[#ffffff6b] bg-[url('/image/pri.jpg')] bg-blend-overlay bg-cover bg-center p-6 sm:p-10 lg:p-20 flex justify-center items-center pt-20 sm:pt-24 lg:pt-30"
      >
        <div>
          <h2 className="font-bold text-2xl sm:text-3xl text-black text-center">
            Security Center
          </h2>
          <hr className="w-40 sm:w-52 lg:w-65 mt-1 border-2 border-[#915e00] mx-auto" />
          <h3 className="text-base sm:text-lg lg:text-xl text-[#915e00] text-center mt-4">
            Your security is our top priority
          </h3>
        </div>
      </motion.section>

      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeInUp}
        className="flex flex-col lg:flex-row gap-6 sm:gap-8 lg:gap-10 items-start p-4 sm:p-6 lg:p-10 w-full"
      >
        <section className="w-full lg:w-[80%] rounded bg-white shadow p-6 sm:p-8 lg:p-10">
          <h2 className="font-bold text-xl sm:text-2xl mb-6 sm:mb-9">
            How We Protect You
          </h2>
          <div className="flex gap-4 sm:gap-6 lg:gap-7 items-center mb-6 sm:mb-7">
            <button className="w-12 h-12 sm:w-13 sm:h-13 rounded-xl p-2 bg-[#00860036] shrink-0">
              <i className="fa-solid fa-lock text-lg sm:text-xl text-[#008600]"></i>
            </button>
            <p className="flex flex-col gap-2 sm:gap-3">
              <span className="text-lg sm:text-xl font-semibold">
                256-bit Encryption
              </span>
              <span className="text-sm sm:text-base text-[#595959]">
                All your data is encrypted with bank-level security, both in
                transit and at rest.
              </span>
            </p>
          </div>
          <div className="flex gap-4 sm:gap-6 lg:gap-7 items-center mb-6 sm:mb-7">
            <button className="w-12 h-12 sm:w-13 sm:h-13 rounded-xl p-2 bg-[#00860036] shrink-0">
              {" "}
              <i className="fa-regular fa-eye text-lg sm:text-xl text-[#008600]"></i>
            </button>
            <p className="flex flex-col gap-2 sm:gap-3">
              <span className="text-lg sm:text-xl font-semibold">
                24/7 Monitoring
              </span>
              <span className="text-sm sm:text-base text-[#595959]">
                Our advanced systems monitor your account around the clock for
                suspicious activity.
              </span>
            </p>
          </div>
          <div className="flex gap-4 sm:gap-6 lg:gap-7 items-center mb-6 sm:mb-7">
            <button className="w-12 h-12 sm:w-13 sm:h-13 rounded-xl p-2 bg-[#00860036] shrink-0">
              {" "}
              <i className="fa-solid fa-key text-lg sm:text-xl text-[#008600]"></i>
            </button>
            <p className="flex flex-col gap-2 sm:gap-3">
              <span className="text-lg sm:text-xl font-semibold">
                Two-Factor Authentication
              </span>
              <span className="text-sm sm:text-base text-[#595959]">
                Add an extra layer of security with two-factor authentication
                for all logins.
              </span>
            </p>
          </div>
          <div className="flex gap-4 sm:gap-6 lg:gap-7 items-center mb-6 sm:mb-7">
            <button className="w-12 h-12 sm:w-13 sm:h-13 rounded-xl p-2 bg-[#00860036] shrink-0">
              {" "}
              <i className="fa-regular fa-circle-check text-lg sm:text-xl text-[#008600]"></i>
            </button>
            <p className="flex flex-col gap-2 sm:gap-3">
              <span className="text-lg sm:text-xl font-semibold">
                FDIC Insured
              </span>
              <span className="text-sm sm:text-base text-[#595959]">
                Your deposits are insured up to $250,000 by the FDIC.
              </span>
            </p>
          </div>
        </section>
        <section className="flex flex-col gap-6 sm:gap-8 w-full lg:w-[40%]">
          {" "}
          <div className="p-4 sm:p-5 rounded-xl bg-[#ff46462e] border border-[#ff5f5fe0]">
            <h3 className="font-semibold text-lg sm:text-xl mb-3 text-[#700000]">
              Report Suspicious Activities
            </h3>
            <p className="text-sm sm:text-base text-[#850000]">
              If you notice any unauthorized transactions or suspicious
              activity, contact us immediately.
            </p>
            <button className="bg-[#f60000] p-2 mt-4 w-full rounded-xl text-white hover:bg-[#5e0000] cursor-pointer text-sm sm:text-base">
              Report Now
            </button>
          </div>
          <div className="p-6 sm:p-8 rounded-xl shadow bg-white">
            <h3 className="font-semibold text-lg sm:text-xl mb-4">
              Security Resources
            </h3>
            <li className="text-blue-500 mb-2 list-none text-sm sm:text-base">
              Identity Theft Protection
            </li>
            <li className="text-blue-500 mb-2 list-none text-sm sm:text-base">
              Fraud Prevention Guide
            </li>
            <li className="text-blue-500 mb-2 list-none text-sm sm:text-base">
              {" "}
              Security FAQs
            </li>
            <li className="text-blue-500 mb-2 list-none text-sm sm:text-base">
              Privacy Policy
            </li>
          </div>
        </section>
      </motion.section>
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={staggerContainer}
        className="bg-white rounded p-6 sm:p-8 lg:p-10 shadow mx-4 sm:mx-6 lg:mx-10 mt-6 sm:mt-8 lg:mt-10"
      >
        <h3 className="font-bold text-xl sm:text-2xl mb-6 sm:mb-8">
          Security Tips
        </h3>
        <div className="w-full pl-3 sm:pl-4 border-l-2 sm:border-l-3 border-blue-700 mb-5 sm:mb-7">
          <h4 className="font-semibold text-base sm:text-lg mb-2">
            Use Strong Passwords
          </h4>
          <p className="text-sm sm:text-base text-[#595959]">
            Create unique passwords with a mix of letters, numbers, and symbols.
          </p>
        </div>
        <div className="w-full pl-3 sm:pl-4 border-l-2 sm:border-l-3 border-blue-700 mb-5 sm:mb-7">
          <h4 className="font-semibold text-base sm:text-lg mb-2">
            Enable Two-Factor Authentication
          </h4>
          <p className="text-sm sm:text-base text-[#595959]">
            Add an extra layer of security to your account.
          </p>
        </div>
        <div className="w-full pl-3 sm:pl-4 border-l-2 sm:border-l-3 border-blue-700 mb-5 sm:mb-7">
          <h4 className="font-semibold text-base sm:text-lg mb-2">
            Be Wary of Phishing
          </h4>
          <p className="text-sm sm:text-base text-[#595959]">
            Never share your password or PIN with anyone, including bank
            employees.
          </p>
        </div>
        <div className="w-full pl-3 sm:pl-4 border-l-2 sm:border-l-3 border-blue-700 mb-5 sm:mb-7">
          <h4 className="font-semibold text-base sm:text-lg mb-2">
            Monitor Your Accounts
          </h4>
          <p className="text-sm sm:text-base text-[#595959]">
            Regularly check your account activity for unauthorized transactions.
          </p>
        </div>
        <div className="w-full pl-3 sm:pl-4 border-l-2 sm:border-l-3 border-blue-700 mb-3">
          <h4 className="font-semibold text-base sm:text-lg mb-2">
            Keep Software Updated
          </h4>
          <p className="text-sm sm:text-base text-[#595959]">
            Always use the latest version of our mobile app and web browser.
          </p>
        </div>
      </motion.section>
    </main>
  );
}

export default Security;
