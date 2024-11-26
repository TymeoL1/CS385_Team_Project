import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./BlogPage.css";
import SearchPage from "./SearchPage"; // 导入新的搜索页面组件

function BlogPage() {
  const [selectedCourse, setSelectedCourse] = useState("CS385");
  const [posts, setPosts] = useState([]);
  const [newPostContent, setNewPostContent] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [weather, setWeather] = useState(null); // 存储天气信息
  const [search, setSearch] = useState(""); // 搜索状态
  const [showSearchPage, setShowSearchPage] = useState(false); // 控制搜索页面显示

  const courses = ["CS385", "CS353", "CS264", "CS357", "CS310"];

  useEffect(() => {
    // 从天气 API 获取天气数据
    const fetchWeather = async () => {
      try {
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=53.385&longitude=-6.5936&current_weather=true&daily=temperature_2m_max,temperature_2m_min,weathercode`
        );
        const data = await response.json();
        setWeather(data);
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    };
    fetchWeather();
  }, []);

  const handlePost = () => {
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
        setShowSearchPage={setShowSearchPage} // 传递控制搜索页面显示的函数
      />
      <div className="content">
        <Sidebar
          weather={weather}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />
        <div className="main-content">
          {showSearchPage ? (
            <SearchPage
              posts={posts}
              search={search}
              setSearch={setSearch}
              setShowSearchPage={setShowSearchPage} // 传递控制返回博客页面的函数
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

// Header 组件：显示课程切换按钮
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
          className={selectedCourse === course ? "active" : ""}
        >
          {course}
        </button>
      ))}
      <button onClick={() => setShowSearchPage(true)}>Search Post</button>
    </header>
  );
}

// Sidebar 组件：显示日历和天气信息
function Sidebar({ weather, selectedDate, setSelectedDate }) {
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

  return (
    <div className="sidebar">
      <div className="calendar">
        <Calendar value={selectedDate} onChange={setSelectedDate} />
      </div>
      <hr /> {/* 日历和天气之间的分隔符 */}
      <div className="weather">
        <h4>Weather</h4>
        {weather ? (
          <div>
            <p>
              <strong>Location:</strong> Maynooth, County Kildare
            </p>
            <p>
              <strong>Current Temp:</strong>{" "}
              {weather.current_weather.temperature}°C
            </p>
            <p>
              <strong>Condition:</strong>{" "}
              {weatherConditions[weather.current_weather.weathercode]}
            </p>
            <hr /> {/* 当前天气和预报之间的分隔符 */}
            <h5>Forecast:</h5>
            {weather.daily.time.slice(0, 1).map((date, index) => (
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

// PostArea 组件：显示帖子和添加新帖子的功能
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

// Post 组件：显示单个帖子
function Post({ post }) {
  const [likes, setLikes] = useState(post.likes);
  const [comments, setComments] = useState(post.comments);
  const [newComment, setNewComment] = useState("");
  const [showComments, setShowComments] = useState(false);

  const handleLike = () => {
    setLikes(likes + 1);
  };

  const handleAddComment = () => {
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
