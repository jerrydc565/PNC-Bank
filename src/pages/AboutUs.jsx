import React from 'react'

function AboutUs() {
  return (
    <main className="bg-[#f3f3f3] pb-10">
      <section className="bg-linear-to-r from-[#a76d00] to-[#1d1300] p-20 flex justify-center items-center pt-30">
        <div>
          <h2 className="font-bold text-3xl text-white text-center">About</h2>
          <h3 className="font-semibold text-xl text-white text-center mt-4">
            PNC Bank
          </h3>
        </div>
      </section>
      <section className="m-10 p-10  mx-20 bg-white rounded shadow ">
        <h1 className="font-bold text-4xl mb-6  "> Our Story</h1>
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
      </section>
      <section
        className="mt-7 grid grid-cols-1 
       items-center sm:grid-cols-2 md:grid-cols-4 gap-7 p-10 px-20 "
      >
        <div className="bg-white rounded-xl p-5 shadow w-full flex flex-col gap-5 items-center justify-center">
          <button className="w-15 h-15 p-2 rounded-full bg-[#c782005e]">
            <i className="fa-solid fa-users text-3xl text-[#c78100]"></i>
          </button>
          <h2 className="font-bold text-3xl">2M+</h2>
          <p className="text-[#595959] ">customer</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow  flex w-full flex-col gap-5 items-center justify-center">
          <button className="w-15 h-15 p-2 rounded-full bg-[#c782005e]">
            <i className="fa-solid fa-arrows-to-circle text-3xl text-[#c78100]"></i>
          </button>
          <h2 className="font-bold text-3xl">500+</h2>
          <p className="text-[#595959] ">Branch Locations</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow  flex w-full flex-col gap-5 items-center justify-center">
          <button className="w-15 h-15 p-2 rounded-full bg-[#c782005e]">
            <i className="fa-solid fa-medal text-3xl text-[#c78100]"></i>
          </button>
          <h2 className="font-bold text-3xl">50+</h2>
          <p className="text-[#595959] ">Industry Awards</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow  flex w-full flex-col gap-5 items-center justify-center">
          <button className="w-15 h-15 p-2 rounded-full bg-[#c782005e]">
            <i className="fa-solid fa-arrow-trend-up text-3xl text-[#c78100]"></i>
          </button>
          <h2 className="font-bold text-3xl">$50B+</h2>
          <p className="text-[#595959] ">Assets Under Management</p>
        </div>
      </section>
      <section className="mt-10  mx-20 p-10 rounded bg-white">
        <h2 className="font-bold text-3xl mt-2 mb-5">Our Values</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
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
      </section>
    </main>
  );
}

export default AboutUs