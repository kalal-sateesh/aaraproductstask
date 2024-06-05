import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import ProductPage from "../pages/ProductPage";

const PageRoutes = () => {
  return (
    <Routes>
      <Route path="/" Component={Home} />
      <Route path="/product" Component={ProductPage} />
    </Routes>
  );
};

export default PageRoutes;
