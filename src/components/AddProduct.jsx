import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const AddProduct = () => {
  const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false); // new

  const [product, setProduct] = useState({
    name: "",
    price: "",
    stock: "",
    description: "",
    ingredients: "",
    category_id: "",
    subcategory_id: "",
  });

  const [images, setImages] = useState({
    image1: null,
    image2: null,
    image3: null,
    image4: null,
  });

  const [previewImages, setPreviewImages] = useState({
    image1: null,
    image2: null,
    image3: null,
    image4: null,
  });

  const [message, setMessage] = useState(""); // user-facing messages

  // Load categories
  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/categories`)
      .then((res) => setCategories(res.data))
      .catch((err) => {
        console.error("Categories fetch error:", err);
        setMessage("Failed to load categories (check console).");
      });
  }, []);

  // Load product if edit
  useEffect(() => {
    if (!isEdit) {
      setLoading(false);
      return;
    }

    const fetchProduct = async () => {
      try {
        console.log("[AddProduct] fetchProduct() ->", id);
        const res = await axios.get(`${BASE_URL}/api/products/${id}`);
        const p = res.data;
        console.log("[AddProduct] product data:", p);

        setProduct({
          name: p.name || "",
          price: String(p.price ?? ""),
          stock: String(p.stock ?? ""),
          description: p.description || "",
          ingredients: p.ingredients || "",
          category_id: String(p.category_id ?? ""),
          subcategory_id: String(p.subcategory_id ?? ""),
        });

        setPreviewImages({
          image1: p.image1 || null,
          image2: p.image2 || null,
          image3: p.image3 || null,
          image4: p.image4 || null,
        });

        // load subcategories for product category
        if (p.category_id) {
          const subRes = await axios.get(
            `${BASE_URL}/api/subcategories/getbycategory/${p.category_id}`
          );
          setSubcategories(subRes.data);
        }

        setLoading(false);
      } catch (err) {
        console.error("Edit mode product load error:", err);
        setMessage("Failed to load product data (see console).");
        setLoading(false);
      }
    };

    fetchProduct();
  }, [isEdit, id]);

  // Subcategory loader (ADD mode only)
  useEffect(() => {
    if (isEdit) return; // important: skip in edit mode

    if (!product.category_id) {
      setSubcategories([]);
      return;
    }

    axios
      .get(`${BASE_URL}/api/subcategories/getbycategory/${product.category_id}`)
      .then((res) => setSubcategories(res.data))
      .catch((err) => {
        console.error("Subcategory fetch error:", err);
        setMessage("Failed to load subcategories (see console).");
      });
  }, [product.category_id, isEdit]);

  // Handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];
    setImages((prev) => ({ ...prev, [name]: file }));
    if (file) {
      setPreviewImages((prev) => ({ ...prev, [name]: URL.createObjectURL(file) }));
    }
  };

  // Instrumented submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("[AddProduct] handleSubmit clicked", { isEdit, product, images });
    setMessage("");
    setSubmitting(true);

    try {
      // basic client-side validation
      if (!product.name || !product.price || !product.category_id) {
        setMessage("Name, price and category are required.");
        console.warn("[AddProduct] validation failed", product);
        setSubmitting(false);
        return;
      }

      if (!isEdit && !images.image1) {
        setMessage("Main image (image1) is required for new products.");
        setSubmitting(false);
        return;
      }

      const fd = new FormData();
      Object.keys(product).forEach((k) => fd.append(k, product[k]));
      Object.keys(images).forEach((k) => {
        if (images[k]) fd.append(k, images[k]);
      });

      // show the request details in console (no sensitive info)
      console.log("[AddProduct] sending request to:", isEdit ? `PUT ${BASE_URL}/api/products/${id}` : `POST ${BASE_URL}/api/products`);
      // Make network request
      const token = localStorage.getItem("adminToken");
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

      const res = await (isEdit
        ? axios.put(`${BASE_URL}/api/products/${id}`, fd, config)
        : axios.post(`${BASE_URL}/api/products`, fd, config));

      console.log("[AddProduct] server response:", res && res.data);
      setMessage("Saved successfully.");
      // small delay so user sees message (optional)
      setTimeout(() => {
        navigate("/dashboard/products");
      }, 500);
    } catch (err) {
      console.error("[AddProduct] submit error:", err);
      // surface network error message if available
      const serverMsg = err?.response?.data?.message || err.message;
      setMessage(`Save failed: ${serverMsg}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p className="p-6 text-xl">Loading...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">{isEdit ? "Edit Product" : "Add Product"}</h2>

      {message && (
        <div className="mb-4 p-2 bg-yellow-100 border rounded">
          <strong>Info:</strong> {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4" noValidate>
        {/* Product Name */}
        <div>
          <label className="font-semibold">Product Name</label>
          <input type="text" name="name" className="border w-full p-2 mt-1 rounded" value={product.name} onChange={handleInputChange} />
        </div>

        {/* Price */}
        <div>
          <label className="font-semibold">Price</label>
          <input type="number" name="price" className="border w-full p-2 mt-1 rounded" value={product.price} onChange={handleInputChange} />
        </div>

        {/* Stock */}
        <div>
          <label className="font-semibold">Stock</label>
          <input type="number" name="stock" className="border w-full p-2 mt-1 rounded" value={product.stock} onChange={handleInputChange} />
        </div>

        {/* Category */}
        <div>
          <label className="font-semibold">Category</label>
          <select name="category_id" className="border w-full p-2 mt-1 rounded" value={product.category_id} onChange={handleInputChange}>
            <option value="">Select category</option>
            {categories.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
          </select>
        </div>

        {/* Subcategory */}
        <div>
          <label className="font-semibold">Subcategory</label>
          <select name="subcategory_id" className="border w-full p-2 mt-1 rounded" value={product.subcategory_id} onChange={handleInputChange}>
            <option value="">Select subcategory</option>
            {subcategories.map((s) => (<option key={s.id} value={s.id}>{s.name}</option>))}
          </select>
        </div>

        {/* Description */}
        <div className="col-span-2">
          <label className="font-semibold">Description</label>
          <CKEditor editor={ClassicEditor} data={product.description} onChange={(event, editor) => setProduct((prev) => ({ ...prev, description: editor.getData() }))} />
        </div>

        {/* Ingredients */}
        <div className="col-span-2">
          <label className="font-semibold">Ingredients</label>
          <textarea name="ingredients" className="border w-full p-2 mt-1 rounded" rows="4" value={product.ingredients} onChange={handleInputChange} />
        </div>

        {/* Images */}
        {["image1", "image2", "image3", "image4"].map((imgKey) => (
          <div key={imgKey} className="flex flex-col">
            <label className="font-semibold">{imgKey.toUpperCase()}</label>
            <input type="file" name={imgKey} className="mt-1" onChange={handleImageChange} />
            {previewImages[imgKey] && <img src={previewImages[imgKey]} className="h-28 w-28 border mt-2 rounded object-cover" />}
          </div>
        ))}

        <button type="submit" disabled={submitting} className={`col-span-2 p-2 mt-4 rounded text-white ${submitting ? "bg-gray-400" : "bg-blue-600"}`}>
          {submitting ? (isEdit ? "Updating..." : "Adding...") : (isEdit ? "Update Product" : "Add Product")}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
