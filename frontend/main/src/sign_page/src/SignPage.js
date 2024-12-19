import React, { useState, useEffect } from "react";
import axios from "axios";
import "./style.css";
import { useNavigate } from "react-router-dom";

const SignPage = ({ setIsLoggedIn }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();

  // Array of background images
  const images = ["/1.jpg", "/0.jpg"];

  // Automatically switch background images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000); // Switch every 4 seconds
    return () => clearInterval(interval); // Clear interval
  }, [images.length]);

  // Login logic
  const Login = async () => {
    try {
      const response = await axios.post("http://localhost:5000/login", {
        username,
        password,
      });
      if (response.data.success) {
        setMessage(response.data.message);
        setIsLoggedIn(true);
        navigate("/blog");
      } else {
        setMessage(response.data.message);
      }
    } catch (error) {
      setMessage("Error, please try again");
    }
  };

  return (
    <div
      className="welcome-container"
      style={{ backgroundImage: `url(${images[currentImageIndex]})` }}
    >
      <div className="welcome-content">
        <h1 className="welcome-title">Welcome to CS Social Web</h1>
        <div className="sign-form">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="sign-input"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="sign-input"
          />
          <button onClick={Login} className="btn">
            Login
          </button>
          <p className="message">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default SignPage;
