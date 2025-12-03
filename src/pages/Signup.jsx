import { useState } from "react";
import React from "react";
import addimg from "../assets/image/png1.png";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    secondName: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordError2, setPasswordError2] = useState("");
  const [passwordError3, setPasswordError3] = useState("");
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [loginDataTemp, setLoginDataTemp] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (formData.password.length >= 8) {
      setPasswordError("✅");
    } else {
      setPasswordError("❌");
    }

    if (!hasUpperCase) {
      setPasswordError2("❌");
    } else {
      setPasswordError2("✅");
    }

    if (!hasNumber) {
      setPasswordError3("❌");
    } else {
      setPasswordError3("✅");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    // Perform form validation here if needed
    try {
      const response = await fetch(
        "https://pnc-bank-backend-2.onrender.com/api/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      const data = await response.json();

      if (data.success) {
        setMessage("✅ " + data.message);

        // Attempt auto-login so the user lands in their new account immediately
        try {
          const creds = { email: formData.email, password: formData.password };
          const loginResponse = await fetch(
            "https://pnc-bank-backend-2.onrender.com/api/login",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(creds),
            }
          );
          const loginData = await loginResponse.json();

          if (loginData.success) {
            // store
            //  minimal user info in localStorage (same as Login.jsx)
            localStorage.clear();
            localStorage.setItem("firstName", loginData.firstName);
            localStorage.setItem("secondName", loginData.secondName);
            localStorage.setItem("email", loginData.email);
            localStorage.setItem("userId", loginData.userId);
            if (loginData.accountNumber) {
              localStorage.setItem("accountNumber", loginData.accountNumber);
            }

            // Clear form UI and navigate to dashboard
            setFormData({
              firstName: "",
              secondName: "",
              email: "",
              password: "",
            });
            setTimeout(() => (window.location.href = "/user-home"), 800);
            return;
          }

          // If auto-login failed, show message and send user to login page
          setMessage(
            "✅ Registered. Please sign in: " + (loginData.message || "")
          );
          setTimeout(() => navigate("/login"), 1200);
        } catch (err) {
          // Signup succeeded but auto-login failed (network or server); direct user to login
          console.error("Auto-login failed:", err);
          setMessage("✅ Registered but auto-login failed. Please login.");
          setTimeout(() => navigate("/login"), 1200);
        }
      } else {
        setMessage("❌ " + data.message);
      }
    } catch (error) {
      setMessage("❌ Error connecting to server: " + error.message);
    } finally {
      setIsLoading(false);
    }
    if (!hasUpperCase) {
      alert("Password must contain uppercase letter");
      return;
    }

    if (!hasNumber) {
      alert("Password must contain number");
      return;
    }
  };

  const hasUpperCase = /[A-Z]/.test(formData.password);
  const hasNumber = /\d/.test(formData.password);
  const isValid = hasUpperCase && hasNumber;

  return (
    <main className="w-full min-h-screen flex flex-col md:flex-row gap-0 md:gap-10">
      <section className="bg-[url('/image/abstractbg.png')] md:hidden bg-blend-overlay bg-[#000000c4] w-full md:w-[50%] bg-cover h-40 md:h-full bg-center"></section>
      <section className="w-full md:w-full md:bg-[url('/image/abstractbg.png')] md:bg-blend-overlay md:bg-[#000000c4] md:bg-cover md:bg-center flex flex-col justify-center items-center relative gap-3 sm:gap-5 overflow-y-auto p-4 sm:p-6 py-8">
        <h2 className="font-bold text-xl sm:text-2xl md:text-white text-[#5d2700] mt-0 sm:mt-10 mb-3 sm:mb-5">
          PNC Bank{" "}
        </h2>
        <h1 className="font-bold text-3xl sm:text-4xl md:text-5xl md:text-white text-[#cb8400] mb-3 sm:mb-5">
          Signup
        </h1>
        <form
          className="w-full sm:w-[80%] md:w-[60%] z-100"
          onSubmit={handleSubmit}
        >
          <div className="mb-4 sm:mb-5 flex gap-1 flex-col">
            <label
              htmlFor="firstName"
              className="font-bold md:text-white text-[#453926] mb-1 text-sm sm:text-base"
            >
              First Name
            </label>
            <div className="border bg-white border-[#727272] rounded focus:border-[#cb8400] flex items-center">
              <i className="fa-regular fa-user text-[#595959] text-base sm:text-lg m-2 sm:m-3"></i>
              <input
                type="text"
                required
                value={formData.firstName}
                onChange={handleChange}
                min={3}
                max={20}
                name="firstName"
                placeholder="Enter your first name"
                className="w-full p-2 sm:p-3 outline-none text-sm sm:text-base"
              />
            </div>
          </div>
          <div className="mb-4 sm:mb-5 flex gap-1 flex-col">
            <label
              htmlFor="lastName"
              className="font-bold md:text-white text-[#453926] mb-1 text-sm sm:text-base"
            >
              Last Name
            </label>
            <div className="border bg-white border-[#727272] rounded focus:border-[#cb8400] flex items-center">
              <i className="fa-regular fa-user text-[#595959] text-base sm:text-lg m-2 sm:m-3"></i>
              <input
                type="text"
                required
                value={formData.secondName}
                onChange={handleChange}
                min={3}
                max={20}
                name="secondName"
                placeholder="Enter your last name"
                className="w-full p-2 sm:p-3 outline-none text-sm sm:text-base"
              />
            </div>
          </div>
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
              htmlFor="phone"
              className="font-bold md:text-white text-[#453926] mb-1 text-sm sm:text-base"
            >
              Phone
            </label>
            <div className="border bg-white border-[#727272] rounded focus:border-[#cb8400] flex items-center">
              <i className="fa-solid fa-phone text-[#595959] text-base sm:text-lg m-2 sm:m-3"></i>
              <input
                type="phone"
                required
                onChange={handleChange}
                min={10}
                max={15}
                name="phone"
                placeholder="Enter your phone number "
                className="w-full p-2 sm:p-3 outline-none text-sm sm:text-base"
              />
            </div>
          </div>

          <div className="mb-4 sm:mb-5 flex gap-1 flex-col">
            <label
              htmlFor="password"
              className="font-bold md:text-white text-[#371E30] mb-1 text-sm sm:text-base"
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
          <div>
            <h4 className="font-semibold md:text-white text-base sm:text-lg">
              Password requirements:
            </h4>
            <li className="md:text-white text-[#595959] mb-1 list-none text-sm sm:text-base">
              <span>{passwordError}</span> At least 8 characters
            </li>
            <li className="md:text-white text-[#595959] mb-1 list-none text-sm sm:text-base">
              <span>{passwordError2}</span> Contains uppercase and lowercase
              letters
            </li>
            <li className="md:text-white text-[#595959] list-none text-sm sm:text-base">
              <span>{passwordError3}</span> contains at least one number
            </li>
          </div>

          <div className="mt-3 sm:mt-5 md:text-white text-sm sm:text-base">
            <input type="checkbox" name="terms" className="mr-2" /> I agree to
            the Terms , Conditions and Privacy Policy.
          </div>
          <button
            className="w-full bg-[#cb8400] mt-3 text-white font-bold p-2 sm:p-3 rounded hover:bg-[#b36e00] active:bg-[#9c5f00] text-sm sm:text-base"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Registering.. " : "Register"}
          </button>
          <p className="text-center md:text-white mb-3 sm:mb-15 mt-3 sm:mt-5 text-sm sm:text-base">
            Already have an account{" "}
            <Link
              to="/login"
              className="md:text-[#ffa600] text-[#cb8400] font-bold"
            >
              Login
            </Link>
          </p>
        </form>
        {message && (
          <div className="mt-3 sm:mt-5 p-2 sm:p-3 rounded-[5px] text-center font-medium text-sm sm:text-base">
            {message}
          </div>
        )}

        <Link to={"/"} className="flex justify-center z-50 relative">
          <button className="hover:text-[#595959] cursor-pointer p-1 px-6 sm:px-9 rounded-xl bg-[#d3cfad] mb-4 text-sm sm:text-base">
            Back to home
          </button>
        </Link>

        <img
          src={addimg}
          alt=""
          className="absolute bottom-0 right-0 opacity-25 w-70 z-0"
        />
      </section>
    </main>
  );
}

export default Signup;
