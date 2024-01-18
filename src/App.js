import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Playground from "./pages/Playground";
import Register from "./pages/Register";
import Home from "./pages/Home";
import PostLogin from "./pages/PostLogin";
import Support from "./pages/Support";
import Business from "./pages/Business";

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/post_login" element={<PostLogin />} />
        <Route exact path="/register" element={<Register />} />
        <Route exact path="/Support" element={<Support />} />
        <Route exact path="/Business" element={<Business />} />
        <Route path="/home" element={<Home />} />
        <Route path="/" element={<Home />} />
        <Route path="/playground" element={<Playground />} />
      </Routes>
    </Router>
  );
}

export default App;
