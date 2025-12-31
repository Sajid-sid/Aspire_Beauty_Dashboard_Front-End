import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const AddProduct = () => {
  const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const [product, setProduct] = useState({
    name: "",
    sku: "",
    price: "",
    gender: "unisex",
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

  /* ================= LOAD CATEGORIES ================= */
  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/categories`)
      .then((res) => setCategories(res.data))
      .catch(console.error);
  }, []);

  /* ================= LOAD PRODUCT (EDIT MODE) ================= */
  useEffect(() => {
    if (!isEdit) return;

    setLoading(true);
    axios
      .get(`${BASE_URL}/api/products/${id}`)
      .then((res) => {
        const p = res.data;

        setProduct({
          name: p.name || "",
          sku: p.sku || "",
          price: p.price || "",
          gender: p.gender || "unisex",
          category_id: p.category_id || "",
          subcategory_id: p.subcategory_id || "",
        });

        setPreviewImages({
          image1: p.image1 || null,
          image2: p.image2 || null,
          image3: p.image3 || null,
          image4: p.image4 || null,
        });

        return axios.get(
          `${BASE_URL}/api/subcategories/getbycategory/${p.category_id}`
        );
      })
      .then((res) => setSubcategories(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  /* ================= LOAD SUBCATEGORIES (ADD MODE) ================= */
  useEffect(() => {
    if (isEdit) return;
    if (!product.category_id) {
      setSubcategories([]);
      return;
    }

    axios
      .get(
        `${BASE_URL}/api/subcategories/getbycategory/${product.category_id}`
      )
      .then((res) => setSubcategories(res.data))
      .catch(console.error);
  }, [product.category_id, isEdit]);

  /* ================= HANDLERS ================= */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];

    setImages((prev) => ({ ...prev, [name]: file }));

    if (file) {
      setPreviewImages((prev) => ({
        ...prev,
        [name]: URL.createObjectURL(file),
      }));
    }
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const fd = new FormData();
    Object.keys(product).forEach((key) => fd.append(key, product[key]));
    Object.keys(images).forEach((key) => {
      if (images[key]) fd.append(key, images[key]);
    });

    try {
      const token = localStorage.getItem("adminToken");

      if (isEdit) {
        await axios.put(`${BASE_URL}/api/products/${id}`, fd, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        await axios.post(`${BASE_URL}/api/products`, fd, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
      }

      // ✅ backend will emit socket event
      navigate("/dashboard/products");
    } catch (err) {
      console.error("Submit error:", err);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  /* ================= UI ================= */
  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">
        {isEdit ? "Edit Product" : "Add Product"}
      </h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <div>
          <label>Product Name</label>
          <input
            name="name"
            value={product.name}
            onChange={handleInputChange}
            className="border p-2 w-full"
            required
          />
        </div>

        <div>
          <label>SKU</label>
          <input
            name="sku"
            value={product.sku}
            onChange={handleInputChange}
            className="border p-2 w-full"
            required
            disabled={isEdit}
          />
        </div>

        <div>
          <label>Price</label>
          <input
            name="price"
            type="number"
            value={product.price}
            onChange={handleInputChange}
            className="border p-2 w-full"
            required
          />
        </div>

        <div>
          <label>Gender</label>
          <select
            name="gender"
            value={product.gender}
            onChange={handleInputChange}
            className="border p-2 w-full"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="unisex">Unisex</option>
          </select>
        </div>

        <div>
          <label>Category</label>
          <select
            name="category_id"
            value={product.category_id}
            onChange={handleInputChange}
            className="border p-2 w-full"
            required
          >
            <option value="">Select category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Subcategory</label>
          <select
            name="subcategory_id"
            value={product.subcategory_id}
            onChange={handleInputChange}
            className="border p-2 w-full"
            required
          >
            <option value="">Select subcategory</option>
            {subcategories.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        {["image1", "image2", "image3", "image4"].map((key) => (
          <div key={key}>
            <label>{key.toUpperCase()}</label>
            <input
              type="file"
              name={key}
              onChange={handleImageChange}
              className="mt-1"
            />
            {previewImages[key] && (
              <img
                src={previewImages[key]}
                alt={key}
                className="h-28 w-28 border mt-2 rounded object-cover"
              />
            )}
          </div>
        ))}

        <button
          type="submit"
          className="col-span-2 bg-blue-600 text-white p-2 rounded mt-4 hover:bg-blue-700"
        >
          {isEdit ? "Update Product" : "Add Product"}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
