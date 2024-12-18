const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

mongoose
  .connect(
    "mongodb+srv://TymeoL:zaf0TGlzrAe9UwNV@cluster0.oksu7.mongodb.net/CS385",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));


const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
});
const User = mongoose.model("User", UserSchema, "users");

// define the type of data
const PostSchema = new mongoose.Schema({
  course: { type: String, required: true },    
  content: { type: String, required: true },   
  date: { type: String, required: true },      
  author: { type: String, default: "Anonymous" }, 
  avatar: { type: String, default: "default.png" }, 
  likes: { type: Number, default: 0 },        
  comments: { type: Array, default: [] }, 
});
const Post = mongoose.model("Post", PostSchema, "posts");

app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log("收到登录请求:", { username, password });
    const user = await User.findOne({ username, password });
    if (user) {
      res.status(200).json({ success: true, message: "Login successful" });
    } else {
      res.status(401).json({ success: false, message: "Invalid username or password" });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: "An error occurred", error: err });
  }
});

app.post("/addPost", async (req, res) => {
  try {
    const { course, content, date, author, avatar, likes, comments } = req.body;

    if (!course || !content || !date) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // new post
    const newPost = new Post({
      course,
      content,
      date,
      author,
      avatar,
      likes,
      comments,
    });

    // save to mongodb
    await newPost.save();
    console.log("Post saved successfully:", newPost);

    res.status(200).json({ success: true, message: "Post saved successfully!" });
  } catch (error) {
    console.error("Error saving post:", error);
    res.status(500).json({ success: false, message: "Failed to save post." });
  }
});

app.get("/getPosts", async (req, res) => {
  try {
    const posts = await Post.find();
    //search
    res.status(200).json({ success: true, posts });
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ success: false, message: "Failed to fetch posts." });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
