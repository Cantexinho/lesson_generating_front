import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
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
      <Route path="/news" element={<NewsPage />} />
      <Route path="/news/:id" element={<ArticlePage />} />
      <Route path="/home" element={<Home />} />
      <Route path="/" element={<Home />} />
      <Route path="/playground" element={<Playground />} />
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
