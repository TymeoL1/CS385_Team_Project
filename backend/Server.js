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

// User schema and model
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
});
const User = mongoose.model("User", UserSchema, "users");

// Post schema and model
const PostSchema = new mongoose.Schema({
  course: { type: String, required: true },
  content: { type: String, required: true },
  date: { type: String, required: true },
  author: { type: String, default: "Anonymous" },
  likes: { type: Number, default: 0 },
  comments: { type: Array, default: [] },
});
const Post = mongoose.model("Post", PostSchema, "posts");

// Login API
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log("Login Request Received:", { username, password });
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

// Add post API
app.post("/addPost", async (req, res) => {
  try {
    const { course, content, date, author, likes, comments } = req.body;

    if (!course || !content || !date) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const newPost = new Post({
      course,
      content,
      date,
      author,
      likes,
      comments,
    });

    await newPost.save();
    res.status(200).json({
      success: true,
      message: "Post saved successfully!",
      post: { ...newPost.toObject(), _id: newPost._id.toString() }, // 格式化输出
    });
  } catch (error) {
    console.error("Error saving post:", error);
    res.status(500).json({ success: false, message: "Failed to save post." });
  }
});


// Get posts API
app.get("/getPosts", async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json({ success: true, posts });
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ success: false, message: "Failed to fetch posts." });
  }
});

// Add comment API
app.post("/addComment", async (req, res) => {
  try {
    const { postId, comment } = req.body;

    if (!postId || !comment) {
      return res.status(400).json({ success: false, message: "Post ID and comment are required." });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found." });
    }

    post.comments.push(comment);
    await post.save();

    res.status(200).json({ success: true, message: "Comment added successfully.", post });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ success: false, message: "Failed to add comment." });
  }
});

// Delete post API
app.post("/deletePost", async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ success: false, message: "Post ID is required." });
    }

    const deletedPost = await Post.findByIdAndDelete(id);
    if (!deletedPost) {
      return res.status(404).json({ success: false, message: "Post not found." });
    }

    res.status(200).json({ success: true, message: "Post deleted successfully." });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ success: false, message: "Failed to delete post." });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
