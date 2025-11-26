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

      const response = await fetch("http://localhost:8080/api/login", {
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

        console.log("💾 Storing firstName:", data.firstName); // ✅ Debug
        console.log("💾 Storing secondName:", data.secondName); // ✅ Debug
        console.log("💾 Storing email:", data.email); // ✅ Debug
        localStorage.setItem("firstName", data.firstName);
        localStorage.setItem("secondName", data.secondName);
        localStorage.setItem("email", data.email);

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
          navigate("/user-home");
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
    <main className="w-full h-screen flex gap-10">
      <section className="bg-[url('/image/abstractbg.png')] bg-blend-overlay bg-[#000000c4] w-[50%] bg-cover h-full bg-center"></section>
      <section className="w-[50%]  flex flex-col justify-center items-center position-relative gap-5">
        <h2 className="font-bold text-2xl text-[#5d2700] mb-5">PNC Bank </h2>
        <h1 className="font-bold text-5xl text-[#cb8400] mb-5">Welcome back</h1>
        <form className="w-[60%] z-100" onSubmit={handleSubmit}>
          <div className="mb-5 flex gap-1 flex-col">
            <label htmlFor="email" className="font-bold text-[#453926] mb-1">
              {" "}
              Email
            </label>
            <div className="border bg-white border-[#727272] rounded  focus:border-[#cb8400] flex items-center">
              <i className="fa-regular fa-envelope text-[#595959] text-lg m-3"></i>
              <input
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                min={6}
                max={30}
                name="email"
                placeholder="Enter your email "
                className=" w-full p-3 outline-none"
              />
            </div>
          </div>

          <div className="mb-5 flex gap-1 flex-col">
            <label htmlFor="password" className="font-bold text-[#371E30] mb-1">
              {" "}
              Password
            </label>
            <div className="border bg-white border-[#727272] rounded  focus:border-[#cb8400] flex items-center">
              <i className="fa-solid fa-lock text-[#595959] text-lg m-3"></i>
              <input
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                min={8}
                max={26}
                name="password"
                placeholder="Enter a password"
                className="w-full p-3 outline-none"
              />
            </div>
          </div>
          <p className="text-center mt-5">
            <Link
              to="/forgot-password"
              className="text-[#cb8400] font-bold hover:text-[#996300]"
            >
              Forgot password?
            </Link>
          </p>
          <button
            className="w-full bg-[#cb8400] mt-3 text-white font-bold p-3 rounded hover:bg-[#b36e00] active:bg-[#9c5f00]"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
          <p className="text-center mt-5">
            Don't have an account?{" "}
            <Link to="/signup" className="text-[#cb8400] font-bold">
              Register
            </Link>
          </p>
        </form>
        {message && <div className="message">{message}</div>}
        <Link to={"/"}>
          <button className="hover:text-[#595959] cursor-pointer p-1 px-9  z-50 rounded-xl bg-[#d3cfad]">
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

export default Login;
