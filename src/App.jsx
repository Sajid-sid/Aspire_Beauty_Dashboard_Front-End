import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, } from "react-router-dom";

// Pages & Components
import Login from "./pages/Login";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Categories from "./pages/Categories";
import Subcategories from "./pages/Subcategories";
import Orders from "./pages/Orders";
import Users from "./pages/Users";
import AddSubCategory from "./components/AddSubCategory";
import AddProduct from "./components/AddProduct";
import Banner from "./pages/Banner";
import OrderDetails from "./pages/OrderDetails";
import StockPage from "./pages/StockPage";
import Variants from "./pages/Variants";
import ProductDetailsPage from "./pages/ProductDetailsPage";


const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      <Routes>
        {/* Login Page */}
        <Route path="/" element={<Login onLogin={() => setIsLoggedIn(true)} />} />

        {/* Protected Dashboard Routes */}
        <Route
          path="/dashboard/*"
          element={isLoggedIn ? <Layout /> : <Navigate to="/" replace />}
        >
          <Route index element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="categories" element={<Categories />} />
          <Route path="subcategories" element={<Subcategories />} />
          <Route path="orders" element={<Orders />} />
          <Route path="stock" element={ <StockPage /> } />
          <Route path="product-details/:productId" element={<ProductDetailsPage />} />
          <Route path="variant" element={ <Variants /> } />
          <Route path="users" element={<Users />} />
          <Route path="banner" element={ <Banner /> } />
          


          {/* Add/Edit Routes */}
          <Route path="add-subcategory" element={<AddSubCategory />} />
          <Route path="add-subcategory/:id" element={<AddSubCategory />} />
          <Route path="add-product" element={<AddProduct />} />
          <Route path="add-product/:id" element={<AddProduct />} />
          <Route path='orders/:id' element={ <OrderDetails /> } />
        </Route>

      </Routes>
    </Router>
  );
};

export default App;
