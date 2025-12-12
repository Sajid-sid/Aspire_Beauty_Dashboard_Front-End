import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [itemUpdating, setItemUpdating] = useState(null);

  const fetchOrder = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/orders/${id}`);
      console.log(res.data.order);
      setOrder(res.data.order);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching order:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, []);

  // =============================
  // Update MAIN ORDER STATUS
  // =============================
  const updateStatus = async (newStatus) => {
    try {
      setStatusUpdating(true);
      const token = localStorage.getItem("adminToken");

      await axios.put(
        `${BASE_URL}/api/orders/status/${id}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setOrder({ ...order, orderStatus: newStatus });
      setStatusUpdating(false);
    } catch (error) {
      console.error("Status update error:", error);
      setStatusUpdating(false);
    }
  };

  // =============================
  // Update INDIVIDUAL ITEM STATUS
  // =============================
  const updateItemStatus = async (itemId, newStatus) => {
    try {
      setItemUpdating(itemId);

      const token = localStorage.getItem("adminToken");
      await axios.put(
        `${BASE_URL}/api/orders/item-status/${itemId}`,
        { itemStatus: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setOrder({
        ...order,
        items: order.items.map((i) =>
          i.id === itemId ? { ...i, itemStatus: newStatus } : i
        ),
      });

      setItemUpdating(null);
    } catch (error) {
      console.error("Item status update error:", error);
      setItemUpdating(null);
    }
  };

  if (loading) return <div className="p-6 text-center">Loading order...</div>;
  if (!order) return <div className="p-6 text-center text-red-600">Order not found</div>;

  return (
    <div className="p-4 sm:p-6 w-full">
      <button
        onClick={() => navigate(-1)}
        className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-800 mb-4"
      >
        ⬅ Back
      </button>

      <h2 className="text-2xl font-semibold mb-4">
        Order Details #{order.id}
      </h2>

      {/* ORDER INFO */}
      <div className="bg-white p-4 shadow rounded-lg mb-6">
        <p><strong>Name:</strong> {order.fullName}</p>
        <p><strong>Email:</strong> {order.email}</p>
        <p><strong>Phone:</strong> {order.phone}</p>
        <p><strong>Address:</strong> {order.address}</p>
        <p><strong>Total:</strong> ₹{order.totalAmount}</p>
        <p><strong>Status:</strong> {order.orderStatus}</p>
        <p><strong>Date:</strong> {order.createdAt?.slice(0, 10)}</p>
      </div>

      {/* MAIN ORDER STATUS BUTTONS */}
      <div className="flex flex-wrap gap-3 mb-6">
        {["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"].map(
          (status) => (
            <button
              key={status}
              disabled={statusUpdating}
              onClick={() => updateStatus(status)}
              className={`px-4 py-2 rounded-md text-white ${
                order.orderStatus === status
                  ? "bg-green-600"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {statusUpdating ? "Updating..." : status}
            </button>
          )
        )}
      </div>

      {/* ORDER ITEMS */}
      <h3 className="text-xl font-semibold mb-3">Order Items</h3>

      {/* ORDER ITEMS AS RECTANGULAR CARDS */}
<div className="space-y-4">
  {order.items.length === 0 ? (
    <div className="text-center p-4 text-gray-500 bg-white shadow rounded-lg">
      No items found
    </div>
  ) : (
    order.items.map((item) => (
      <div 
        key={item.id}
        className="bg-white p-4 rounded-lg shadow border flex flex-col sm:flex-row gap-4"
      >
        {/* IMAGE */}
        <img
          src={item.productImage || item.imageUrl}
          alt={item.productName}
          className="w-28 h-28 object-cover rounded-md border"
        />

        {/* DETAILS */}
        <div className="flex-1 space-y-1">
          <h3 className="text-lg font-semibold">{item.productName}</h3>
          <p><strong>Qty:</strong> {item.quantity}</p>
          <p><strong>Price:</strong> ₹{item.price}</p>

          {/* STOCK */}
          <p>
            <strong>Stock:</strong>{" "}
            {item.productStock === null || item.productStock === undefined ? (
              <span className="text-gray-500">N/A</span>
            ) : item.productStock >= item.quantity ? (
              <span className="text-green-600 font-semibold">
                In Stock ({item.productStock})
              </span>
            ) : (
              <span className="text-red-600 font-semibold">
                Low Stock ({item.productStock})
              </span>
            )}
          </p>

          {/* STATUS */}
          <p>
            <strong>Item Status:</strong>{" "}
            <span className="font-semibold">{item.itemStatus}</span>
          </p>
        </div>

        {/* UPDATE DROPDOWN */}
        <div className="flex items-start">
          <select
            value={item.itemStatus}
            onChange={(e) => updateItemStatus(item.id, e.target.value)}
            disabled={itemUpdating === item.id}
            className="border px-3 py-2 rounded-md bg-white"
          >
            {["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"].map(
              (status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              )
            )}
          </select>
        </div>
      </div>
    ))
  )}
</div>

    </div>
  );
};

export default OrderDetails;
