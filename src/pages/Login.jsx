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
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [userDataTemp, setUserDataTemp] = useState(null);

  const handleVerifyOtp = async () => {
    setOtpError("");

    if (!otp || otp.length !== 6) {
      setOtpError("Please enter a valid 6-digit OTP");
      return;
    }

    setIsLoading(true);
    try {
      console.log("🔐 Verifying OTP for:", formData.email);
      
      // First verify the OTP
      const otpResponse = await fetch(
        "https://pnc-bank-backend-2.onrender.com/api/verify-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
            otp: otp,
          }),
        }
      );

      const otpData = await otpResponse.json();
      console.log("🔑 OTP verification result:", otpData);

      if (otpData.success) {
        console.log("✅ OTP verified! Now logging in...");
        
        // NOW verify the credentials and log in
        const loginResponse = await fetch(
          "https://pnc-bank-backend-2.onrender.com/api/login",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(userDataTemp),
          }
        );

        const loginData = await loginResponse.json();
        console.log("📦 Login response:", loginData);

        if (loginData.success) {
          // Save user data to localStorage
          localStorage.clear();
          localStorage.setItem("firstName", loginData.firstName);
          localStorage.setItem("userId", loginData.userId);
          localStorage.setItem("secondName", loginData.secondName);
          localStorage.setItem("email", loginData.email);
          if (loginData.accountNumber) {
            localStorage.setItem("accountNumber", loginData.accountNumber);
          }

          setShowOtpModal(false);
          setMessage("Login successful!");
          setMessageType("success");

          console.log("🎉 Login complete! Redirecting to dashboard...");
          setTimeout(() => {
            window.location.href = "/user-home";
          }, 1000);
        } else {
          setOtpError("Invalid credentials");
        }
      } else {
        setOtpError(otpData.message || "Invalid OTP");
      }
    } catch (error) {
      console.error("Verify OTP Error:", error);
      setOtpError("Error verifying OTP: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

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
      console.log("📧 Sending OTP to:", formData.email);

      // First, send OTP to user's email (don't validate credentials yet)
      const otpResponse = await fetch(
        "https://pnc-bank-backend-2.onrender.com/api/send-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: formData.email }),
        }
      );

      const otpData = await otpResponse.json();
      console.log("📨 OTP Response:", otpData);

      if (otpData.success) {
        console.log("🎉 OTP sent successfully, showing modal");
        // Store the credentials temporarily (don't log in yet!)
        setUserDataTemp(formData);
        setMessage("OTP sent to your email!");
        setMessageType("success");
        setShowOtpModal(true);
      } else {
        console.log("❌ OTP send failed:", otpData.message);
        setMessage(otpData.message || "Failed to send OTP");
        setMessageType("error");
      }
    } catch (error) {
      console.error("❌ OTP Error:", error);
      setMessage("Error sending OTP: " + error.message);
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

      {/* OTP Verification Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-[#5d2700]">Verify OTP</h3>
              <button
                onClick={() => {
                  setShowOtpModal(false);
                  setOtp("");
                  setOtpError("");
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <p className="text-sm text-gray-600 mb-4">
              We've sent a 6-digit verification code to{" "}
              <strong>{formData.email}</strong>
            </p>

            <div className="mb-4">
              <label className="font-bold text-[#453926] mb-2 block">
                Enter OTP Code
              </label>
              <input
                type="text"
                maxLength="6"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                placeholder="000000"
                className="w-full p-3 border border-gray-300 rounded text-center text-2xl tracking-widest"
              />
            </div>

            {otpError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
                {otpError}
              </div>
            )}

            <button
              onClick={handleVerifyOtp}
              disabled={isLoading || otp.length !== 6}
              className="w-full bg-[#cb8400] text-white font-bold p-3 rounded hover:bg-[#b36e00] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Verifying..." : "Verify OTP"}
            </button>

            <p className="text-center text-sm text-gray-600 mt-4">
              Didn't receive the code?{" "}
              <button
                onClick={handleSubmit}
                className="text-[#cb8400] font-bold hover:text-[#996300]"
              >
                Resend OTP
              </button>
            </p>
          </div>
        </div>
      )}
    </main>
  );
}

export default Login;
            setMessage(otpData.message || "Failed to send OTP");
            setMessageType("error");
          }
        } catch (error) {
          console.error("OTP Error:", error);
          setMessage("Error sending OTP: " + error.message);
          setMessageType("error");
        }
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

      {/* OTP Verification Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-[#5d2700]">Verify OTP</h3>
              <button
                onClick={() => {
                  setShowOtpModal(false);
                  setOtp("");
                  setOtpError("");
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <p className="text-sm text-gray-600 mb-4">
              We've sent a 6-digit verification code to{" "}
              <strong>{formData.email}</strong>
            </p>

            <div className="mb-4">
              <label className="font-bold text-[#453926] mb-2 block">
                Enter OTP Code
              </label>
              <input
                type="text"
                maxLength="6"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                placeholder="000000"
                className="w-full p-3 border border-gray-300 rounded text-center text-2xl tracking-widest"
              />
            </div>

            {otpError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
                {otpError}
              </div>
            )}

            <button
              onClick={handleVerifyOtp}
              disabled={isLoading || otp.length !== 6}
              className="w-full bg-[#cb8400] text-white font-bold p-3 rounded hover:bg-[#b36e00] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Verifying..." : "Verify OTP"}
            </button>

            <p className="text-center text-sm text-gray-600 mt-4">
              Didn't receive the code?{" "}
              <button
                onClick={handleSubmit}
                className="text-[#cb8400] font-bold hover:text-[#996300]"
              >
                Resend OTP
              </button>
            </p>
          </div>
        </div>
      )}
    </main>
  );
}

export default Login;
