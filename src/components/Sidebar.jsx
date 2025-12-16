import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaBox,
  FaLayerGroup,
  FaClipboardList,
  FaUser,
  FaSignOutAlt,
  FaSitemap,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";

const Sidebar = ({ isOpen, toggle }) => {
  const [openDropdown, setOpenDropdown] = useState(false);

  const handleDropdownToggle = () => {
    setOpenDropdown((prev) => !prev);
  };

  return (
    <>
      {/* MOBILE OVERLAY */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden"
          onClick={toggle}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full bg-[#03619E] text-white shadow-xl z-50
        flex flex-col transition-all duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0
        ${isOpen ? "md:w-64" : "md:w-20"}`}
      >
        {/* HEADER + LOGO AREA */}
        <div
          className="flex items-center gap-3 p-4 cursor-pointer border-b border-blue-700"
          onClick={toggle}
        >
          <img
            src="/logo192.png"
            alt="logo"
            className="w-10 h-10 rounded-full"
          />
          <h2
            className={`text-xl font-semibold transition-opacity duration-300 
            ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
          >
            Admin
          </h2>
        </div>

        {/* MENU ITEMS */}
        <nav className="mt-4 flex-1 overflow-y-auto">

          {/* Dashboard */}
          <NavLink
            to="/dashboard"
            onClick={() => window.innerWidth < 768 && toggle()}
            className={({ isActive }) =>
              `flex items-center gap-3 py-3 px-4 mx-2 rounded-lg transition-all 
              ${isActive ? "bg-blue-600" : "hover:bg-blue-800"}`
            }
          >
            <FaHome className="text-lg" />
            {isOpen && <span className="text-sm md:text-base">Dashboard</span>}
          </NavLink>

          {/* DROPDOWN: ALL PRODUCTS */}
          <div>
            <button
              onClick={handleDropdownToggle}
              className={`flex items-center justify-between w-full py-3 px-4 mx-2 rounded-lg transition-all 
              hover:bg-blue-800`}
            >
              <div className="flex items-center gap-3">
                <FaBox className="text-lg" />
                {isOpen && <span className="text-sm md:text-base">All Products</span>}
              </div>

              {/* Dropdown Arrow */}
              {isOpen &&
                (openDropdown ? (
                  <FaChevronUp className="text-sm" />
                ) : (
                  <FaChevronDown className="text-sm" />
                ))}
            </button>

            {/* Dropdown Items */}
            {openDropdown && (
              <div
                className={`ml-10 mt-1 flex flex-col gap-1 transition-all duration-300 
                ${!isOpen ? "hidden" : ""}`}
              >
                <NavLink
                  to="/dashboard/products"
                  onClick={() => window.innerWidth < 768 && toggle()}
                  className={({ isActive }) =>
                    `py-2 px-3 rounded-md text-sm 
                    ${isActive ? "bg-blue-600" : "hover:bg-blue-700"}`
                  }
                >
                  Products
                </NavLink>

                <NavLink
                  to="/dashboard/categories"
                  onClick={() => window.innerWidth < 768 && toggle()}
                  className={({ isActive }) =>
                    `py-2 px-3 rounded-md text-sm 
                    ${isActive ? "bg-blue-600" : "hover:bg-blue-700"}`
                  }
                >
                  Categories
                </NavLink>

                <NavLink
                  to="/dashboard/subcategories"
                  onClick={() => window.innerWidth < 768 && toggle()}
                  className={({ isActive }) =>
                    `py-2 px-3 rounded-md text-sm 
                    ${isActive ? "bg-blue-600" : "hover:bg-blue-700"}`
                  }
                >
                  Subcategories
                </NavLink>
              </div>
            )}
          </div>

          {/* Orders */}
          <NavLink
            to="/dashboard/orders"
            onClick={() => window.innerWidth < 768 && toggle()}
            className={({ isActive }) =>
              `flex items-center gap-3 py-3 px-4 mx-2 rounded-lg transition-all 
              ${isActive ? "bg-blue-600" : "hover:bg-blue-800"}`
            }
          >
            <FaClipboardList className="text-lg" />
            {isOpen && <span className="text-sm md:text-base">Orders</span>}
          </NavLink>

          {/* Users */}
          <NavLink
            to="/dashboard/users"
            onClick={() => window.innerWidth < 768 && toggle()}
            className={({ isActive }) =>
              `flex items-center gap-3 py-3 px-4 mx-2 rounded-lg transition-all 
              ${isActive ? "bg-blue-600" : "hover:bg-blue-800"}`
            }
          >
            <FaUser className="text-lg" />
            {isOpen && <span className="text-sm md:text-base">Users</span>}
          </NavLink>

          {/* Banner */}
          <NavLink
            to="/dashboard/banner"
            onClick={() => window.innerWidth < 768 && toggle()}
            className={({ isActive }) =>
              `flex items-center gap-3 py-3 px-4 mx-2 rounded-lg transition-all 
              ${isActive ? "bg-blue-600" : "hover:bg-blue-800"}`
            }
          >
            <FaUser className="text-lg" />
            {isOpen && <span className="text-sm md:text-base">Banner</span>}
          </NavLink>
          <NavLink
            to="/dashboard/stock"
            onClick={() => window.innerWidth < 768 && toggle()}
            className={({ isActive }) =>
              `flex items-center gap-3 py-3 px-4 mx-2 rounded-lg transition-all 
              ${isActive ? "bg-blue-600" : "hover:bg-blue-800"}`
            }
          >
            <FaUser className="text-lg" />
            {isOpen && <span className="text-sm md:text-base">Stock</span>}
          </NavLink>
          <NavLink
            to="/dashboard/variant"
            onClick={() => window.innerWidth < 768 && toggle()}
            className={({ isActive }) =>
              `flex items-center gap-3 py-3 px-4 mx-2 rounded-lg transition-all 
              ${isActive ? "bg-blue-600" : "hover:bg-blue-800"}`
            }
          >
            <FaUser className="text-lg" />
            {isOpen && <span className="text-sm md:text-base">Variant</span>}
          </NavLink>

          {/* Logout */}
          <NavLink
            to="/"
            className="flex items-center gap-3 py-3 px-4 mx-2 rounded-lg hover:bg-blue-800"
          >
            <FaSignOutAlt className="text-lg" />
            {isOpen && <span className="text-sm md:text-base">Logout</span>}
          </NavLink>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
