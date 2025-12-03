import React, { useEffect, useState } from "react";
import { FaBars } from "react-icons/fa";

const Header = ({ toggleSidebar }) => {

   const [adminEmail, setAdminEmail] = useState("");

  useEffect(() => {
    const email = localStorage.getItem("adminEmail");
    setAdminEmail(email || "Admin");
  }, []);


  return (
    <header className="flex items-center justify-between bg-white shadow-md px-4 sm:px-6 py-4 sticky top-0 z-40">
      {/* Left Section */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="text-[#03619E] text-2xl md:hidden focus:outline-none"
        >
          <FaBars />
        </button>
        <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 whitespace-nowrap">
          Hello Admin 👋
        </h3>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3 sm:gap-4">
        <div className="text-right hidden sm:block">
          <strong className="block text-gray-800 text-sm">Admin</strong>
          <p className="text-gray-500 text-xs">{adminEmail}</p>
        </div>
      </div>
    </header>
  );
};

export default Header;
