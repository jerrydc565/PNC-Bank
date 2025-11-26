import React from 'react'

function Privacy() {
  return (
    <main className="bg-[#efefef] pb-10">
      <section className="bg-[#ffffffce] bg-[url('/image/pri.jpg')] bg-blend-overlay bg-cover bg-center p-20 flex justify-center items-center pt-30">
        <div>
          <h2 className="font-bold text-3xl text-black text-center">
            Pivacy Policy
          </h2>
          <hr className="w-65 mt-1 border-2 border-[#915e00]" />
          <h3 className=" text-xl text-[#915e00] text-center mt-4">
            Last updated: January 6, 2025
          </h3>
        </div>
      </section>
      <section className="p-10 max-w-5xl mx-auto bg-white rounded shadow flex flex-col gap-10 m-10">
        <div>
          <h3 className="font-bold text-2xl mb-5"> Introduction</h3>
          <p className="text-[#595959] ">
            At PNCBank, we take your privacy seriously. This Privacy Policy
            explains how we collect, use, disclose, and safeguard your
            information when you use our banking services.
          </p>
        </div>
        <div>
          <h2 className="font-bold text-2xl mb-5">Information We Collect</h2>
          <p className="text-[#595959] mb-3">
            We collect information that you provide directly to us, including:
          </p>
          <li className="text-[#595959] mb-2">
            Personal identification information (name, email address, phone
            number, etc.)
          </li>
          <li className="text-[#595959] mb-2">
            Financial information (account numbers, transaction history, etc.)
          </li>
          <li className="text-[#595959] mb-2">
            Technical information (IP address, browser type, device information)
          </li>
          <li className="text-[#595959] mb-2">
            Usage data (how you interact with our services)
          </li>
        </div>
        <div>
          <h2 className="font-bold text-2xl mb-5">
            How We Use Your Information
          </h2>
          <p className="text-[#595959] mb-3">
            We use the information we collect to:
          </p>
          <li className="text-[#595959] mb-2">
            Provide, maintain, and improve our services
          </li>
          <li className="text-[#595959] mb-2">
            Process transactions and send related information
          </li>
          <li className="text-[#595959] mb-2">
            Send you technical notices and support messages
          </li>
          <li className="text-[#595959] mb-2">
            Respond to your comments and questions
          </li>
          <li className="text-[#595959] mb-2">
            Protect against fraudulent or illegal activity
          </li>
        </div>
        <div>
          <h2 className="font-bold text-2xl mb-5">Information Sharing</h2>
          <p className="text-[#595959] mb-3">
            We do not sell your personal information. We may share your
            information only in the following circumstances: with your consent,
            to comply with legal obligations, to protect our rights, or with
            service providers who assist us in operating our business.
          </p>
        </div>
        <div>
          <h2 className="font-bold text-2xl mb-5">Data Security</h2>

          <p className="text-[#595959] mb-3">
            We implement appropriate technical and organizational measures to
            protect your personal information against unauthorized access,
            alteration, disclosure, or destruction. However, no method of
            transmission over the Internet is 100% secure.
          </p>
        </div>
        <div>
          <h2 className="font-bold text-2xl mb-5">Your Rights</h2>
          <p>You have the right to:</p>
          <li className="text-[#595959] mb-2">
            Access and receive a copy of your personal information
          </li>
          <li className="text-[#595959] mb-2">
            Correct inaccurate personal information
          </li>
          <li className="text-[#595959] mb-2">
            Request deletion of your personal information
          </li>
          <li className="text-[#595959] mb-2">
            Object to or restrict certain processing of your information
          </li>
          <li className="text-[#595959] mb-2">
            Withdraw consent where we rely on consent to process your
            information
          </li>
        </div>
        <div>
          <h2 className="font-bold text-2xl mb-5">Contact Us</h2>
          <p className="text-[#595959] mb-3">
            If you have questions about this Privacy Policy, please contact us
            at privacy@pncbank.com .
          </p>
        </div>
      </section>
    </main>
  );
}

export default Privacy