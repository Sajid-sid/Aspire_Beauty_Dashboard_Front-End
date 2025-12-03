import React, { useEffect, useState } from "react";
import axios from "axios";

const Users = () => {
  const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("adminToken");

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/users/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUsers(res.data.users);
      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) return <p className="p-4 text-gray-600">Loading users...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">All Users</h1>

      <div className="bg-white shadow-xl rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-3 text-left">ID</th>
              <th className="px-4 py-3 text-left">Profile</th>
              <th className="px-4 py-3 text-left">Full Name</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Mobile</th>
              <th className="px-4 py-3 text-left">Notify</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u, index) => (
              <tr
                key={u.id}
                className={`
                  ${index % 2 === 0 ? "bg-white" : "bg-gray-50"} 
                  hover:bg-gray-100 transition
                `}
              >
                <td className="px-4 py-3 border-t text-gray-700">{u.id}</td>

                <td className="px-4 py-3 border-t">
                  <img
                    src={u.profile}
                    alt="profile"
                    className="w-11 h-11 rounded-full border object-cover shadow-sm"
                  />
                </td>

                <td className="px-4 py-3 border-t font-medium text-gray-800">
                  {u.fullname}
                </td>

                <td className="px-4 py-3 border-t text-gray-700">
                  {u.email}
                </td>

                <td className="px-4 py-3 border-t text-gray-700">
                  {u.mobile}
                </td>

                <td className="px-4 py-3 border-t">
                  {u.notify === 1 ? (
                    <span className="px-3 py-1 text-sm rounded-full bg-green-100 text-green-700 font-semibold">
                      Yes
                    </span>
                  ) : (
                    <span className="px-3 py-1 text-sm rounded-full bg-red-100 text-red-700 font-semibold">
                      No
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {users.length === 0 && (
          <p className="p-6 text-gray-600 text-center">No users found.</p>
        )}
      </div>
    </div>
  );
};

export default Users;
