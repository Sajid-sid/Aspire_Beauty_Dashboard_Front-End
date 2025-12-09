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

  // --------------------------
  // Load Categories on Mount
  // --------------------------
  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/categories`)
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Categories fetch error:", err));
  }, []);

  // -------------------------------------------------------
  // Fetch subcategories ONLY IN ADD MODE (PREVENT OVERRIDE)
  // -------------------------------------------------------
  useEffect(() => {
    if (isEdit) return;

    if (product.category_id) {
      axios
        .get(`${BASE_URL}/api/subcategories/getbycategory/${product.category_id}`)
        .then((res) => setSubcategories(res.data))
        .catch((err) => console.error("Subcategory error:", err));
    } else {
      setSubcategories([]);
    }
  }, [product.category_id, isEdit]);

  // -------------------------
  // Load Product in Edit Mode
  // -------------------------
  useEffect(() => {
    if (!isEdit) return;

    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/products/${id}`);
        const p = res.data;

        // fetch subcategories for this product's category
        const subRes = await axios.get(
          `${BASE_URL}/api/subcategories/getbycategory/${p.category_id}`
        );
        setSubcategories(subRes.data);

        // atomic update to avoid overriding fields later
        setProduct({
          name: p.name || "",
          price: String(p.price || ""),
          stock: String(p.stock || ""),
          description: p.description || "",
          ingredients: p.ingredients || "",
          category_id: String(p.category_id || ""),
          subcategory_id: String(p.subcategory_id || ""),
        });

        setPreviewImages({
          image1: p.image1 || null,
          image2: p.image2 || null,
          image3: p.image3 || null,
          image4: p.image4 || null,
        });
      } catch (err) {
        console.error("Edit mode product load error:", err);
      }
    };

    fetchProduct();
  }, [id, isEdit]);

  // ----------------------
  // Input Change Handler
  // ----------------------
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  // ----------------------
  // Image Change Handler
  // ----------------------
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

  // -------------------
  // Submit Handler
  // -------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();

      Object.keys(product).forEach((key) => {
        fd.append(key, product[key]);
      });

      Object.keys(images).forEach((key) => {
        if (images[key]) fd.append(key, images[key]);
      });

      if (isEdit) {
        await axios.put(`${BASE_URL}/api/products/${id}`, fd);
      } else {
        await axios.post(`${BASE_URL}/api/products`, fd);
      }

      navigate("/products");
    } catch (err) {
      console.error("Submit error:", err);
    }
  };

  // -------------------------
  // UI STARTS HERE
  // -------------------------

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">
        {isEdit ? "Edit Product" : "Add Product"}
      </h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {/* Product Name */}
        <div>
          <label className="font-semibold">Product Name</label>
          <input
            type="text"
            name="name"
            className="border w-full p-2 mt-1 rounded"
            value={product.name}
            onChange={handleInputChange}
          />
        </div>

        {/* Price */}
        <div>
          <label className="font-semibold">Price</label>
          <input
            type="number"
            name="price"
            className="border w-full p-2 mt-1 rounded"
            value={product.price}
            onChange={handleInputChange}
          />
        </div>

        {/* Stock */}
        <div>
          <label className="font-semibold">Stock</label>
          <input
            type="number"
            name="stock"
            className="border w-full p-2 mt-1 rounded"
            value={product.stock}
            onChange={handleInputChange}
          />
        </div>

        {/* Category */}
        <div>
          <label className="font-semibold">Category</label>
          <select
            name="category_id"
            className="border w-full p-2 mt-1 rounded"
            value={product.category_id}
            onChange={handleInputChange}
          >
            <option value="">Select category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Subcategory */}
        <div>
          <label className="font-semibold">Subcategory</label>
          <select
            name="subcategory_id"
            className="border w-full p-2 mt-1 rounded"
            value={product.subcategory_id}
            onChange={handleInputChange}
          >
            <option value="">Select subcategory</option>
            {subcategories.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        {/* Description (CKEditor) */}
        <div className="col-span-2">
          <label className="font-semibold">Description</label>
          <CKEditor
            editor={ClassicEditor}
            data={product.description}
            onChange={(event, editor) => {
              const data = editor.getData();
              setProduct((prev) => ({ ...prev, description: data }));
            }}
          />
        </div>

        {/* Ingredients */}
        <div className="col-span-2">
          <label className="font-semibold">Ingredients</label>
          <textarea
            name="ingredients"
            className="border w-full p-2 mt-1 rounded"
            rows="4"
            value={product.ingredients}
            onChange={handleInputChange}
          />
        </div>

        {/* IMAGES */}
        {["image1", "image2", "image3", "image4"].map((imgKey) => (
          <div key={imgKey} className="flex flex-col">
            <label className="font-semibold">{imgKey.toUpperCase()}</label>
            <input
              type="file"
              name={imgKey}
              className="mt-1"
              onChange={handleImageChange}
            />

            {previewImages[imgKey] && (
              <img
                src={previewImages[imgKey]}
                className="h-28 w-28 border mt-2 rounded object-cover"
              />
            )}
          </div>
        ))}

        <button
          type="submit"
          className="col-span-2 bg-blue-600 text-white p-2 rounded mt-4"
        >
          {isEdit ? "Update Product" : "Add Product"}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
