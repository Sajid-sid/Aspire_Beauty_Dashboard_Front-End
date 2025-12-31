import React, { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";

export default function AddVariant({ editVariant, onSuccess, onCancelEdit }) {
  const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    productid: "",
    varient: "",
    price: "",
    stock: "",
    varient_image: null,
    product_image: null,
  });

  const [preview, setPreview] = useState({
    varient_image: "",
    product_image: "",
  });

  // Socket
  useEffect(() => {
    const socket = io(BASE_URL);

    socket.on("variant:created", (newVariant) => {
      onSuccess?.(newVariant); // call parent callback
    });

    socket.on("variant:updated", (updatedVariant) => {
      onSuccess?.(updatedVariant);
    });

    return () => socket.disconnect();
  }, []);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/products`);
        setProducts(res.data?.products || res.data || []);
      } catch (err) {
        console.error("Failed to fetch products", err);
      }
    };
    fetchProducts();
  }, []);

  // Populate form for editing
  useEffect(() => {
    if (editVariant && products.length) {
      setFormData({
        productid: String(editVariant.productid),
        varient: editVariant.varient || "",
        price: editVariant.price || "",
        stock: editVariant.stock || "",
        varient_image: null,
        product_image: null,
      });

      setPreview({
        varient_image: editVariant.varient_image || "",
        product_image: editVariant.product_image || "",
      });
    }
  }, [editVariant, products]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
      setPreview((prev) => ({
        ...prev,
        [name]: URL.createObjectURL(files[0]),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async () => {
    if (!formData.productid || !formData.varient || !formData.price) {
      alert("Product, variant & price are required");
      return;
    }

    const payload = new FormData();
    Object.entries(formData).forEach(([k, v]) => {
      if (v !== null && v !== "") payload.append(k, v);
    });

    try {
      if (editVariant) {
        await axios.put(`${BASE_URL}/api/variants/${editVariant.stockId}`, payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        // No need to manually call onSuccess here; socket will handle it
        alert("Variant updated");
      } else {
        await axios.post(`${BASE_URL}/api/variants`, payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Variant added");
      }

      // Reset form after submission
      setFormData({
        productid: "",
        varient: "",
        price: "",
        stock: "",
        varient_image: null,
        product_image: null,
      });
      setPreview({ varient_image: "", product_image: "" });
    } catch (err) {
      console.error(err);
      alert("Operation failed");
    }
  };

  return (
    <div className="p-6 bg-white shadow rounded max-w-md">
      <h2 className="text-xl font-semibold mb-4">
        {editVariant ? "Edit Variant" : "Add Variant"}
      </h2>

      <select
        name="productid"
        value={formData.productid}
        onChange={handleChange}
        className="w-full border p-2 mb-3 rounded"
      >
        <option value="">Select Product</option>
        {products.map((p) => (
          <option key={p.id} value={String(p.id)}>
            {p.name}
          </option>
        ))}
      </select>

      <input
        name="varient"
        value={formData.varient}
        onChange={handleChange}
        placeholder="Variant Name"
        className="w-full border p-2 mb-3 rounded"
      />
      <input
        type="number"
        name="price"
        value={formData.price}
        onChange={handleChange}
        placeholder="Price"
        className="w-full border p-2 mb-3 rounded"
      />
      <input
        type="number"
        name="stock"
        value={formData.stock}
        onChange={handleChange}
        placeholder="Stock"
        className="w-full border p-2 mb-3 rounded"
      />

      {/* Variant Image */}
      <div className="mb-3">
        <label className="text-sm font-medium">Variant Image</label>
        {preview.varient_image && (
          <img
            src={preview.varient_image}
            alt="Variant Preview"
            className="h-20 w-20 object-cover rounded mb-2"
          />
        )}
        <input type="file" name="varient_image" accept="image/*" onChange={handleChange} />
      </div>

      {/* Product Image */}
      <div className="mb-3">
        <label className="text-sm font-medium">Product Image</label>
        {preview.product_image && (
          <img
            src={preview.product_image}
            alt="Product Preview"
            className="h-20 w-20 object-cover rounded mb-2"
          />
        )}
        <input type="file" name="product_image" accept="image/*" onChange={handleChange} />
      </div>

      <div className="flex gap-2 mt-4">
        <button
          onClick={handleSubmit}
          className="flex-1 bg-indigo-600 text-white p-2 rounded"
        >
          {editVariant ? "Update Variant" : "Save Variant"}
        </button>
        {editVariant && (
          <button
            onClick={onCancelEdit}
            className="flex-1 bg-gray-400 text-white p-2 rounded"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}
