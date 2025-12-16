import React, { useEffect, useState } from "react";
import axios from "axios";
import AddVariant from "../components/AddVariant";

export default function Variants() {
  const [variants, setVariants] = useState([]);
  const [refresh, setRefresh] = useState(false); // trigger refresh after add/delete

  // Fetch all variants
  const fetchVariants = async () => {
    try {
      const res = await axios.get("http://localhost:5001/api/variants");
      setVariants(res.data);
    } catch (error) {
      console.error("Failed to fetch variants", error);
    }
  };

  useEffect(() => {
    fetchVariants();
  }, [refresh]);

  // Delete a variant
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this variant?")) {
      try {
        await axios.delete(`http://localhost:5001/api/variants/${id}`);
        alert("Variant deleted successfully!");
        setRefresh((prev) => !prev);
      } catch (error) {
        console.error(error);
        alert("Failed to delete variant.");
      }
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Variants Management</h1>

      {/* Add Variant Form */}
      <AddVariant onSuccess={() => setRefresh((prev) => !prev)} />

      {/* Variants Table */}
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
            {variants.map((v) => (
              <tr key={v.stockId}>
                <td className="px-4 py-2 border">{v.stockId}</td>
                <td className="px-4 py-2 border">{v.productname}</td>
                <td className="px-4 py-2 border">{v.varient}</td>
                <td className="px-4 py-2 border">
                  {v.varient_image && (
                    <img src={v.varient_image} alt="" className="h-12 w-12 object-cover" />
                  )}
                </td>
                <td className="px-4 py-2 border">
                  {v.product_image && (
                    <img src={v.product_image} alt="" className="h-12 w-12 object-cover" />
                  )}
                </td>
                <td className="px-4 py-2 border">{v.stock}</td>
                <td className="px-4 py-2 border">
                  <button
                    onClick={() => handleDelete(v.stockId)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {variants.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-4">
                  No variants found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
