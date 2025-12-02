import React, { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";

const fadeInUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const CountUpNumber = ({ end, suffix = "" }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const duration = 2000; // 2 seconds
      const increment = end / (duration / 16); // 60fps

      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);

      return () => clearInterval(timer);
    }
  }, [isInView, end]);

  return (
    <h2 ref={ref} className="font-bold text-3xl">
      {count}
      {suffix}
    </h2>
  );
};

function AboutUs() {
  return (
    <main className="bg-[#f3f3f3] pb-10">
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeInUp}
        className="bg-linear-to-r from-[#a76d00] to-[#1d1300] p-10 sm:p-20 flex justify-center items-center pt-16 sm:pt-30"
      >
        <div>
          <h2 className="font-bold text-2xl sm:text-3xl text-white text-center">
            About
          </h2>
          <h3 className="font-semibold text-lg sm:text-xl text-white text-center mt-3 sm:mt-4">
            PNC Bank
          </h3>
        </div>
      </motion.section>
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeInUp}
        className="m-4 sm:m-6 lg:m-10 p-6 sm:p-10 mx-4 sm:mx-10 lg:mx-20 bg-white rounded shadow"
      >
        <h1 className="font-bold text-2xl sm:text-3xl lg:text-4xl mb-4 sm:mb-6">
          {" "}
          Our Story
        </h1>
        <p className="text-[#595959] mb-7">
          Founded in 2015, PNC was created with a simple mission: to make
          banking easier, faster, and more accessible for everyone. We
          recognized that traditional banking was outdated and frustrating, so
          we set out to build something better.
        </p>
        <p className="text-[#595959] mb-7">
          Today, we serve over 2 million customers across the country, providing
          innovative financial solutions that put our customers first. From our
          industry-leading mobile app to our 24/7 customer support, everything
          we do is designed to make your financial life simpler.
        </p>
        <p className="text-[#595959] ">
          We're not just a bank—we're your financial partner, committed to
          helping you achieve your goals and secure your future.
        </p>
      </motion.section>
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeInUp}
        className="mt-6 sm:mt-7 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-7 p-4 sm:p-6 lg:p-10 px-4 sm:px-10 lg:px-20"
      >
        <div className="bg-white rounded-xl p-5 shadow w-full flex flex-col gap-5 items-center justify-center">
          <button className="w-15 h-15 p-2 rounded-full bg-[#c782005e]">
            <i className="fa-solid fa-users text-3xl text-[#c78100]"></i>
          </button>
          <CountUpNumber end={2} suffix="M+" />
          <p className="text-[#595959] ">customer</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow  flex w-full flex-col gap-5 items-center justify-center">
          <button className="w-15 h-15 p-2 rounded-full bg-[#c782005e]">
            <i className="fa-solid fa-arrows-to-circle text-3xl text-[#c78100]"></i>
          </button>
          <CountUpNumber end={500} suffix="+" />
          <p className="text-[#595959] ">Branch Locations</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow  flex w-full flex-col gap-5 items-center justify-center">
          <button className="w-15 h-15 p-2 rounded-full bg-[#c782005e]">
            <i className="fa-solid fa-medal text-3xl text-[#c78100]"></i>
          </button>
          <CountUpNumber end={50} suffix="+" />
          <p className="text-[#595959] ">Industry Awards</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow  flex w-full flex-col gap-5 items-center justify-center">
          <button className="w-15 h-15 p-2 rounded-full bg-[#c782005e]">
            <i className="fa-solid fa-arrow-trend-up text-3xl text-[#c78100]"></i>
          </button>
          <CountUpNumber end={50} suffix="B+" />
          <p className="text-[#595959] ">Assets Under Management</p>
        </div>
      </motion.section>
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeInUp}
        className="mt-6 sm:mt-10 mx-4 sm:mx-10 lg:mx-20 p-6 sm:p-10 rounded bg-white"
      >
        <h2 className="font-bold text-2xl sm:text-3xl mt-2 mb-4 sm:mb-5">
          Our Values
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          <section>
            <h3 className="font-bold text-xl mb-3">Customer First</h3>
            <p className="text-[#595959]">
              Every decision we make starts with our customers. Your success is
              our success.
            </p>
          </section>
          <section>
            <h3 className="font-bold text-xl mb-3">Innovation</h3>
            <p className="text-[#595959]">
              We continuously evolve and improve our services to meet the
              changing needs of modern banking.
            </p>
          </section>
          <section>
            <h3 className="font-bold text-xl mb-3">Integrity</h3>
            <p className="text-[#595959]">
              We operate with transparency, honesty, and the highest ethical
              standards.
            </p>
          </section>
        </div>
      </motion.section>
    </main>
  );
}

export default AboutUs;
