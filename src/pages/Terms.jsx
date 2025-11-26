import React from 'react'

function Terms() {
  return (
    <main className="bg-[#efefef] pb-10">
      <section className="bg-[#ffffffce] bg-[url('/image/pri.jpg')] bg-blend-overlay bg-cover bg-center p-20 flex justify-center items-center pt-30">
        <div>
          <h2 className="font-bold text-3xl text-black text-center">
            Terms of Service
          </h2>
          <hr className="w-65 mt-1 border-2 border-[#915e00]" />
          <h3 className=" text-xl text-[#915e00] text-center mt-4">
            Last updated: January 6, 2025
          </h3>
        </div>
      </section>
      <section className="p-10 max-w-5xl mx-auto bg-white rounded shadow flex flex-col gap-10 m-10">
        <div>
          <h3 className="font-bold text-2xl mb-5"> Agreement to Terms</h3>
          <p className="text-[#595959] ">
            By accessing or using PNCBank services, you agree to be bound by
            these Terms of Service and all applicable laws and regulations. If
            you do not agree with any of these terms, you are prohibited from
            using our services.
          </p>
        </div>
        <div>
          <h2 className="font-bold text-2xl mb-5">Account Registration</h2>
          <p className="text-[#595959] mb-3">To use our services, you must:</p>
          <li className="text-[#595959] mb-2">Be at least 18 years old</li>
          <li className="text-[#595959] mb-2">
            Provide accurate and complete information
          </li>
          <li className="text-[#595959] mb-2">
            Maintain the security of your account credentials
          </li>
          <li className="text-[#595959] mb-2">
            Accept responsibility for all activities under your account
          </li>
        </div>
        <div>
          <h2 className="font-bold text-2xl mb-5">Prohibited Activities</h2>
          <p className="text-[#595959] mb-3">You may not:</p>
          <li className="text-[#595959] mb-2">
            Use our services for any illegal purpose
          </li>
          <li className="text-[#595959] mb-2">
            Attempt to gain unauthorized access to our systems
          </li>
          <li className="text-[#595959] mb-2">
            Impersonate another person or entity
          </li>
          <li className="text-[#595959] mb-2">
            Engage in fraudulent activities
          </li>
        </div>
        <div>
          <h2 className="font-bold text-2xl mb-5">Fees and Payments</h2>
          <p className="text-[#595959] mb-3">
            Certain services may be subject to fees. You agree to pay all
            applicable fees as described in our fee schedule. We reserve the
            right to change our fees at any time with appropriate notice.
          </p>
        </div>
        <div>
          <h2 className="font-bold text-2xl mb-5">Limitation of Liability</h2>

          <p className="text-[#595959] mb-3">
            PNCBank shall not be liable for any indirect, incidental, special,
            consequential, or punitive damages resulting from your use of or
            inability to use our services.
          </p>
        </div>
        <div>
          <h2 className="font-bold text-2xl mb-5">Termination</h2>
          <p>
            We may terminate or suspend your account and access to our services
            immediately, without prior notice, for any reason, including breach
            of these Terms.
          </p>
        </div>
        <div>
          <h2 className="font-bold text-2xl mb-5">Contact Information</h2>
          <p className="text-[#595959] mb-3">
            For questions about these Terms of Service, please contact us at
            legal@pncbank.com.
          </p>
        </div>
      </section>
    </main>
  );
}

export default Terms