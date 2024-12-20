import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./BlogPage.css";
import axios from "axios";
import SearchPage from "./SearchPage";

function BlogPage() {
  const [selectedCourse, setSelectedCourse] = useState("CS385"); // Track selected course
  const [posts, setPosts] = useState([]); // Store all posts
  const [newPostContent, setNewPostContent] = useState(""); // Track new post content
  const [selectedDate, setSelectedDate] = useState(new Date()); // Track selected date
  const [weather, setWeather] = useState(null); // Store weather data
  const [location, setLocation] = useState("Maynooth, Kildare"); // Track location for weather query
  const [search, setSearch] = useState(""); // Track search query
  const [showSearchPage, setShowSearchPage] = useState(false); // Control search page visibility

  const courses = ["CS385", "CS353", "CS264", "CS357", "CS310"]; // List of available courses

  // Fetch posts when the component mounts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/getPosts");
        if (response.data.success) {
          console.log("Fetched Posts:", response.data.posts);
          setPosts(response.data.posts); // Set the fetched posts
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts(); // Call the fetchPosts function
  }, []);

  // Fetch weather data when location changes
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const geocodeResponse = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${location}`
        );
        const geocodeData = await geocodeResponse.json();
        if (geocodeData.length > 0) {
          const { lat, lon } = geocodeData[0];
          //latitude and longitude
          const weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,weathercode&forecast_days=2`
          );
          const weatherData = await weatherResponse.json();
          setWeather({ ...weatherData, location }); // Set the weather data
        } else {
          console.error("Location not found.");
        }
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    };

    fetchWeather(); // Call the fetchWeather function
  }, [location]);

  // Handle adding a new post
  const handlePost = async () => {
    if (newPostContent.trim()) {
      const newPost = {
        course: selectedCourse,
        content: newPostContent,
        date: selectedDate.toLocaleDateString(),
        author: "Anonymous",
        likes: 0,
        comments: [],
      };

      try {
        const response = await axios.post(
          "http://localhost:5000/addPost",
          newPost
        );
        if (response.data.success) {
          const createdPost = response.data.post;
          setPosts([createdPost, ...posts]); // Add new post to posts array
          setNewPostContent(""); // Clear the input field
        } else {
          console.error("Error saving post:", response.data.message);
        }
      } catch (error) {
        console.error("Error sending post to server:", error);
      }
    }
  };

  // Handle adding a comment to a post
  const handleAddComment = async (postId, comment) => {
    try {
      const response = await axios.post("http://localhost:5000/addComment", {
        postId,
        comment,
      });
      if (response.data.success) {
        const updatedPost = response.data.post;
        setPosts(
          posts.map((post) =>
            post._id === updatedPost._id ? updatedPost : post
          )
        ); // Update the specific post with new comment
      } else {
        console.error("Error adding comment:", response.data.message);
      }
    } catch (error) {
      console.error("Error sending comment:", error.message);
    }
  };

  // Handle deleting a post
  const handleDeletePost = async (postId) => {
    try {
      const response = await axios.post("http://localhost:5000/deletePost", {
        id: postId,
      });
      if (response.data.success) {
        setPosts(posts.filter((post) => post._id !== postId)); // Remove the post from posts array
      } else {
        console.error("Error deleting post:", response.data.message);
      }
    } catch (error) {
      console.error("Error deleting post:", error.message);
    }
  };

  return (
    <div className="blog-page">
      <Header
        courses={courses}
        setSelectedCourse={setSelectedCourse}
        selectedCourse={selectedCourse}
        setShowSearchPage={setShowSearchPage}
      />
      <div className="content">
        <Sidebar
          weather={weather}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          setLocation={setLocation}
        />
        {/* Layer image background and functional components
            AI assisted(ChatGPT) content completion */}
        <div className="main-content">
          <div className="background-layer"></div>
          <div className="content-layer">
            {showSearchPage ? (
              <SearchPage
                posts={posts}
                search={search}
                setSearch={setSearch}
                setShowSearchPage={setShowSearchPage}
              />
            ) : (
              <PostArea
                posts={posts}
                newPostContent={newPostContent}
                setNewPostContent={setNewPostContent}
                handlePost={handlePost}
                handleDeletePost={handleDeletePost}
                handleAddComment={handleAddComment}
                selectedCourse={selectedCourse}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Header({
  courses,
  setSelectedCourse,
  selectedCourse,
  setShowSearchPage,
}) {
  return (
    <header className="header">
      {courses.map((course) => (
        <button
          key={course}
          onClick={() => setSelectedCourse(course)}
          className={`course-button ${
            selectedCourse === course ? "active" : ""
          }`}
        >
          {course}
        </button>
      ))}
      <button className="search-button" onClick={() => setShowSearchPage(true)}>
        Search Post
      </button>
    </header>
  );
}
// This weatherConditions is AI assisted(ChatGPT)
function Sidebar({ weather, selectedDate, setSelectedDate, setLocation }) {
  const weatherConditions = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Depositing rime fog",
    51: "Drizzle: Light",
    53: "Drizzle: Moderate",
    55: "Drizzle: Dense intensity",
    56: "Freezing Drizzle: Light",
    57: "Freezing Drizzle: Dense intensity",
    61: "Rain: Slight",
    63: "Rain: Moderate",
    65: "Rain: Heavy intensity",
    66: "Freezing Rain: Light",
    67: "Freezing Rain: Heavy intensity",
    71: "Snow fall: Slight",
    73: "Snow fall: Moderate",
    75: "Snow fall: Heavy intensity",
    77: "Snow grains",
    80: "Rain showers: Slight",
    81: "Rain showers: Moderate",
    82: "Rain showers: Violent",
    85: "Snow showers: Slight",
    86: "Snow showers: Heavy",
    95: "Thunderstorm: Slight or moderate",
    96: "Thunderstorm with slight hail",
    99: "Thunderstorm with heavy hail",
  };

  const handleLocationChange = (e) => {
    setLocation(e.target.value); // Update location for weather query
  };

  return (
    <div className="sidebar">
      <div className="calendar">
        <Calendar
          value={selectedDate}
          onChange={setSelectedDate}
          locale="en-US"
          tileClassName={({ date }) =>
            date.getDay() === 0 || date.getDay() === 6 ? "weekend" : null
          }
        />
      </div>
      <hr />
      <div className="weather">
        <h4>Weather</h4>
        <input
          type="text"
          placeholder="Enter location (e.g., City, Country)"
          onBlur={handleLocationChange}
        />
        {weather ? (
          <div>
            <p>
              <strong>Location:</strong> {weather.location}
            </p>
            <p>
              <strong>Current Temp:</strong>{" "}
              {weather.current_weather.temperature}°C
            </p>
            <p>
              <strong>Condition:</strong>{" "}
              {weatherConditions[weather.current_weather.weathercode]}
            </p>
            <hr />
            <h5>Forecast:</h5>
            {weather.daily.time.map((date, index) => (
              <div key={index} style={{ marginBottom: "10px" }}>
                <p>
                  <strong>Date:</strong> {new Date(date).toLocaleDateString()}
                </p>
                <p>
                  <strong>Max Temp:</strong>{" "}
                  {weather.daily.temperature_2m_max[index]}°C
                </p>
                <p>
                  <strong>Min Temp:</strong>{" "}
                  {weather.daily.temperature_2m_min[index]}°C
                </p>
                <p>
                  <strong>Condition:</strong>{" "}
                  {weatherConditions[weather.daily.weathercode[index]]}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p>Loading weather...</p>
        )}
      </div>
    </div>
  );
}

function PostArea({
  posts = [],
  newPostContent,
  setNewPostContent,
  handlePost,
  handleDeletePost,
  handleAddComment,
  selectedCourse,
}) {
  // Filter posts for the currently selected course
  const filteredPosts = (posts || []).filter(
    (post) => post && post.course === selectedCourse
  );

  return (
    <div className="post-area">
      <input
        type="text"
        placeholder="Enter post content..."
        value={newPostContent}
        onChange={(e) => setNewPostContent(e.target.value)}
      />
      <button onClick={handlePost}>Post</button>
      {/* Walk through and display the filtered posts */}
      {filteredPosts.map((post) => (
        <Post
          key={post._id || post.id}
          post={post}
          handleDelete={() => handleDeletePost(post._id || post.id)}
          handleAddComment={handleAddComment}
        />
      ))}
    </div>
  );
}

function Post({ post, handleDelete, handleAddComment }) {
  const [likes, setLikes] = useState(post.likes); // Track likes
  const [comments, setComments] = useState(post.comments); // Track comments
  const [newComment, setNewComment] = useState(""); // Track new comment content
  const [showComments, setShowComments] = useState(false); // Control comment visibility

  // Handle like button click
  const handleLike = () => {
    setLikes(likes + 1);
  };

  // Handle adding a new comment
  const handleAddCommentClick = () => {
    if (newComment.trim()) {
      const comment = {
        author: "Anonymous",
        content: newComment,
        date: new Date().toLocaleString(),
      };
      handleAddComment(post._id, comment);
      setNewComment(""); // Clear the comment input field
    }
  };

  return (
    <div className="post">
      <div className="post-header">
        <span>{post.author}</span>
        <button onClick={handleDelete} style={{ marginLeft: "auto" }}>
          ❌ Delete
        </button>
      </div>
      <p>{post.content}</p>
      <div className="post-footer">
        <span>Date: {post.date}</span>
      </div>
      <div className="post-actions">
        <button onClick={handleLike}>👍 {likes} Likes</button>
        <button onClick={() => setShowComments(!showComments)}>
          💬 {comments.length} Comments
        </button>
      </div>
      {showComments && (
        <div className="post-comments">
          <h4>Comments:</h4>
          {comments.map((comment, index) => (
            <div key={index}>
              <p>
                <strong>{comment.author}:</strong> {comment.content}
              </p>
            </div>
          ))}
          <input
            type="text"
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button onClick={handleAddCommentClick}>Comment</button>
        </div>
      )}
    </div>
  );
}

export default BlogPage;
