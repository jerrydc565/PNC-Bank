import React from "react";

function Security() {
  return (
    <main className="bg-[#f8f8f8] pb-10">
      <section className="bg-[#ffffff6b] bg-[url('/image/pri.jpg')] bg-blend-overlay bg-cover bg-center p-20 flex justify-center items-center pt-30">
        <div>
          <h2 className="font-bold text-3xl text-black text-center">
            Security Center
          </h2>
          <hr className="w-65 mt-1 border-2 border-[#915e00]" />
          <h3 className=" text-xl text-[#915e00] text-center mt-4">
            Your security is our top priority
          </h3>
        </div>
      </section>

      <section className="flex gap-10 items-center p-10 w-full">
        <section className="w-[80%] rounded bg-white shadow p-10">
          <h2 className="font-bold text-2xl mb-9">How We Protect You</h2>
          <div className="flex gap-7 items-center mb-7">
            <button className=" w-13 h-13 rounded-xl p-2 bg-[#00860036]">
              <i className="fa-solid fa-lock text-xl text-[#008600]"></i>
            </button>
            <p className="flex flex-col gap-3">
              <span className="text-xl font-semibold ">256-bit Encryption</span>
              <span className="text-[#595959]">
                All your data is encrypted with bank-level security, both in
                transit and at rest.
              </span>
            </p>
          </div>
          <div className="flex gap-7 items-center mb-7">
            <button className=" w-13 h-13 rounded-xl p-2 bg-[#00860036]">
              {" "}
              <i className="fa-regular fa-eye text-xl text-[#008600]"></i>
            </button>
            <p className="flex flex-col gap-3">
              <span className="text-xl font-semibold ">24/7 Monitoring</span>
              <span className="text-[#595959]">
                Our advanced systems monitor your account around the clock for
                suspicious activity.
              </span>
            </p>
          </div>
          <div className="flex gap-7 items-center mb-7">
            <button className=" w-13 h-13 rounded-xl p-2 bg-[#00860036]">
              {" "}
              <i className="fa-solid fa-key text-xl text-[#008600]"></i>
            </button>
            <p className="flex flex-col gap-3">
              <span className="text-xl font-semibold ">
                Two-Factor Authentication
              </span>
              <span className="text-[#595959]">
                Add an extra layer of security with two-factor authentication
                for all logins.
              </span>
            </p>
          </div>
          <div className="flex gap-7 items-center mb-7">
            <button className=" w-13 h-13 rounded-xl p-2 bg-[#00860036]">
              {" "}
              <i className="fa-regular fa-circle-check text-xl text-[#008600]"></i>
            </button>
            <p className="flex flex-col gap-3">
              <span className="text-xl font-semibold">FDIC Insured</span>
              <span className="text-[#595959]">
                Your deposits are insured up to $250,000 by the FDIC.
              </span>
            </p>
          </div>
        </section>
        <section className=" flex flex-col gap-8 w-[40%] ">
          {" "}
          <div className="p-5 rounded-xl bg-[#ff46462e] border border-[#ff5f5fe0]">
            <h3 className="font-semibold text-xl mb-3 text-[#700000]">
              Report Suspicious Activities
            </h3>
            <p className="text-[#850000]">
              If you notice any unauthorized transactions or suspicious
              activity, contact us immediately.
            </p>
            <button className="bg-[#f60000] p-2  mt-4 w-full rounded-xl text-white hover:bg-[#5e0000] cursor-pointer">
              Report Now
            </button>
          </div>
          <div className="p-8 rounded-xl shadow bg-white">
            <h3 className="font-semibold text-xl mb-4 ">Security Resources</h3>
            <li className="text-blue-500 mb-2 list-none">
              Identity Theft Protection
            </li>
            <li className="text-blue-500 mb-2 list-none">
              Fraud Prevention Guide
            </li>
            <li className="text-blue-500 mb-2 list-none"> Security FAQs</li>
            <li className="text-blue-500 mb-2 list-none">Privacy Policy</li>
          </div>
        </section>
      </section>
      <section className="bg-white rounded p-10 shadow mx-10 mt-10 ">
        <h3 className="font-bold text-2xl mb-8">Security Tips</h3>
        <div className="w-full pl-4 border-l-3 border-blue-700 mb-7">
          <h4 className="font-semibold text-lg mb-2">Use Strong Passwords</h4>
          <p className="text-[#595959]">
            Create unique passwords with a mix of letters, numbers, and symbols.
          </p>
        </div>
        <div className="w-full pl-4 border-l-3 border-blue-700 mb-7">
          <h4 className="font-semibold text-lg mb-2">
            Enable Two-Factor Authentication
          </h4>
          <p className="text-[#595959]">
            Add an extra layer of security to your account.
          </p>
        </div>
        <div className="w-full pl-4 border-l-3 border-blue-700 mb-7">
          <h4 className="font-semibold text-lg mb-2">Be Wary of Phishing</h4>
          <p className="text-[#595959]">
            Never share your password or PIN with anyone, including bank
            employees.
          </p>
        </div>
        <div className="w-full pl-4 border-l-3 border-blue-700 mb-7">
          <h4 className="font-semibold text-lg mb-2">Monitor Your Accounts</h4>
          <p className="text-[#595959]">
            Regularly check your account activity for unauthorized transactions.
          </p>
        </div>
        <div className="w-full pl-4 border-l-3 border-blue-700 mb-3">
          <h4 className="font-semibold text-lg mb-2">Keep Software Updated</h4>
          <p className="text-[#595959]">
            Always use the latest version of our mobile app and web browser.
          </p>
        </div>
      </section>
    </main>
  );
}

export default Security;
