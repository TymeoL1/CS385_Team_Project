import React, { useState } from "react"; 
import axios from "axios"; 
//HTTP
import "./style.css";
import { useNavigate } from "react-router-dom";

const SignPage = ({ setIsLoggedIn }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  //new!
  const navigate = useNavigate();
//登录组件
  const Login = async () => {
    try {
      // 用户名和密码发送到后端
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
    <div className="title">
      <h1>CS385 Blog Programme</h1>

      <div className="table">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>

      <div className="table">
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <div className="button">
        <button onClick={Login}>Login</button>
      </div>

      <p className="message">{message}</p>
    </div>
  );
};

export default SignPage;