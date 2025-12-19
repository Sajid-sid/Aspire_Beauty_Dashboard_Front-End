import React, { useEffect, useState } from "react";
import axios from "axios";

export default function VariantStockList() {
  const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

  const [variants, setVariants] = useState([]);
  const [editing, setEditing] = useState(null);
  const [editData, setEditData] = useState({
    varient: "",
    price: "",
    stock: "",
  });

  const fetchVariants = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/variants`);
      setVariants(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Failed to fetch variants", error);
    }
  };

  useEffect(() => {
    fetchVariants();
  }, []);

  const addStock = async (id) => {
    const qty = prompt("Enter stock quantity");
    if (!qty || isNaN(qty)) return;

    try {
      await axios.put(`${BASE_URL}/api/stock/add-stock/${id}`, {
        quantity: Number(qty),
      });
      fetchVariants();
    } catch (error) {
      console.error("Failed to add stock", error);
    }
  };

  const startEdit = (v) => {
    setEditing(v.stockId);
    setEditData({
      varient: v.varient,
      price: v.price,
      stock: v.stock,
    });
  };

  const updateVariant = async (id) => {
    try {
      await axios.put(`${BASE_URL}/api/variants/${id}`, editData);
      setEditing(null);
      fetchVariants();
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  return (
    <div className="mt-6 bg-white shadow-lg rounded-xl p-6">
      <h2 className="text-lg font-semibold mb-4">Variant Stock Management</h2>

      <div className="overflow-x-auto">
        <table className="w-full border rounded-lg">
          <thead className="bg-gray-100 text-sm">
            <tr>
              <th className="p-3 text-left">Product</th>
              <th className="p-3 text-left">Variant</th>
              <th className="p-3 text-center">Price</th>
              <th className="p-3 text-center">Stock</th>
              <th className="p-3 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {variants.map((v) => (
              <tr key={v.stockId} className="border-t">
                {/* Product */}
                <td className="p-3 font-medium">{v.productname}</td>

                {/* Variant */}
                <td className="p-3">
                  {editing === v.stockId ? (
                    <input
                      value={editData.varient}
                      onChange={(e) =>
                        setEditData({ ...editData, varient: e.target.value })
                      }
                      className="border p-1 rounded w-full"
                    />
                  ) : (
                    v.varient
                  )}
                </td>

                {/* Price */}
                <td className="p-3 text-center">
                  {editing === v.stockId ? (
                    <input
                      type="number"
                      value={editData.price}
                      onChange={(e) =>
                        setEditData({ ...editData, price: e.target.value })
                      }
                      className="border p-1 rounded w-24 text-center"
                    />
                  ) : (
                    `₹${v.price}`
                  )}
                </td>

                {/* Stock */}
                <td className="p-3 text-center">
                  {editing === v.stockId ? (
                    <input
                      type="number"
                      value={editData.stock}
                      onChange={(e) =>
                        setEditData({ ...editData, stock: e.target.value })
                      }
                      className="border p-1 rounded w-20 text-center"
                    />
                  ) : (
                    v.stock
                  )}
                </td>

                {/* Actions */}
                <td className="p-3 text-center space-x-2">
                  {editing === v.stockId ? (
                    <>
                      <button
                        onClick={() => updateVariant(v.stockId)}
                        className="px-3 py-1 bg-green-600 text-white rounded"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditing(null)}
                        className="px-3 py-1 bg-gray-400 text-white rounded"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => startEdit(v)}
                        className="px-3 py-1 bg-indigo-600 text-white rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => addStock(v.stockId)}
                        className="px-3 py-1 bg-blue-600 text-white rounded"
                      >
                        + Stock
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
