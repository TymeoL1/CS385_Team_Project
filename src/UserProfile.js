import React, { useState } from "react";

const UserProfile = () => {
  const [profile, setProfile] = useState({
    name: "",
    studentId: "",
    email: "",
    major: "",
    photo: null,
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({
      ...profile,
      [name]: value,
    });
  };

  const handlePhotoChange = (e) => {
    setProfile({
      ...profile,
      photo: URL.createObjectURL(e.target.files[0]),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "0 auto",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#E3F2FD",
        borderRadius: "10px",
      }}
    >
      {!submitted ? (
        <div>
          <h2 style={{ textAlign: "center", color: "#2196F3" }}>
            User Profile
          </h2>
          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "15px" }}
          >
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label style={{ marginBottom: "5px" }}>Name:</label>
              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleChange}
                style={{
                  padding: "10px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                }}
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label style={{ marginBottom: "5px" }}>Student ID:</label>
              <input
                type="text"
                name="studentId"
                value={profile.studentId}
                onChange={handleChange}
                style={{
                  padding: "10px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                }}
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label style={{ marginBottom: "5px" }}>Email:</label>
              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleChange}
                style={{
                  padding: "10px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                }}
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label style={{ marginBottom: "5px" }}>Major:</label>
              <input
                type="text"
                name="major"
                value={profile.major}
                onChange={handleChange}
                style={{
                  padding: "10px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                }}
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label style={{ marginBottom: "5px" }}>Photo:</label>
              <input
                type="file"
                name="photo"
                onChange={handlePhotoChange}
                style={{
                  padding: "10px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                }}
              />
            </div>
            {profile.photo && (
              <img
                src={profile.photo}
                alt="Profile"
                style={{
                  width: "100px",
                  height: "100px",
                  borderRadius: "50%",
                  margin: "10px auto",
                }}
              />
            )}
            <button
              type="submit"
              style={{
                padding: "10px",
                borderRadius: "5px",
                border: "none",
                backgroundColor: "#2196F3",
                color: "white",
                cursor: "pointer",
              }}
            >
              Submit
            </button>
          </form>
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
            padding: "20px",
            border: "1px solid #ccc",
            borderRadius: "10px",
            backgroundColor: "#E3F2FD",
          }}
        >
          <div>
            {profile.photo && (
              <img
                src={profile.photo}
                alt="Profile"
                style={{ width: "150px", height: "150px", borderRadius: "50%" }}
              />
            )}
          </div>
          <div>
            <h2 style={{ color: "#2196F3" }}>Submitted Profile</h2>
            <p>
              <strong>Name:</strong> {profile.name}
            </p>
            <p>
              <strong>Student ID:</strong> {profile.studentId}
            </p>
            <p>
              <strong>Email:</strong> {profile.email}
            </p>
            <p>
              <strong>Major:</strong> {profile.major}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
