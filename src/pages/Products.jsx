import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Products = () => {
  const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [filteredSubcategories, setFilteredSubcategories] = useState([]);

  // Filters
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [stockFilter, setStockFilter] = useState(""); // "", in, out
  const [sortBy, setSortBy] = useState("");

  const [message, setMessage] = useState("");

  const token = localStorage.getItem("adminToken");
  const navigate = useNavigate();

  // Fix image URL
  const getImageUrl = (img) => {
    if (!img) return null;
    if (img.startsWith("http")) return img.replace(/^http:\//, "http://");
    return `${BASE_URL}/uploads/${img}`;
  };

  // Fetch all data
  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/products`);
      console.log(res.data);
      setProducts(res.data.products || res.data || []);
    } catch (err) {
      console.error("Error fetching products:", err);
      setMessage("❌ Failed to load products");
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/categories`);
      setCategories(res.data || []);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const fetchSubcategories = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/subcategories`);
      setSubcategories(res.data || []);
    } catch (err) {
      console.error("Error fetching subcategories:", err);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchSubcategories();
    fetchProducts();
  }, []);

  // Filter subcategories on change
useEffect(() => {
  if (selectedCategory) {
    const selectedCatObj = categories.find(
      (c) => c.name === selectedCategory
    );

    if (selectedCatObj) {
      const filtered = subcategories.filter(
        (sub) => sub.category_id === selectedCatObj.id
      );
      setFilteredSubcategories(filtered);
    }
  } else {
    setFilteredSubcategories([]);
  }
}, [selectedCategory, categories, subcategories]);


  // Delete product
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await axios.delete(`${BASE_URL}/api/products/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(products.filter((p) => p.id !== id));
      setMessage("✅ Product Deleted");
    } catch (err) {
      console.error("Error deleting product:", err);
      setMessage("❌ Failed to delete product");
    }
  };
const filteredProducts = products
  .filter((p) => {
    const searchLower = search.toLowerCase();

    // Search: name + category + subcategory
    const matchSearch =
      p.name.toLowerCase().includes(searchLower) ||
      (p.category_name &&
        p.category_name.toLowerCase().includes(searchLower)) ||
      (p.subcategory_name &&
        p.subcategory_name.toLowerCase().includes(searchLower));

    // Category match by NAME
    const matchCategory = selectedCategory
      ? p.category_name === selectedCategory
      : true;

    // Subcategory match by NAME
    const matchSub = selectedSubcategory
      ? p.subcategory_name === selectedSubcategory
      : true;

    // Stock filter
    const matchStock =
      stockFilter === "in"
        ? p.stock > 0
        : stockFilter === "out"
        ? p.stock === 0
        : true;

    return matchSearch && matchCategory && matchSub && matchStock;
  })
  .sort((a, b) => {
    if (sortBy === "newest")
      return new Date(b.created_at) - new Date(a.created_at);

    if (sortBy === "low-high") return a.price - b.price;

    if (sortBy === "high-low") return b.price - a.price;

    return 0;
  });


  return (
    <div className="p-4 sm:p-6 bg-white shadow-md rounded-2xl max-w-6xl mx-auto mt-8">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
        <h2 className="text-2xl font-semibold text-gray-800">Products</h2>
        <button
          onClick={() => navigate("/dashboard/add-product")}
          className="bg-[#03619E] hover:bg-blue-900 text-white px-4 py-2 rounded-lg w-full sm:w-auto"
        >
          + Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">

        {/* Search */}
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-[#03619E]"
        />

        {/* Category */}
        <select
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            setSelectedSubcategory("");
          }}
          className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-[#03619E]"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.name}>
              {c.name}
            </option>

          ))}
        </select>

        {/* Subcategory */}
        <select
          value={selectedSubcategory}
          onChange={(e) => setSelectedSubcategory(e.target.value)}
          disabled={!filteredSubcategories.length}
          className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-[#03619E]"
        >
          <option value="">All Subcategories</option>
          {filteredSubcategories.map((sub) => (
            <option key={sub.id} value={sub.name}>
  {sub.name}
</option>

          ))}
        </select>

        {/* Stock Filter */}
        <select
          value={stockFilter}
          onChange={(e) => setStockFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-[#03619E]"
        >
          <option value="">All Stock</option>
          <option value="in">In Stock</option>
          <option value="out">Out of Stock</option>
        </select>

        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-[#03619E]"
        >
          <option value="">Sort By</option>
          <option value="newest">Newest</option>
          <option value="low-high">Price: Low → High</option>
          <option value="high-low">Price: High → Low</option>
        </select>
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded-lg">
          <thead className="bg-[#03619E] text-white">
            <tr>
              <th className="px-4 py-2 text-left">#</th>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Category</th>
              <th className="px-4 py-2 text-left">Subcategory</th>
              <th className="px-4 py-2 text-left">Price</th>
              <th className="px-4 py-2 text-left">Stock</th>
              <th className="px-4 py-2 text-center">Image</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product, index) => (
                <tr key={product.id} className="border-b hover:bg-gray-50 transition">
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2 font-medium text-gray-700">{product.name}</td>
                  <td className="px-4 py-2">{product.category_name}</td>
                  <td className="px-4 py-2">{product.subcategory_name}</td>
                  <td className="px-4 py-2">₹{product.price}</td>
                  <td className="px-4 py-2">{product.stock}</td>
                  <td className="px-4 py-2 text-center">
                    {product.image1 ? (
                      <img
                        src={getImageUrl(product.image1)}
                        alt={product.name}
                        className="w-14 h-14 object-cover rounded-lg mx-auto"
                      />
                    ) : (
                      <span className="text-gray-400 text-sm italic">No image</span>
                    )}
                  </td>

                  <td className="px-4 py-2 text-center flex justify-center gap-2">
                    <button
                      onClick={() =>
                        navigate(`/dashboard/add-product/${product.id}`)
                      }
                      className="text-[#03619E] hover:text-yellow-600 px-3 py-1"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(product.id)}
                      className="text-[#03619E] hover:text-red-600 px-3 py-1"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center py-4 text-gray-500 italic">
                  No products found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:hidden">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div
              key={product.id}
              className="border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-center gap-4">
                {product.image1 ? (
                  <img
                    src={getImageUrl(product.image1)}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded-md border"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gray-100 flex items-center justify-center text-gray-400 text-sm rounded-md">
                    No Img
                  </div>
                )}

                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {product.category_name} • {product.subcategory_name}
                  </p>
                  <p className="text-sm font-medium text-[#03619E]">
                    ₹{product.price}
                  </p>
                </div>
              </div>

              <div className="mt-3 flex justify-between items-center">
                <p className="text-sm text-gray-500">Stock: {product.stock}</p>

                <div className="flex gap-3 text-sm font-medium">
                  <button
                    onClick={() =>
                      navigate(`/dashboard/add-product/${product.id}`)
                    }
                    className="text-[#03619E] hover:text-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="text-[#03619E] hover:text-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 italic">No products found</p>
        )}
      </div>

      {/* Message */}
      {message && (
        <p
          className={`mt-4 text-center font-medium ${message.includes("✅") ? "text-green-600" : "text-red-600"
            }`}
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default Products;
