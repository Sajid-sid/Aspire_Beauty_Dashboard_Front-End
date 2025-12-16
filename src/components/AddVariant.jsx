import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AddVariant({ onSuccess }) {
    const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    productid: "",
    varient: "",
    stock: 0,
    varient_image: null,
    product_image: null,
  });

  // Fetch products on mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/categories/products`);
        const data = Array.isArray(res.data) ? res.data : res.data.products || [];
        console.log(data);
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products", error);
      }
    };

    fetchProducts();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({ ...formData, [name]: files ? files[0] : value });
  };

  const handleSubmit = async () => {
    if (!formData.productid || !formData.varient) {
      alert("Please select a product and enter variant name.");
      return;
    }

    const payload = new FormData();
    Object.keys(formData).forEach((key) => payload.append(key, formData[key]));
    console.log(formData);

    try {
      await axios.post(`${BASE_URL}/api/variants`, payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Variant added successfully!");
      onSuccess && onSuccess();
      setFormData({
        productid: "",
        varient: "",
        stock: 0,
        varient_image: null,
        product_image: null,
      });
    } catch (error) {
      console.error(error);
      alert("Failed to add variant.");
    }
  };

  return (
    <div className="p-6 border rounded-lg bg-white shadow-md max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">Add Variant</h2>

      {/* Product */}
      <label className="block mb-2 font-medium text-gray-600">Product</label>
      <select
        name="productid"
        value={formData.productid}
        onChange={handleChange}
        className="w-full border rounded p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-400"
      >
        <option value="">Select Product</option>
        {Array.isArray(products) &&
          products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
      </select>

      {/* Variant Name */}
      <label className="block mb-2 font-medium text-gray-600">Variant Name</label>
      <input
        type="text"
        name="varient"
        value={formData.varient}
        onChange={handleChange}
        placeholder="Variant name (e.g., Red 50ml)"
        className="w-full border rounded p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-400"
      />

      {/* Variant Image */}
      <label className="block mb-2 font-medium text-gray-600">Variant Image</label>
      <input
        type="file"
        name="varient_image"
        onChange={handleChange}
        className="w-full mb-4"
      />

      {/* Product Image */}
      <label className="block mb-2 font-medium text-gray-600">Product Image</label>
      <input
        type="file"
        name="product_image"
        onChange={handleChange}
        className="w-full mb-4"
      />

      {/* Stock */}
      <label className="block mb-2 font-medium text-gray-600">Initial Stock</label>
      <input
        type="number"
        name="stock"
        value={formData.stock}
        onChange={handleChange}
        className="w-full border rounded p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-400"
      />

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        className="w-full bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700 transition"
      >
        Save Variant
      </button>
    </div>
  );
}
