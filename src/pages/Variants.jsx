import React, { useEffect, useState } from "react";
import axios from "axios";
import AddVariant from "../components/AddVariant";

export default function Variants() {
  const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";
  const [variants, setVariants] = useState([]);
  const [refresh, setRefresh] = useState(false);

  const fetchVariants = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/variants`);

      let safeArray = [];

      if (Array.isArray(res.data)) {
        safeArray = res.data;
      } else if (Array.isArray(res.data?.data)) {
        safeArray = res.data.data;
      } else if (Array.isArray(res.data?.products)) {
        safeArray = res.data.products;
      }

      setVariants(safeArray);
    } catch (error) {
      console.error("Failed to fetch variants", error);
      setVariants([]);
    }
  };

  useEffect(() => {
    fetchVariants();
  }, [refresh]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this variant?")) return;

    try {
      await axios.delete(`${BASE_URL}/api/variants/${id}`);
      setRefresh((prev) => !prev);
    } catch (error) {
      console.error(error);
      alert("Failed to delete variant.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Variants Management</h1>

      <AddVariant onSuccess={() => setRefresh((prev) => !prev)} />

      <div className="mt-8 overflow-x-auto">
        <table className="min-w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">ID</th>
              <th className="px-4 py-2 border">Product</th>
              <th className="px-4 py-2 border">Variant</th>
              <th className="px-4 py-2 border">Variant Image</th>
              <th className="px-4 py-2 border">Product Image</th>
              <th className="px-4 py-2 border">Stock</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>

          <tbody>
            {!Array.isArray(variants) || variants.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-4">
                  No variants found.
                </td>
              </tr>
            ) : (
              variants.map((v) => (
                <tr key={v.stockId}>
                  <td className="px-4 py-2 border">{v.stockId}</td>
                  <td className="px-4 py-2 border">{v.productname}</td>
                  <td className="px-4 py-2 border">{v.varient}</td>
                  <td className="px-4 py-2 border">
                    {v.varient_image && (
                      <img src={v.varient_image} className="h-12 w-12 object-cover" />
                    )}
                  </td>
                  <td className="px-4 py-2 border">
                    {v.product_image && (
                      <img src={v.product_image} className="h-12 w-12 object-cover" />
                    )}
                  </td>
                  <td className="px-4 py-2 border">{v.stock}</td>
                  <td className="px-4 py-2 border">
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
