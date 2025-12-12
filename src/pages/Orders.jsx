import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Orders = () => {
  const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Sorting
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/orders`);
      setOrders(res.data.orders);
      setFilteredOrders(res.data.orders);
    } catch (error) {
      console.log("Error getting the orders:", error.message);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // SEARCH + STATUS FILTER
  useEffect(() => {
    let list = [...orders];

    list = list.filter((o) =>
      String(o.id).includes(search) ||
      o.fullName.toLowerCase().includes(search.toLowerCase()) ||
      o.phone.includes(search) ||
      o.email.toLowerCase().includes(search.toLowerCase())
    );

    if (statusFilter !== "All") {
      list = list.filter((o) => o.orderStatus === statusFilter);
    }

    setFilteredOrders(list);
    setCurrentPage(1);
  }, [search, statusFilter, orders]);

  // SORT
  const sortOrders = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });

    const sorted = [...filteredOrders].sort((a, b) => {
      if (key === "createdAt") {
        return direction === "asc"
          ? new Date(a.createdAt) - new Date(b.createdAt)
          : new Date(b.createdAt) - new Date(a.createdAt);
      }
      if (key === "totalAmount") {
        return direction === "asc"
          ? a.totalAmount - b.totalAmount
          : b.totalAmount - a.totalAmount;
      }
      if (key === "orderStatus") {
        return direction === "asc"
          ? a.orderStatus.localeCompare(b.orderStatus)
          : b.orderStatus.localeCompare(a.orderStatus);
      }
      return 0;
    });

    setFilteredOrders(sorted);
  };

  // PAGINATION
  const totalPages = Math.ceil(filteredOrders.length / pageSize);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="p-4 sm:p-6 w-full overflow-x-hidden">
      <h2 className="text-xl sm:text-2xl font-semibold mb-4">Orders</h2>

      {/* FILTERS */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between mb-4">
        <input
          type="text"
          placeholder="Search by ID, Name, Phone, Email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-72 p-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full sm:w-48 p-2 border border-gray-300 rounded-md bg-white"
        >
          <option value="All">All Orders</option>
          <option value="Pending">Pending</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto bg-white rounded-lg shadow w-full">
        <table className="w-full border-collapse min-w-[750px]">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 border-b">Order ID</th>
              <th className="p-3 border-b">Customer</th>
              <th className="p-3 border-b">Phone</th>
              <th className="p-3 border-b">Email</th>

              <th
                className="p-3 border-b cursor-pointer"
                onClick={() => sortOrders("totalAmount")}
              >
                Total ⬍
              </th>

              <th className="p-3 border-b">View</th>

              <th
                className="p-3 border-b cursor-pointer"
                onClick={() => sortOrders("createdAt")}
              >
                Date ⬍
              </th>
            </tr>
          </thead>

          <tbody>
            {paginatedOrders.length === 0 ? (
              <tr>
                <td colSpan="7" className="py-6 text-center text-gray-500">
                  No orders found
                </td>
              </tr>
            ) : (
              paginatedOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition border-b">
                  <td className="p-3">{order.id}</td>
                  <td className="p-3">{order.fullName}</td>
                  <td className="p-3">{order.phone}</td>
                  <td className="p-3">{order.email}</td>

                  <td className="p-3 font-semibold">₹{order.totalAmount}</td>

                  {/* VIEW BUTTON */}
                  <td className="p-3">
                    <button
                      onClick={() => navigate(`/dashboard/orders/${order.id}`)}
                      className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      View
                    </button>
                  </td>

                  <td className="p-3">{order.createdAt?.slice(0, 10)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex flex-col sm:flex-row items-center gap-4 mt-5">
        <button
          onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded-md text-white w-full sm:w-auto
            ${currentPage === 1
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
            }`}
        >
          Previous
        </button>

        <span>
          Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
        </span>

        <button
          onClick={() =>
            currentPage < totalPages && setCurrentPage(currentPage + 1)
          }
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded-md text-white w-full sm:w-auto
            ${currentPage === totalPages
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
            }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Orders;
