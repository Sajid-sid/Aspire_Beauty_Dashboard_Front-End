import React, { useEffect, useState } from "react";
import axios from "axios";

export default function VariantStockList() {
  const [variants, setVariants] = useState([]);

  const fetchVariants = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/stock`);

      const data = Array.isArray(res.data)
        ? res.data
        : res.data.variants || res.data.data || [];

      setVariants(data);
    } catch (error) {
      console.error("Failed to fetch variants", error);
      setVariants([]);
    }
  };

  useEffect(() => {
    fetchVariants();
  }, []);

  const addStock = async (id) => {
    const qty = prompt("Enter stock quantity");
    if (!qty || isNaN(qty)) return;

    try {
      await axios.put(`/api/stock/add-stock/${id}`, {
        quantity: Number(qty),
      });
      fetchVariants();
    } catch (error) {
      console.error("Failed to add stock", error);
    }
  };

  return (
    <div className="mt-6 bg-white shadow-lg rounded-xl p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Variant Stock Management
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-200 rounded-lg">
          <thead className="bg-gray-100 text-gray-700 text-sm">
            <tr>
              <th className="p-3 text-left">Product</th>
              <th className="p-3 text-left">Variant</th>
              <th className="p-3 text-center">Stock</th>
              <th className="p-3 text-center">Pending</th>
              <th className="p-3 text-center">Confirmed</th>
              <th className="p-3 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {variants.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-6 text-center text-gray-500">
                  No variants found
                </td>
              </tr>
            ) : (
              variants.map((v) => (
                <tr
                  key={v.stockId}
                  className="border-t hover:bg-gray-50 transition"
                >
                  {/* Product */}
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={v.product_image}
                        alt={v.productname}
                        className="w-12 h-12 rounded-md object-cover border"
                      />
                      <span className="font-medium text-gray-800">
                        {v.productname}
                      </span>
                    </div>
                  </td>

                  {/* Variant */}
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={v.varient_image}
                        alt={v.varient}
                        className="w-10 h-10 rounded-md object-cover border"
                      />
                      <span className="capitalize">{v.varient}</span>
                    </div>
                  </td>

                  {/* Stock */}
                  <td className="p-3 text-center font-semibold text-blue-600">
                    {v.stock}
                  </td>

                  {/* Pending */}
                  <td className="p-3 text-center text-orange-500">
                    {v.pending}
                  </td>

                  {/* Confirmed */}
                  <td className="p-3 text-center text-green-600">
                    {v.confirmed}
                  </td>

                  {/* Action */}
                  <td className="p-3 text-center">
                    <button
                      onClick={() => addStock(v.stockId)}
                      className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                    >
                      + Add Stock
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
