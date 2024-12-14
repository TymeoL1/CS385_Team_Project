// BlogPage.js

import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./BlogPage.css";
import SearchPage from "./SearchPage";

function BlogPage() {
  const [selectedCourse, setSelectedCourse] = useState("CS385"); // Track the selected course
  const [posts, setPosts] = useState([]); // Store all posts
  const [newPostContent, setNewPostContent] = useState(""); // Content of the new post
  const [selectedDate, setSelectedDate] = useState(new Date()); // Selected date in the calendar
  const [weather, setWeather] = useState(null); // Weather data
  const [location, setLocation] = useState("Maynooth, Kildare"); // Default location
  const [search, setSearch] = useState(""); // Search query
  const [showSearchPage, setShowSearchPage] = useState(false); // Toggle search page visibility

  const courses = ["CS385", "CS353", "CS264", "CS357", "CS310"]; // List of courses

  useEffect(() => {
    // Fetch weather data for the location
    const fetchWeather = async () => {
      try {
        // Use Nominatim API to get coordinates for the location
        const geocodeResponse = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${location}`
        );
        const geocodeData = await geocodeResponse.json();
        if (geocodeData.length > 0) {
          const { lat, lon } = geocodeData[0];

          // Fetch weather data using Open-Meteo API
          const weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,weathercode&forecast_days=2`
          );
          const weatherData = await weatherResponse.json();
          setWeather({ ...weatherData, location });
        } else {
          console.error("Location not found.");
        }
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    };
    fetchWeather();
  }, [location]); // Update weather when location changes

  const handlePost = () => {
    // Add a new post
    if (newPostContent.trim()) {
      const newPost = {
        course: selectedCourse,
        content: newPostContent,
        date: selectedDate.toLocaleDateString(),
        author: "Author Name",
        avatar: "Screenshot.png",
        likes: 0,
        comments: [],
      };
      setPosts([newPost, ...posts]);
      setNewPostContent("");
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
          setLocation={setLocation} // Pass location setter to Sidebar
        />

        <div className="main-content">
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
              selectedCourse={selectedCourse}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// Header component: Displays course buttons and search functionality
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

// Sidebar component: Displays calendar and weather information
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
    // Update location based on user input
    setLocation(e.target.value);
  };

  return (
    <div className="sidebar">
      <div className="calendar">
        <Calendar
          value={selectedDate}
          onChange={setSelectedDate}
          locale="en-US" // Ensure calendar displays in English
          tileClassName={
            ({ date }) =>
              date.getDay() === 0 || date.getDay() === 6 ? "weekend" : null // Highlight weekends
          }
        />
      </div>
      <hr />
      <div className="weather">
        <h4>Weather</h4>
        <input
          type="text"
          placeholder="Enter location (e.g., City, Country)"
          onBlur={handleLocationChange} // Change location on input blur
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

// PostArea component: Displays posts and allows adding new ones
function PostArea({
  posts,
  newPostContent,
  setNewPostContent,
  handlePost,
  selectedCourse,
}) {
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

// Post component: Displays a single post
function Post({ post }) {
  const [likes, setLikes] = useState(post.likes); // Track likes for the post
  const [comments, setComments] = useState(post.comments); // Track comments for the post
  const [newComment, setNewComment] = useState(""); // New comment content
  const [showComments, setShowComments] = useState(false); // Toggle comment visibility

  const handleLike = () => {
    // Increment like count
    setLikes(likes + 1);
  };

  const handleAddComment = () => {
    // Add a new comment
    if (newComment.trim()) {
      const comment = {
        author: "Commenter Name",
        avatar: "CommenterAvatar.png",
        content: newComment,
        date: new Date().toLocaleString(),
      };
      setComments([...comments, comment]);
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
              <span className="comment-date">{comment.date}</span>
              <p>{comment.content}</p>
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
