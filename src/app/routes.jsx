import { Route, Routes, Navigate } from "react-router-dom";
import React, { memo } from "react";
import Login from "pages/Login";
import Playground from "pages/Playground";
import Register from "pages/Register";
import Home from "pages/Home";
import PostLogin from "pages/PostLogin";
import Support from "pages/Support";
import Business from "pages/Business";
import NewsPage from "pages/News";
import ArticlePage from "pages/Article";
import ProtectedRoute from "features/auth/protectedRoute";
import Layout from "shared/components/Layout/Layout";

export const AppRoutes = memo(() => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/post_login" element={<PostLogin />} />
      <Route path="/register" element={<Register />} />
      <Route path="/playground" element={<Playground />} />
      <Route element={<Layout />}>
        <Route path="/support" element={<Support />} />
        <Route path="/business" element={<Business />} />
        <Route path="/news" element={<Navigate to="/news/page/1" replace />} />
        <Route path="/news/page/:page" element={<NewsPage />} />
        <Route path="/news/:slug" element={<ArticlePage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/" element={<Home />} />
      </Route>
      {/* <Route element={<ProtectedRoute />}>
      </Route> */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
});

