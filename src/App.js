import React, { useState, useEffect } from "react";
import BlogPage from "./blogPage";
import "./App.css";

function App() {
  const [showBlogPage, setShowBlogPage] = useState(false);
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

  if (showBlogPage) {
    return <BlogPage />;
  }

  return (
    <div
      className="welcome-container"
      style={{ backgroundImage: `url(${images[currentImageIndex]})` }}
    >
      <div className="welcome-content">
        <h1 className="welcome-title">Welcome to My Website</h1>
        <div className="button-container">
          <button className="btn" onClick={() => alert("Log in clicked!")}>
            Log in
          </button>
          <button className="btn" onClick={() => setShowBlogPage(true)}>
            Blog
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
