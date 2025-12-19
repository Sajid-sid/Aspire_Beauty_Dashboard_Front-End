import React, { useEffect, useState } from "react";
import axios from "axios";
import AddVariant from "../components/AddVariant";

export default function Variants() {
  const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

  const [variants, setVariants] = useState([]);
  const [refresh, setRefresh] = useState(false);

  // edit target
  const [editVariant, setEditVariant] = useState(null);

  const fetchVariants = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/variants`);
      const data = Array.isArray(res.data)
        ? res.data
        : res.data?.data || res.data?.variants || [];
      setVariants(data);
    } catch (err) {
      console.error("Failed to fetch variants", err);
      setVariants([]);
    }
  };

  useEffect(() => {
    fetchVariants();
  }, [refresh]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this variant?")) return;
    try {
      await axios.delete(`${BASE_URL}/api/variants/${id}`);
      setRefresh((p) => !p);
    } catch (err) {
      console.error(err);
      alert("Failed to delete variant");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Variants Management</h1>

      {/* ADD / EDIT FORM */}
      <AddVariant
        editVariant={editVariant}
        onCancelEdit={() => setEditVariant(null)}
        onSuccess={() => {
          setEditVariant(null);
          setRefresh((p) => !p);
        }}
      />

      {/* TABLE */}
      <div className="mt-8 overflow-x-auto">
        <table className="min-w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-3 py-2">ID</th>
              <th className="border px-3 py-2">Product</th>
              <th className="border px-3 py-2">Variant</th>
              <th className="border px-3 py-2">Price</th>
              <th className="border px-3 py-2">Stock</th>
              <th className="border px-3 py-2">Variant Image</th>
              <th className="border px-3 py-2">Product Image</th>
              <th className="border px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {variants.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-4 text-gray-500">
                  No variants found
                </td>
              </tr>
            ) : (
              variants.map((v) => (
                <tr key={v.stockId} className="hover:bg-gray-50">
                  <td className="border px-3 py-2">{v.stockId}</td>
                  <td className="border px-3 py-2">{v.productname}</td>
                  <td className="border px-3 py-2">{v.varient}</td>
                  <td className="border px-3 py-2">₹{v.price}</td>
                  <td className="border px-3 py-2">{v.stock}</td>

                  {/* Variant Image */}
                  <td className="border px-3 py-2 text-center">
                    {v.varient_image ? (
                      <img
                        src={v.varient_image}
                        alt={v.varient}
                        className="h-12 w-12 object-cover rounded mx-auto"
                      />
                    ) : (
                      "—"
                    )}
                  </td>

                  {/* Product Image */}
                  <td className="border px-3 py-2 text-center">
                    {v.product_image ? (
                      <img
                        src={v.product_image}
                        alt={v.productname}
                        className="h-12 w-12 object-cover rounded mx-auto"
                      />
                    ) : (
                      "—"
                    )}
                  </td>

                  <td className="border px-3 py-2 space-x-2 text-center">
                    <button
                      onClick={() => setEditVariant(v)}
                      className="bg-indigo-600 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(v.stockId)}
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
