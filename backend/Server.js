const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 5000;

// 中间件
app.use(cors());
app.use(bodyParser.json()); 

// 连接 MongoDB 数据库
mongoose
  .connect(
    "mongodb+srv://TymeoL:zaf0TGlzrAe9UwNV@cluster0.oksu7.mongodb.net/CS385",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// 定义用户数据的 Schema 和 Model
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true }, 
  password: { type: String, required: true }, 
});
const User = mongoose.model("User", UserSchema, "users");


// 登录验证接口
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log("收到登录请求:", { username, password });
    const user = await User.findOne({ username, password });
    console.log("数据库查询结果:", user);
    if (user) {
      res.status(200).json({ success: true, message: "Login successful" });
    } else {
      res.status(401).json({ success: false, message: "Invalid username or password" });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: "An error occurred", error: err });
  }
});
// 启动服务器
app.listen(PORT, () => console.log('Server running on http://localhost:5000'));
