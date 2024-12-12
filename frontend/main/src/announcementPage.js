import React, { useState } from "react";
import "./announcementPage.css";

function AnnouncementPage() {
  const [announcementText, setAnnouncementText] = useState(
    "This is an important announcement!"
  );
  const [displayTime, setDisplayTime] = useState(5);
  const [announcementAuthor, setAnnouncementAuthor] = useState("Admin");
  const [show, setShow] = useState(false);

  const showAnnouncement = () => {
    setShow(true);
    setTimeout(() => {
      setShow(false);
    }, displayTime * 1000);
  };

  return (
    <div className="container">
      <div className="form-group">
        <label htmlFor="announcementText">Announcement Text:</label>
        <input
          type="text"
          id="announcementText"
          value={announcementText}
          onChange={(e) => setAnnouncementText(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="displayTime">Display Time (seconds):</label>
        <input
          type="number"
          id="displayTime"
          value={displayTime}
          onChange={(e) => setDisplayTime(Number(e.target.value))}
        />
      </div>
      <div className="form-group">
        <label htmlFor="announcementAuthor">Author:</label>
        <input
          type="text"
          id="announcementAuthor"
          value={announcementAuthor}
          onChange={(e) => setAnnouncementAuthor(e.target.value)}
        />
      </div>
      <button onClick={showAnnouncement}>Show Announcement</button>

      {show && (
        <div className="announcement">
          <strong>{announcementAuthor}:</strong> {announcementText}
        </div>
      )}
    </div>
  );
}

export default AnnouncementPage;
