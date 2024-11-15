// import logo from "./logo.svg";
import "./App.css";
import React from "react";
import AnnouncementPage from "./announcementPage.js";
import "./announcementPage.css";
import UserPage from "./UserProfile.js";
import BlogPage from "./blogPage.js";

function App() {
  return (
    <div className="App">
      {/* <AnnouncementPage /> */}
      {/* <UserPage /> */}
      <BlogPage />
    </div>
  );
}

export default App;
