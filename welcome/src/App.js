import React, { useState } from "react"; // 导入 React 和 useState
import axios from "axios"; // 导入 Axios，用于发起 HTTP 请求
import "./style.css";

const App = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

//登录组件
  const Login = async () => {
    try {
      // 用户名和密码发送到后端
      const response = await axios.post("http://localhost:5000/login", {
        username,
        password,
      });
      //成功返回提示
      setMessage(response.data.message); 
    } catch (error) {
      //登录失败显示错误消息
      setMessage("Error, please try again"); 
    }
  };

  return (
    <div className = "titie">
      <h1>CS385 Bolg Programme</h1>

      <div className = "table">
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      </div>

      <div className = "table">
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      </div>
      <div className="botton">
      <button onClick={Login}>Login</button>
      </div>
      <p className="message">{message}</p>

  
    </div>
  );
};

export default App; 
