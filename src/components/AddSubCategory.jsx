import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const AddSubCategory = () => {
  const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

  const [subCategoryName, setSubCategoryName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState("");

  const { id } = useParams();
  const navigate = useNavigate();
  

  // ✅ Fetch all categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/categories`);
        setCategories(res.data || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // ✅ Fetch subcategory if editing
  useEffect(() => {
    if (id) {
      const fetchSubCategory = async () => {
        try {
          const res = await axios.get(`${BASE_URL}/api/subcategories/${id}`);
          const sub = res.data;
          setSubCategoryName(sub.name || "");
          setCategoryId(sub.category_id || "");
        } catch (error) {
          console.error("Error fetching subcategory:", error);
          setMessage("❌ Failed to load subcategory details");
        }
      };
      fetchSubCategory();
    }
  }, [id]);

  // ✅ Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subCategoryName || !categoryId) {
      setMessage("⚠️ Please fill all required fields");
      return;
    }

    try {
      const token = localStorage.getItem("adminToken");
      const data = { name: subCategoryName, category_id: categoryId };

      if (id) {
        await axios.put(`${BASE_URL}/api/subcategories/update/${id}`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          
        });
        setMessage("✅ Subcategory updated successfully!");
      } else {
        await axios.post(`${BASE_URL}/api/subcategories`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMessage("✅ Subcategory added successfully!");
      }

      setTimeout(() => navigate("/dashboard/subcategories"), 1200);
    }catch (error) {
  setMessage(error.response?.data?.message || "❌ Something went wrong");
}
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-10">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-2xl p-6 sm:p-8">
        <h2 className="text-2xl sm:text-3xl font-semibold text-[#03619E] mb-6 text-center">
          {id ? "Edit Subcategory" : "Add New Subcategory"}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Subcategory Name */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Subcategory Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter subcategory name"
              value={subCategoryName}
              onChange={(e) => setSubCategoryName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#03619E] focus:outline-none"
              required
            />
          </div>

          {/* Category Dropdown */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#03619E] focus:outline-none"
              required
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="bg-[#03619E] hover:bg-blue-900 text-white font-medium py-2 rounded-lg transition duration-300 shadow-md"
          >
            {id ? "Update Subcategory" : "Add Subcategory"}
          </button>
        </form>

        {message && (
          <p
            className={`mt-5 text-center font-medium ${
              message.includes("✅")
                ? "text-green-600"
                : message.includes("⚠️")
                ? "text-yellow-600"
                : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default AddSubCategory;
