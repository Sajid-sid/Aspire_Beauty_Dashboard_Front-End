import React from "react";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4 sm:p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 sm:mb-8 text-center">
          Dashboard Overview
        </h2>

        {/* Cards Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Total Products */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-md hover:shadow-xl transition duration-300 border-t-4 border-blue-500">
            <p className="text-gray-600 text-sm font-medium">Total Products</p>
            <h3 className="text-3xl sm:text-4xl font-semibold text-gray-900 mt-2">
              24
            </h3>
          </div>

          {/* Active Categories */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-md hover:shadow-xl transition duration-300 border-t-4 border-green-500">
            <p className="text-gray-600 text-sm font-medium">Active Categories</p>
            <h3 className="text-3xl sm:text-4xl font-semibold text-gray-900 mt-2">
              8
            </h3>
          </div>

          {/* Pending Orders */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-md hover:shadow-xl transition duration-300 border-t-4 border-yellow-500">
            <p className="text-gray-600 text-sm font-medium">Pending Orders</p>
            <h3 className="text-3xl sm:text-4xl font-semibold text-gray-900 mt-2">
              5
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
