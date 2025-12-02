import React from "react";
import addimg from "../assets/image/png1.png";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messageType, setMessageType] = useState("");

  // no automatic fetch on mount

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    setMessageType("");
    try {
      console.log("📧 Logging in with:", formData.email); // ✅ Debug

      const response = await fetch("https://pnc-bank-backend-2.onrender.com/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      console.log("📦 Login response:", data);
      console.log("🔍 Full backend response:", data);
      console.log("🔍 data.success:", data.success);
      console.log("🔍 data.firstName:", data.firstName);
      console.log("🔍 data.secondName:", data.secondName);
      // backend follows same shape as signup: { success: boolean, message: string, ... }
      if (data.success) {
        setMessage(data.message);
        setMessageType("success");

        localStorage.clear();
        console.log("userId:", localStorage.getItem("userId"));
        console.log("💾 Storing firstName:", data.firstName); // ✅ Debug
        console.log("💾 Storing secondName:", data.secondName); // ✅ Debug
        console.log("💾 Storing email:", data.email); // ✅ Debug
        localStorage.setItem("firstName", data.firstName);
        localStorage.setItem("userId", data.userId);
        localStorage.setItem("secondName", data.secondName);
        localStorage.setItem("email", data.email);
        if (data.accountNumber) {
          localStorage.setItem("accountNumber", data.accountNumber);
        }

        console.log("✅ Stored in localStorage");
        console.log(
          "📖 Verify - firstName:",
          localStorage.getItem("firstName")
        );
        console.log(
          "📖 Verify - secondName:",
          localStorage.getItem("secondName")
        );

        setTimeout(() => {
          window.location.href = "/user-home";
        }, 1000);
      } else {
        setMessage(data.message);
        setMessageType("error");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("Error connecting to server: " + error.message);
      setMessageType("error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="w-full min-h-screen flex flex-col md:flex-row gap-0 md:gap-10">
      <section className="bg-[url('/image/abstractbg.png')] md:hidden bg-blend-overlay bg-[#000000c4] w-full md:w-[50%] bg-cover h-40 md:h-full bg-center"></section>
      <section className="w-full  md:bg-[url('/image/abstractbg.png')] md:bg-blend-overlay md:bg-[#000000c4] md:bg-cover md:bg-center md:w-full flex flex-col justify-center items-center relative gap-3 sm:gap-5 p-4 sm:p-6">
        <h2 className="font-bold text-xl sm:text-2xl text-[#5d2700] mb-2 sm:mb-5">
          PNC Bank{" "}
        </h2>
        <h1 className="font-bold text-3xl sm:text-4xl md:text-5xl text-[#cb8400] mb-3 sm:mb-5">
          Welcome back
        </h1>
        <form
          className="w-full sm:w-[80%] md:w-[60%] z-100"
          onSubmit={handleSubmit}
        >
          <div className="mb-4 sm:mb-5 flex gap-1 flex-col">
            <label
              htmlFor="email"
              className="font-bold md:text-white text-[#453926] mb-1 text-sm sm:text-base"
            >
              Email
            </label>
            <div className="border bg-white border-[#727272] rounded focus:border-[#cb8400] flex items-center">
              <i className="fa-regular fa-envelope text-[#595959] text-base sm:text-lg m-2 sm:m-3"></i>
              <input
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                min={6}
                max={30}
                name="email"
                placeholder="Enter your email "
                className="w-full p-2 sm:p-3 outline-none text-sm sm:text-base"
              />
            </div>
          </div>

          <div className="mb-4 sm:mb-5 flex gap-1 flex-col">
            <label
              htmlFor="password"
              className="font-bold md:text-white   text-[#371E30] mb-1 text-sm sm:text-base"
            >
              Password
            </label>
            <div className="border bg-white border-[#727272] rounded focus:border-[#cb8400] flex items-center">
              <i className="fa-solid fa-lock text-[#595959] text-base sm:text-lg m-2 sm:m-3"></i>
              <input
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                min={8}
                max={26}
                name="password"
                placeholder="Enter a password"
                className="w-full p-2 sm:p-3 outline-none text-sm sm:text-base"
              />
            </div>
          </div>
          <p className="text-center mt-3 sm:mt-5 text-sm sm:text-base">
            <Link
              to="/forgot-password"
              className="text-[#cb8400] font-bold hover:text-[#996300]"
            >
              Forgot password?
            </Link>
          </p>
          <button
            className="w-full bg-[#cb8400] mt-3 text-white font-bold p-2 sm:p-3 z-50 rounded hover:bg-[#b36e00] active:bg-[#9c5f00] text-sm sm:text-base"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
          <p className="text-center md:text-white mt-3 sm:mt-5 text-sm sm:text-base">
            Don't have an account?{" "}
            <Link to="/signup" className="text-[#cb8400] font-bold">
              Register
            </Link>
          </p>
          {message && (
            <div className="message text-sm sm:text-base flex items-center justify-center mt-4  ">
              {message}
            </div>
          )}
          <Link to={"/"} className="flex justify-center">
            <button className="hover:text-[#595959] mt-3 cursor-pointer p-1 px-6 sm:px-9 z-50 rounded-xl bg-[#d3cfad] text-sm sm:text-base">
              Back to home
            </button>
          </Link>
        </form>

        <img
          src={addimg}
          alt=""
          className="absolute bottom-0 right-0 opacity-25 w-70 z-0"
        />
      </section>
    </main>
  );
}

export default Login;
