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
  const [loading, setLoading] = useState(false);

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

  // Load categories
  useEffect(() => {
    axios.get(`${BASE_URL}/api/categories`).then(res => setCategories(res.data));
  }, []);

  // Load product if edit mode
  useEffect(() => {
    if (!isEdit) return;
    setLoading(true);
    axios.get(`${BASE_URL}/api/products/${id}`)
      .then(res => {
        const p = res.data;
        setProduct({
          name: p.name || "",
          price: p.price || "",
          stock: p.stock || "",
          description: p.description || "",
          ingredients: p.ingredients || "",
          category_id: p.category_id || "",
          subcategory_id: p.subcategory_id || "",
        });
        setPreviewImages({
          image1: p.image1 || null,
          image2: p.image2 || null,
          image3: p.image3 || null,
          image4: p.image4 || null,
        });
        return axios.get(`${BASE_URL}/api/subcategories/getbycategory/${p.category_id}`);
      })
      .then(res => setSubcategories(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  // Load subcategories when category changes (Add mode only)
  useEffect(() => {
    if (isEdit) return;
    if (!product.category_id) return setSubcategories([]);
    axios.get(`${BASE_URL}/api/subcategories/getbycategory/${product.category_id}`)
      .then(res => setSubcategories(res.data))
      .catch(err => console.error(err));
  }, [product.category_id]);

  const handleInputChange = e => {
    const { name, value } = e.target;
    setProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = e => {
    const { name, files } = e.target;
    const file = files[0];
    setImages(prev => ({ ...prev, [name]: file }));
    if (file) {
      setPreviewImages(prev => ({ ...prev, [name]: URL.createObjectURL(file) }));
    }
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  const fd = new FormData();
  Object.keys(product).forEach((key) => fd.append(key, product[key]));
  Object.keys(images).forEach((key) => {
    if (images[key]) fd.append(key, images[key]);
  });

  try {
    const token = localStorage.getItem("adminToken"); // <-- get token

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

    navigate("/dashboard/products");
  } catch (err) {
    console.error("Submit error:", err);
  }
};


  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">{isEdit ? "Edit Product" : "Add Product"}</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label>Product Name</label>
          <input name="name" value={product.name} onChange={handleInputChange} className="border p-2 w-full" required />
        </div>
        <div>
          <label>Price</label>
          <input name="price" type="number" value={product.price} onChange={handleInputChange} className="border p-2 w-full" required />
        </div>
        <div>
          <label>Stock</label>
          <input name="stock" type="number" value={product.stock} onChange={handleInputChange} className="border p-2 w-full" required />
        </div>
        <div>
          <label>Category</label>
          <select name="category_id" value={product.category_id} onChange={handleInputChange} className="border p-2 w-full" required>
            <option value="">Select category</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label>Subcategory</label>
          <select name="subcategory_id" value={product.subcategory_id} onChange={handleInputChange} className="border p-2 w-full" required>
            <option value="">Select subcategory</option>
            {subcategories.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>

        <div className="col-span-2">
          <label>Description</label>
          <CKEditor
            editor={ClassicEditor}
            data={product.description}
            onChange={(event, editor) => setProduct(prev => ({ ...prev, description: editor.getData() }))}
          />
        </div>

        <div className="col-span-2">
          <label>Ingredients</label>
          <textarea name="ingredients" value={product.ingredients} onChange={handleInputChange} className="border p-2 w-full" rows="4" />
        </div>

        {["image1","image2","image3","image4"].map(key => (
          <div key={key}>
            <label>{key.toUpperCase()}</label>
            <input type="file" name={key} onChange={handleImageChange} className="mt-1" />
            {previewImages[key] && <img src={previewImages[key]} className="h-28 w-28 border mt-2 rounded object-cover" />}
          </div>
        ))}

        <button type="submit" className="col-span-2 bg-blue-600 text-white p-2 rounded mt-4">{isEdit ? "Update Product" : "Add Product"}</button>
      </form>
    </div>
  );
};

export default AddProduct;
