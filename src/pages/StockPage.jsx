import React, { useEffect, useState } from "react";
import axios from "axios";

export default function StockPage() {
  const [variants, setVariants] = useState([]);
  const [quantities, setQuantities] = useState({}); // for input per variant

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
  }, []);

  // Handle input change for stock quantity
  const handleChange = (id, value) => {
    setQuantities({ ...quantities, [id]: value });
  };

  // Add stock
  const handleAddStock = async (id) => {
    const quantity = parseInt(quantities[id]);
    if (!quantity || quantity <= 0) {
      alert("Enter a valid quantity!");
      return;
    }

    try {
      await axios.put(`http://localhost:5001/api/stock/add/${id}`, { quantity });
      alert("Stock updated successfully!");
      setQuantities({ ...quantities, [id]: "" });
      fetchVariants(); // refresh table
    } catch (error) {
      console.error(error);
      alert("Failed to update stock");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Stock</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">ID</th>
              <th className="px-4 py-2 border">Product</th>
              <th className="px-4 py-2 border">Variant</th>
              <th className="px-4 py-2 border">Stock</th>
              <th className="px-4 py-2 border">Pending</th>
              <th className="px-4 py-2 border">Confirmed</th>
              <th className="px-4 py-2 border">Add Stock</th>
            </tr>
          </thead>
          <tbody>
            {variants.map((v) => (
              <tr key={v.stockId}>
                <td className="px-4 py-2 border">{v.stockId}</td>
                <td className="px-4 py-2 border">{v.productname}</td>
                <td className="px-4 py-2 border">{v.varient}</td>
                <td className="px-4 py-2 border">{v.stock}</td>
                <td className="px-4 py-2 border">{v.pending}</td>
                <td className="px-4 py-2 border">{v.confirmed}</td>
                <td className="px-4 py-2 border flex gap-2">
                  <input
                    type="number"
                    min="1"
                    value={quantities[v.stockId] || ""}
                    onChange={(e) => handleChange(v.stockId, e.target.value)}
                    placeholder="Qty"
                    className="border rounded p-1 w-20"
                  />
                  <button
                    onClick={() => handleAddStock(v.stockId)}
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                  >
                    Add
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
