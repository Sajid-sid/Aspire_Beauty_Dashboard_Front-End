import React, { useEffect, useState } from "react";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";

const Subcategories = () => {
  const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

  const [subcategories, setSubcategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("adminToken");



  // ✅ Fetch all subcategories
  const fetchSubcategories = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/subcategories`);
      setSubcategories(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    }
  };

  // ✅ Fetch all categories
  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/categories`);
      console.log(res.data);
      setCategories(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchSubcategories();
    fetchCategories();
  }, []);

  // ✅ Handle Delete Subcategory
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this subcategory?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`${BASE_URL}/api/subcategories/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Subcategory deleted successfully");
      setSubcategories(subcategories.filter((sub) => sub.id !== id));
    } catch (error) {
      console.error("Error deleting subcategory:", error);
      alert("Failed to delete subcategory. Please try again.");
    }
  };


  return (
    <div className="p-4 sm:p-6 bg-white shadow-md rounded-2xl">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6 border-b pb-3 gap-4">
        <h2 className="text-2xl font-semibold text-gray-800 text-center sm:text-left">
          Subcategories
        </h2>
        <NavLink
          to="/dashboard/add-subcategory"
          className="bg-[#03619E] hover:bg-blue-900 text-white px-4 py-2 rounded-lg text-sm font-medium transition duration-300 shadow w-full sm:w-auto text-center"
        >
          + Add Subcategory
        </NavLink>
      </div>

      {/* Table for Desktop */}
      {subcategories.length > 0 ? (
        <>
          <div className="hidden lg:block overflow-x-auto">
            <table className="min-w-full table-auto border border-gray-200 rounded-lg">
              <thead className="bg-[#03619E] text-white">
                <tr>
                  <th className="py-3 px-4 text-left">#</th>
                  <th className="py-3 px-4 text-left">Subcategory Name</th>
                  <th className="py-3 px-4 text-left">Parent Category</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {subcategories.map((sub, index) => (
                  <tr
                    key={sub.id}
                    className={`border-b hover:bg-gray-50 transition ${index % 2 === 0 ? "bg-gray-50" : "bg-white"
                      }`}
                  >
                    <td className="py-3 px-4">{index + 1}</td>
                    <td className="py-3 px-4 font-medium text-gray-700">
                      {sub.name}
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {categories.find((cat) => cat.id === sub.category_id)?.name || "N/A"}
                    </td>
                    <td className="py-3 px-4 flex justify-center gap-3">
                      <button
                        onClick={() => navigate(`/dashboard/add-subcategory/${sub.id}`)}
                        className="cursor-pointer hover:text-yellow-600 text-[#03619E] px-3 py-1 rounded-lg transition font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(sub.id)}
                        className="cursor-pointer hover:text-red-600 text-[#03619E] px-3 py-1 rounded-lg transition font-medium"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Card View for Mobile / Tablet */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:hidden">
            {subcategories.map((sub, index) => (
              <div
                key={sub.id}
                className="bg-gray-50 border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {sub.name}
                  </h3>
                  <span className="text-sm text-gray-500 font-medium">
                    #{index + 1}
                  </span>
                </div>
                <p className="text-gray-600 text-sm font-medium mb-3">
                  Parent Category:
                </p>
                <p className="text-gray-800 font-semibold">
                  {categories.find((cat) => cat.id === sub.category_id)?.name || "N/A"}
                </p>

                <div className="flex justify-end gap-3 mt-4">
                  <button
                    onClick={() => navigate(`/dashboard/add-subcategory/${sub.id}`)}
                    className="text-[#03619E] font-medium text-sm hover:text-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(sub.id)}
                    className="text-[#03619E] font-medium text-sm hover:text-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <p className="text-center text-gray-500 mt-8 text-lg italic">
          No subcategories found.
        </p>
      )}
    </div>
  );
};

export default Subcategories;
