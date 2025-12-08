import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const AddProduct = () => {
  const BASE_URL = import.meta.env.VITE_API_URL;

  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [product, setProduct] = useState({
    name: "",
    price: "",
    stock: "",
    description: "",
    ingredients: "",
    category_id: "",
    subcategory_id: "",
  });

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [images, setImages] = useState({
    image1: null,
    image2: null,
    image3: null,
    image4: null,
  });

  const [previewImages, setPreviewImages] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Fetch categories
  useEffect(() => {
    axios.get(`${BASE_URL}/api/categories`).then((res) => {
      setCategories(res.data);
    });
  }, []);

  // Fetch subcategories
  useEffect(() => {
    if (product.category_id) {
      axios
        .get(`${BASE_URL}/api/subcategories/getbycategory/${product.category_id}`)
        .then((res) => setSubcategories(res.data));
    } else {
      setSubcategories([]);
    }
  }, [product.category_id]);

 

  // Fetch product (edit)
 useEffect(() => {
  if (!isEdit) return;

  const fetchData = async () => {
    const res = await axios.get(`${BASE_URL}/api/products/${id}`);
    const p = res.data;

    // Fetch subcategories
    const subs = await axios.get(
      `${BASE_URL}/api/subcategories/getbycategory/${p.category_id}`
    );
    setSubcategories(subs.data);

    // FIX: convert numbers to string
    setProduct({
      name: p.name || "",
      price: String(p.price ?? ""),
      stock: String(p.stock ?? ""),
      description: p.description || "",
      ingredients: p.ingredients || "",
      category_id: String(p.category_id ?? ""),
      subcategory_id: String(p.subcategory_id ?? ""),
    });

    // Images
    setPreviewImages({
      image1: p.image1,
      image2: p.image2,
      image3: p.image3,
      image4: p.image4,
    });
  };

  fetchData();
}, [id]);



  const handleInputChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setImages({ ...images, [name]: files[0] });

    setPreviewImages({
      ...previewImages,
      [name]: URL.createObjectURL(files[0]),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!product.name || !product.price || !product.category_id) {
      setMessage("Name, price, and category are required!");
      return;
    }

    if (!isEdit && !images.image1) {
      setMessage("Main image is required!");
      return;
    }

    const formData = new FormData();
    Object.entries(product).forEach(([k, v]) => formData.append(k, v));
    Object.entries(images).forEach(([k, v]) => {
      if (v instanceof File) formData.append(k, v);
    });

    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken");

      const url = isEdit
        ? `${BASE_URL}/api/products/${id}`
        : `${BASE_URL}/api/products`;

      await axios({
        method: isEdit ? "put" : "post",
        url,
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage("Saved successfully!");
      setTimeout(() => navigate("/dashboard/products"), 900);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex justify-center p-3 overflow-x-hidden">
     <div className="
  bg-white rounded-xl shadow-xl 
  w-full 
  max-w-[100vw] 
  p-5 mx-auto 
  min-w-0 
  overflow-hidden
">

        <h2 className="text-xl font-bold text-[#03619E] mb-4 text-center">
          {isEdit ? "Edit Product" : "Add New Product"}
        </h2>

        {message && (
          <p className="text-center font-medium text-green-600 mb-4">
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Category */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold">Category</label>
            <select
              name="category_id"
              value={product.category_id}
              onChange={handleInputChange}
              className="w-full border rounded-lg p-2"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Subcategory */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold">Subcategory</label>
            <select
              name="subcategory_id"
              value={product.subcategory_id}
              onChange={handleInputChange}
              className="w-full border rounded-lg p-2"
              disabled={!product.category_id}
            >
              <option value="">Select Subcategory</option>
              {subcategories.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.name}
                </option>
              ))}
            </select>
          </div>

          {/* Product Name */}
          <div className="space-y-2">
            <label className="text-sm font-semibold">Product Name</label>
            <input
              type="text"
              name="name"
              value={product.name}
              onChange={handleInputChange}
              className="border rounded-lg p-2 w-full"
              placeholder="Enter product name"
            />
          </div>

          {/* Price & Stock */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-semibold">Price</label>
              <input
                type="number"
                name="price"
                value={product.price}
                onChange={handleInputChange}
                className="border rounded-lg p-2 w-full"
                placeholder="Price"
              />
            </div>

            <div>
              <label className="text-sm font-semibold">Stock</label>
              <input
                type="number"
                name="stock"
                value={product.stock}
                onChange={handleInputChange}
                className="border rounded-lg p-2 w-full"
                placeholder="Stock"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold mb-1">
              Description
            </label>

            <div className="border rounded-lg overflow-hidden w-full">
              <CKEditor
                editor={ClassicEditor}
                data={product.description}
                onChange={(event, editor) =>
                  setProduct({ ...product, description: editor.getData() })
                }
              />
            </div>
          </div>

          {/* Ingredients */}
          <div>
            <label className="block text-sm font-semibold mb-1">
              Ingredients
            </label>
            <textarea
              name="ingredients"
              value={product.ingredients}
              onChange={handleInputChange}
              rows={3}
              className="w-full border rounded-lg p-2"
              placeholder="Enter ingredients"
            ></textarea>
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Product Images
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {["image1", "image2", "image3", "image4"].map((key) => (
                <div key={key} className="flex flex-col items-center w-full">
                  <input
                    type="file"
                    name={key}
                    accept="image/*"
                    onChange={handleFileChange}
                    className="text-xs mb-2 w-full"
                  />
                  {previewImages[key] && (
                    <img
                      src={
                        previewImages[key].startsWith("blob")
                          ? previewImages[key]
                          : `${BASE_URL}/uploads/${previewImages[key]
                              .split("/")
                              .pop()}`
                      }
                      className="w-20 h-20 object-cover rounded-lg shadow"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#03619E] hover:bg-blue-900 text-white font-medium py-2 rounded-lg"
          >
            {loading ? "Saving..." : isEdit ? "Update Product" : "Add Product"}
          </button>
        </form>
      </div>

      {/* CKEditor Mobile Fix */}
      <style>{`
  /* Force CKEditor to NEVER exceed mobile width */
  .ck.ck-editor {
    width: 100% !important;
    max-width: 100% !important;
    box-sizing: border-box !important;
  }

  .ck.ck-editor__main,
  .ck.ck-editor__editable {
    width: 100% !important;
    max-width: 100% !important;
    min-width: 0 !important;
    box-sizing: border-box !important;
    overflow: hidden !important;
  }

  /* MOST IMPORTANT: remove CKEditor built-in min-width  */
  .ck.ck-content {
    min-width: 0 !important;
  }

  .ck-editor__top,
  .ck-toolbar,
  .ck.ck-toolbar {
    max-width: 100% !important;
    width: 100% !important;
    overflow: hidden !important;
    flex-wrap: wrap !important;
    box-sizing: border-box !important;
  }

  /* Prevent overflow from toolbar buttons */
  .ck-toolbar__items {
    display: flex !important;
    flex-wrap: wrap !important;
    max-width: 100% !important;
    width: 100% !important;
  }

  /* Prevent any hidden scrollbar content */
  .ck-reset_all,
  .ck-reset_all * {
    max-width: 100% !important;
    box-sizing: border-box !important;
  }

`}</style>


    </div>
  );
};

export default AddProduct;
