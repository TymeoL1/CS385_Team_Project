import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./BlogPage.css";

function BlogPage() {
  // State to manage the selected course
  const [selectedCourse, setSelectedCourse] = useState("CS353");
  // State to manage the list of posts
  const [posts, setPosts] = useState([]);
  // State to manage the content of the new post
  const [newPostContent, setNewPostContent] = useState("");
  // State to manage the selected topics for the new post
  const [selectedTopics, setSelectedTopics] = useState([]);
  // State to manage the selected date for the new post
  const [selectedDate, setSelectedDate] = useState(new Date());

  // List of available courses
  const courses = ["CS353", "CS370", "CS264", "CS357", "CS310"];
  // List of available topics
  const topics = [
    "Gitlab",
    "Balsamiq",
    "React",
    "SQL",
    "Databases",
    "Firebase",
    "SCRUM",
    "JavaScript",
    "Node.js",
    "Kubernetes",
    "VSCode + Copilot",
  ];

  // Function to handle adding a new post
  const handlePost = () => {
    if (newPostContent.trim()) {
      const newPost = {
        course: selectedCourse,
        content: newPostContent,
        topics: selectedTopics,
        date: selectedDate.toLocaleDateString(),
        author: "Author Name",
        avatar: "Screenshot.png",
        likes: 0,
        comments: [],
      };
      // Add the new post to the list of posts
      setPosts([newPost, ...posts]);
      // Clear the new post content and selected topics
      setNewPostContent("");
      setSelectedTopics([]);
    }
  };

  // Function to toggle the selection of a topic
  const toggleTopic = (topic) => {
    setSelectedTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );
  };

  return (
    <div className="blog-page">
      <Header
        courses={courses}
        setSelectedCourse={setSelectedCourse}
        selectedCourse={selectedCourse}
      />
      <div className="content">
        <Sidebar
          topics={topics}
          selectedTopics={selectedTopics}
          toggleTopic={toggleTopic}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />
        <PostArea
          posts={posts}
          newPostContent={newPostContent}
          setNewPostContent={setNewPostContent}
          handlePost={handlePost}
          selectedCourse={selectedCourse}
        />
      </div>
    </div>
  );
}

// Header component with course selection buttons
function Header({ courses, setSelectedCourse, selectedCourse }) {
  return (
    <header className="header">
      {courses.map((course) => (
        <button
          key={course}
          onClick={() => setSelectedCourse(course)}
          className={selectedCourse === course ? "active" : ""}
        >
          {course}
        </button>
      ))}
      <button onClick={() => console.log("Starting post...")}>
        Start Post
      </button>
    </header>
  );
}

// Sidebar component with a calendar and selectable topics
function Sidebar({
  topics,
  selectedTopics,
  toggleTopic,
  selectedDate,
  setSelectedDate,
}) {
  return (
    <div className="sidebar">
      <div className="calendar">
        <Calendar value={selectedDate} onChange={setSelectedDate} />
      </div>
      <div className="topics">
        <h4>Topics</h4>
        <ul>
          {topics.map((topic) => (
            <li
              key={topic}
              onClick={() => toggleTopic(topic)}
              className={selectedTopics.includes(topic) ? "selected" : ""}
            >
              #{topic}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// PostArea component to display posts and handle new post creation
function PostArea({
  posts,
  newPostContent,
  setNewPostContent,
  handlePost,
  selectedCourse,
}) {
  // Filter posts based on the selected course
  const filteredPosts = posts.filter((post) => post.course === selectedCourse);

  return (
    <div className="post-area">
      <input
        type="text"
        placeholder="Enter post content..."
        value={newPostContent}
        onChange={(e) => setNewPostContent(e.target.value)}
      />
      <button onClick={handlePost}>Post</button>
      {filteredPosts.map((post, index) => (
        <Post key={index} post={post} />
      ))}
    </div>
  );
}

// Post component to display individual posts with like, share, and comment functionalities
function Post({ post }) {
  const [likes, setLikes] = useState(post.likes);
  const [comments, setComments] = useState(post.comments);
  const [newComment, setNewComment] = useState("");
  const [showComments, setShowComments] = useState(false);

  // Function to handle liking a post
  const handleLike = () => {
    setLikes(likes + 1);
  };

  // Function to handle adding a new comment
  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment = {
        author: "Commenter Name",
        avatar: "CommenterAvatar.png",
        content: newComment,
        date: new Date().toLocaleString(),
      };
      // Add the new comment to the list of comments
      setComments([...comments, comment]);
      // Clear the new comment input
      setNewComment("");
    }
  };

  return (
    <div className="post">
      <div className="post-header">
        <img src={post.avatar} alt="Avatar" className="avatar" />
        <span>{post.author}</span>
      </div>
      <p>{post.content}</p>
      <div className="post-footer">
        <span>Tags: {post.topics.join(", ")}</span>
        <span>Date: {post.date}</span>
      </div>
      <div className="post-actions">
        <button onClick={handleLike}>👍 {likes} Likes</button>
        <button onClick={() => alert("Share functionality coming soon!")}>
          🔄 Share
        </button>
        <button onClick={() => setShowComments(!showComments)}>
          💬 {comments.length} Comments
        </button>
      </div>
      {showComments && (
        <div className="post-comments">
          <h4>Comments:</h4>
          {comments.map((comment, index) => (
            <div key={index} className="comment">
              <img
                src={comment.avatar}
                alt="Avatar"
                className="comment-avatar"
              />
              <div className="comment-content">
                <span className="comment-author">{comment.author}</span>
                <span className="comment-date">{comment.date}</span>
                <p>{comment.content}</p>
              </div>
            </div>
          ))}
          <input
            type="text"
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button onClick={handleAddComment}>Comment</button>
        </div>
      )}
    </div>
  );
}

export default BlogPage;
