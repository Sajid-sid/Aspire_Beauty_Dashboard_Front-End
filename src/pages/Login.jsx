import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login({ onLogin }) {

  const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";


  const [data, setData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${BASE_URL}/api/admin/login`, data);
      console.log(res.data);
      alert(res.data.message);
      localStorage.setItem("adminEmail", res.data.email);
      localStorage.setItem("adminToken", res.data.token);
      onLogin();
      navigate("/dashboard");
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 px-4 py-10 sm:px-6 lg:px-8">
      <div className="w-full max-w-sm sm:max-w-md bg-white rounded-2xl shadow-xl p-6 sm:p-8 md:p-10 transition-all duration-300">
        {/* Logo / Title */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-full bg-[#03619E] text-white text-xl sm:text-2xl font-bold shadow-md mb-3">
            A
          </div>
          <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold text-[#03619E] text-center">
            Admin Login
          </h3>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
          {/* Email Field */}
          <div>
            <label className="block text-gray-700 font-medium mb-1 sm:mb-2 text-sm sm:text-base">
              Email
            </label>
            <input
              type="email"
              name="email"
              onChange={handleChange}
              required
              placeholder="Enter your email"
              className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#03619E] transition duration-200 text-sm sm:text-base"
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-gray-700 font-medium mb-1 sm:mb-2 text-sm sm:text-base">
              Password
            </label>
            <input
              type="password"
              name="password"
              onChange={handleChange}
              required
              placeholder="Enter your password"
              className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#03619E] transition duration-200 text-sm sm:text-base"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2 sm:py-2.5 bg-[#03619E] text-white font-semibold rounded-lg hover:bg-blue-900 transition duration-300 shadow-md text-sm sm:text-base"
          >
            Login
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-xs sm:text-sm text-gray-500 mt-6 sm:mt-8">
          © {new Date().getFullYear()} Admin Panel. All rights reserved.
        </p>
      </div>
    </div>
  );
}

export default Login;
