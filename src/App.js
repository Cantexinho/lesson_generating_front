import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Playground from "./pages/Playground";
import Register from "./pages/Register";
import Home from "./pages/Home";
import PostLogin from "./pages/PostLogin";
import Support from "./pages/Support";
import Business from "./pages/Business";
import NewsPage from "./pages/News";
import ArticlePage from "./pages/Article";
import { useSyncDarkMode } from "./hooks/useSyncDarkMode";
import { trackPageView } from "./analytics";
import { useEffect } from "react";
import ProtectedRoute from "./auth/protectedRoute";

function App() {
  const location = useLocation();

  useSyncDarkMode();

  useEffect(() => {
    trackPageView();
  }, [location]);

  return (
    <Routes>
      <Route exact path="/login" element={<Login />} />
      <Route exact path="/post_login" element={<PostLogin />} />
      <Route exact path="/register" element={<Register />} />
      <Route exact path="/support" element={<Support />} />
      <Route exact path="/business" element={<Business />} />
      <Route path="/news" element={<Navigate to="/news/page/1" replace />} />
      <Route path="/news/page/:page" element={<NewsPage />} />
      <Route path="/news/:slug" element={<ArticlePage />} />
      <Route path="/home" element={<Home />} />
      <Route path="/" element={<Home />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/playground" element={<Playground />} />
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

function Wrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default Wrapper;
