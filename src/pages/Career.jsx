import React from "react";

function Career() {
  return (
    <main className="bg-[#eaeaea] pb-10">
      <section className="bg-linear-to-r from-[#a76d00] to-[#1d1300] p-10 sm:p-20 flex justify-center items-center pt-16 sm:pt-30">
        <div>
          <h2 className="font-bold text-2xl sm:text-3xl text-white text-center">
            Career At
          </h2>
          <h3 className="font-semibold text-xl text-white text-center mt-4">
            PNC Bank
          </h3>
        </div>
      </section>
      <section className="bg-white rounded shadow max-w-5xl mx-auto p-6 sm:p-10 my-6 sm:my-10 mx-4">
        <h2 className="font-bold text-2xl sm:text-3xl lg:text-4xl mb-2 sm:mb-3">
          Why Work at PNC Bank?
        </h2>
        <p className="text-sm sm:text-base text-[#595959] mb-6 sm:mb-9">
          At PNC Bank, we're building more than just a bank—we're creating a
          company where talented people can grow, innovate, and make a real
          impact on millions of customers' lives.
        </p>
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="flex gap-3 items-center">
            <button className="rounded-xl w-15 h-15 p-2 bg-[#c7810065]">
              <i className="fa-regular fa-heart text-3xl text-[#c78100]"></i>
            </button>
            <p className="flex flex-col gap8">
              <span className="font-bold text-lg">Great Benefits</span>{" "}
              <span className="text-[#595959]">
                Comprehensive health insurance, 401(k) matching, and generous
                PTO
              </span>
            </p>
          </div>
          <div className="flex gap-3 items-center">
            <button className="rounded-xl w-15 h-15 p-2 bg-[#c7810065]">
              <i className="fa-solid fa-arrow-trend-up text-3xl text-[#c78100]"></i>
            </button>
            <p className="flex flex-col gap8">
              <span className="font-bold text-lg">Career Growth</span>{" "}
              <span className="text-[#595959]">
                Clear advancement paths and professional development
                opportunities
              </span>
            </p>
          </div>
          <div className="flex gap-3 items-center">
            <button className="rounded-xl w-15 h-15 p-2 bg-[#c7810065]">
              <i className="fa-solid fa-user-group text-3xl text-[#c78100]"></i>
            </button>
            <p className="flex flex-col gap8">
              <span className="font-bold text-lg">Inclusive Culture</span>{" "}
              <span className="text-[#595959]">
                {" "}
                Diverse, welcoming environment where everyone belongs
              </span>
            </p>
          </div>
          <div className="flex gap-3 items-center">
            <button className="rounded-xl w-15 h-15 p-2 bg-[#c7810061]">
              <i className="fa-solid fa-suitcase text-3xl text-[#c78100]"></i>
            </button>
            <p className="flex flex-col gap8">
              <span className="font-bold text-lg">Flexible Work</span>{" "}
              <span className="text-[#595959]">
                {" "}
                Hybrid and remote options available for many roles
              </span>
            </p>
          </div>
        </section>
      </section>
      <section className="bg-white rounded shadow max-w-5xl mx-auto p-10 my-10 ">
        <h2 className="font-bold text-4xl mb-7">Open Positions</h2>

        <section className="flex flex-col gap-6">
          <div className="p-8 rounded-xl border border-[#d3d3d3] hover:border-[#c78100] w-full">
            <h3 className="flex justify-between items-center">
              <span className="font-bold text-xl mb-6">
                Senior Software Engineer
              </span>
              <span className="text-lg font-semibold text-[#c78100] hover:text-[#905d00] cursor-pointer flex gap-3 items-center">
                Apply
                <i class="fa-solid fa-arrow-right"></i>
              </span>
            </h3>
            <li className="mb-4 text-[#595959] list-none ">
              Engineering • San Francisco, CA • Full-time
            </li>
            <p className=" text-[#595959]">
              Build and scale our next-generation banking platform
            </p>
          </div>
          <div className="p-8 rounded-xl border border-[#d3d3d3] hover:border-[#c78100] w-full">
            <h3 className="flex justify-between items-center">
              <span className="font-bold text-xl mb-6">Product Manager</span>
              <span className="text-lg font-semibold text-[#c78100] hover:text-[#905d00] cursor-pointer flex gap-3 items-center">
                Apply
                <i className="fa-solid fa-arrow-right"></i>
              </span>
            </h3>
            <li className="mb-4 text-[#595959] list-none">
              Product • New York, NY • Full-time
            </li>
            <p className=" text-[#595959]">
              Lead product strategy for our mobile banking experience
            </p>
          </div>
          <div className="p-8 rounded-xl border border-[#d3d3d3] hover:border-[#c78100] w-full">
            <h3 className="flex justify-between items-center">
              <span className="font-bold text-xl mb-6">
                Customer Success Manager
              </span>
              <span className="text-lg font-semibold text-[#c78100] hover:text-[#905d00] cursor-pointer flex gap-3 items-center">
                Apply
                <i className="fa-solid fa-arrow-right"></i>
              </span>
            </h3>
            <li className="mb-4 list-none text-[#595959]">
              Customer Success • Remote • Full-time
            </li>
            <p className=" text-[#595959]">
              Help our customers achieve their financial goals
            </p>
          </div>
        </section>
      </section>
    </main>
  );
}

export default Career;
