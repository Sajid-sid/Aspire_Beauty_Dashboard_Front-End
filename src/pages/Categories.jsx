import React, { useEffect, useState } from "react";
import axios from "axios";

const Categories = () => {
  const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);

  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editImage, setEditImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const [newCategory, setNewCategory] = useState("");
  const [newImage, setNewImage] = useState(null);
  const [message, setMessage] = useState("");

  const [search, setSearch] = useState("");
  const [imageFilter, setImageFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("None");

  const token = localStorage.getItem("adminToken");

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/categories`);
      setCategories(res.data || []);
      setFilteredCategories(res.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setMessage("❌ Failed to load categories");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Filtering + Sorting Combined
  useEffect(() => {
    let list = [...categories];

    // Search filter
    if (search.trim()) {
      list = list.filter((cat) =>
        cat.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Image filter
    if (imageFilter === "Has Image") {
      list = list.filter((cat) => cat.image);
    } else if (imageFilter === "No Image") {
      list = list.filter((cat) => !cat.image);
    }

    // Sorting
    if (sortOrder === "A-Z") {
      list.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOrder === "Z-A") {
      list.sort((a, b) => b.name.localeCompare(a.name));
    }

    setFilteredCategories(list);
  }, [search, imageFilter, sortOrder, categories]);

  // Add Category
  const handleAddCategory = async () => {
    if (!newCategory.trim()) return alert("Enter a valid category name");
    if (!newImage) return alert("Please select an image");

    const formData = new FormData();
    formData.append("name", newCategory);
    formData.append("image", newImage);

    try {
      await axios.post(`${BASE_URL}/api/categories`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setNewCategory("");
      setNewImage(null);
      setMessage("✅ Category Added Successfully");
      fetchCategories();
    } catch (error) {
      console.error("Error adding category:", error);
      setMessage("❌ Failed to add category");
    }
  };

  // Delete Category
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;

    try {
      await axios.delete(`${BASE_URL}/api/categories/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCategories(categories.filter((c) => c.id !== id));
      setMessage("✅ Category Deleted");
    } catch (error) {
      console.error("Error deleting category:", error);
      setMessage("❌ Failed to delete category");
    }
  };

  // Save Edited Category
  const handleEditSave = async (id) => {
    if (!editName.trim()) return alert("Enter a valid name");

    const formData = new FormData();
    formData.append("name", editName);
    if (editImage) formData.append("image", editImage);

    try {
      await axios.put(`${BASE_URL}/api/categories/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      fetchCategories();
      setEditId(null);
      setEditName("");
      setEditImage(null);
      setPreviewImage(null);

      setMessage("✅ Category Updated");
    } catch (error) {
      console.error("Error updating category:", error);
      setMessage("❌ Failed to update category");
    }
  };

  return (
    <div className="p-4 sm:p-6 bg-white shadow-md rounded-2xl max-w-6xl mx-auto mt-6 sm:mt-10">
      <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-6 text-center">
        Categories
      </h2>

      {/* Add Category */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Enter new category name"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setNewImage(e.target.files[0])}
          className="border border-gray-300 rounded-lg px-3 py-2"
        />
        <button
          onClick={handleAddCategory}
          className="bg-[#03619E] text-white px-4 py-2 rounded-lg"
        >
          + Add
        </button>
      </div>

      {/* Filters Section */}
      <div className="flex flex-col sm:flex-row gap-4 mb-4">

        {/* Search */}
        <input
          type="text"
          placeholder="Search by name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 w-full sm:w-1/3"
        />

        {/* Image Filter */}
        <select
          value={imageFilter}
          onChange={(e) => setImageFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 w-full sm:w-1/3"
        >
          <option value="All">All</option>
          <option value="Has Image">Has Image</option>
          <option value="No Image">No Image</option>
        </select>

        {/* Sort */}
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 w-full sm:w-1/3"
        >
          <option value="None">Sort By</option>
          <option value="A-Z">Name A → Z</option>
          <option value="Z-A">Name Z → A</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full text-sm sm:text-base">
          <thead className="bg-[#03619E] text-white">
            <tr>
              <th className="px-4 py-2 text-left">#</th>
              <th className="px-4 py-2 text-left">Image</th>
              <th className="px-4 py-2 text-left">Category Name</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredCategories.length > 0 ? (
              filteredCategories.map((cat, index) => (
                <tr key={cat.id} className="border-b">
                  <td className="px-4 py-2">{index + 1}</td>

                  {/* Image */}
                  <td className="px-4 py-2">
                    {editId === cat.id ? (
                      <div className="flex flex-col gap-2">
                        <img
                          src={previewImage || cat.image}
                          alt="Preview"
                          className="w-14 h-14 rounded-lg object-cover border"
                        />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            setEditImage(e.target.files[0]);
                            setPreviewImage(
                              URL.createObjectURL(e.target.files[0])
                            );
                          }}
                        />
                      </div>
                    ) : cat.image ? (
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="w-14 h-14 rounded-lg object-cover border"
                      />
                    ) : (
                      <span className="italic text-gray-400">No Image</span>
                    )}
                  </td>

                  {/* Name */}
                  <td className="px-4 py-2">
                    {editId === cat.id ? (
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="border rounded-lg px-2 py-1 w-full"
                      />
                    ) : (
                      cat.name
                    )}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-2 text-center">
                    {editId === cat.id ? (
                      <>
                        <button
                          onClick={() => handleEditSave(cat.id)}
                          className="bg-[#03619E] text-white px-3 py-1 rounded-lg mr-2"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => {
                            setEditId(null);
                            setEditName("");
                            setEditImage(null);
                            setPreviewImage(null);
                          }}
                          className="bg-gray-400 text-white px-3 py-1 rounded-lg"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            setEditId(cat.id);
                            setEditName(cat.name);
                            setPreviewImage(cat.image);
                          }}
                          className="text-[#03619E] font-medium mr-3"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(cat.id)}
                          className="text-[#03619E] font-medium hover:text-red-600"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-4 text-gray-500">
                  No categories found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {message && (
        <p
          className={`mt-4 text-center font-medium ${
            message.includes("✅") ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default Categories;
