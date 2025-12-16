import React, { useEffect, useState } from "react";
import axios from "axios";

export default function ProductDetailsForm() {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    productid: "",
    description: "",
    ingredients: "",
    how_to_use: "",
    features: "",
    manufacturer_importer: "",
    description_image: null,
  });
  const [preview, setPreview] = useState(null);

  // Fetch all products for dropdown
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:5001/api/products");
        setProducts(res.data);
      } catch (err) {
        console.error("Failed to fetch products", err);
      }
    };
    fetchProducts();
  }, []);

  // Fetch existing details when product changes
  useEffect(() => {
    const fetchDetails = async () => {
      if (!formData.productid) return;
      try {
        const res = await axios.get(
          `http://localhost:5001/api/product-details/${formData.productid}`
        );
        const data = res.data;
        setFormData({
          ...formData,
          description: data.description || "",
          ingredients: data.ingredients || "",
          how_to_use: data.how_to_use || "",
          features: data.features || "",
          manufacturer_importer: data.manufacturer_importer || "",
        });
        setPreview(data.description_image || null);
      } catch (err) {
        // No details yet
        setFormData((prev) => ({
          ...prev,
          description: "",
          ingredients: "",
          how_to_use: "",
          features: "",
          manufacturer_importer: "",
        }));
        setPreview(null);
      }
    };
    fetchDetails();
    // eslint-disable-next-line
  }, [formData.productid]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, [name]: files[0] });
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.productid) {
      alert("Please select a product");
      return;
    }

    const payload = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== null) payload.append(key, formData[key]);
    });

    try {
      await axios.post("http://localhost:5001/api/product-details", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Product details saved successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to save product details");
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">
        Add / Update Product Details
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Product Selection */}
        <div>
          <label className="block font-medium mb-1">Product</label>
          <select
            name="productid"
            value={formData.productid}
            onChange={handleChange}
            className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            <option value="">Select Product</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="block font-medium mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            rows="3"
          ></textarea>
        </div>

        {/* Ingredients */}
        <div>
          <label className="block font-medium mb-1">Ingredients</label>
          <textarea
            name="ingredients"
            value={formData.ingredients}
            onChange={handleChange}
            className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            rows="2"
          ></textarea>
        </div>

        {/* How to Use */}
        <div>
          <label className="block font-medium mb-1">How to Use</label>
          <textarea
            name="how_to_use"
            value={formData.how_to_use}
            onChange={handleChange}
            className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            rows="2"
          ></textarea>
        </div>

        {/* Features */}
        <div>
          <label className="block font-medium mb-1">Features</label>
          <textarea
            name="features"
            value={formData.features}
            onChange={handleChange}
            className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            rows="2"
          ></textarea>
        </div>

        {/* Manufacturer / Importer */}
        <div>
          <label className="block font-medium mb-1">Manufacturer / Importer</label>
          <input
            type="text"
            name="manufacturer_importer"
            value={formData.manufacturer_importer}
            onChange={handleChange}
            placeholder="Manufacturer / Importer"
            className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        {/* Description Image */}
        <div>
          <label className="block font-medium mb-1">Description Image</label>
          <input
            type="file"
            name="description_image"
            onChange={handleChange}
            className="w-full mb-2"
          />
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="h-24 w-24 object-cover border rounded mt-2"
            />
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700 transition"
        >
          Save Product Details
        </button>
      </form>
    </div>
  );
}
