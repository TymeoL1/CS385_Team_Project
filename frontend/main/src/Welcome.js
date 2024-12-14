import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
  Navigate,
} from "react-router-dom";
import BlogPage from "./blogPage.js";
import "./App.css";
import SignPage from "./sign_page/src/SignPage";

function WelcomePage() {
  //const [showBlogPage, setShowBlogPage] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // 图片数组
  const images = ["/1.jpg", "/0.jpg"];

  // 自动切换背景图片
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); // 每5秒切换
    return () => clearInterval(interval); // 清除定时器
  }, [images.length]);

  const navigate = useNavigate();

  return (
    <div
      className="welcome-container"
      style={{ backgroundImage: `url(${images[currentImageIndex]})` }}
    >
      <div className="welcome-content">
        <h1 className="welcome-title">Welcome to CS Social Web</h1>
        <div className="button-container">
          <button className="btn" onClick={() => navigate("/login")}>
            Log in
          </button>
        </div>
      </div>
    </div>
  );
}

function Welcome() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 登录状态管理

  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomePage />} /> {/* Welcome Page */}
        <Route
          path="/login"
          element={<SignPage setIsLoggedIn={setIsLoggedIn} />}
        />{" "}
        {/* Sign Page */}
        <Route
          path="/blog"
          element={
            isLoggedIn ? <BlogPage /> : <Navigate to="/login" /> // 检查登录状态
          }
        />{" "}
        {/* Blog Page */}
      </Routes>
    </Router>
  );
}

export default Welcome;
