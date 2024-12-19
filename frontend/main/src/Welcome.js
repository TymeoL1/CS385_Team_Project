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
  // const [showBlogPage, setShowBlogPage] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Array of images
  const images = ["/1.jpg", "/0.jpg"];

  // Automatically switch background images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); // Switch every 5 seconds
    return () => clearInterval(interval); // Clear interval
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
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Manage login state

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
            isLoggedIn ? <BlogPage /> : <Navigate to="/login" /> // Check login state
          }
        />{" "}
        {/* Blog Page */}
      </Routes>
    </Router>
  );
}

export default Welcome;
