import React from "react";

// SearchPage component: displays search results
function SearchPage({ posts, search, setSearch, setShowSearchPage }) {
  // Filter posts based on search term
  const filteredPosts = posts.filter(
    (post) =>
      post.content.toLowerCase().includes(search) ||
      post.author.toLowerCase().includes(search)
  );

  return (
    <div className="search-page">
      <button onClick={() => setShowSearchPage(false)}>Back to Blog</button>
      <input
        type="text"
        value={search}
        onChange={(event) => setSearch(event.target.value.toLowerCase())}
        placeholder="Search posts..."
      />
      <h2>Search Results</h2>
      {filteredPosts.length === 0 ? (
        <p>No posts found.</p>
      ) : (
        filteredPosts.map((post, index) => (
          <div key={index} className="post">
            <div className="post-header">
              {/*remove 取消该功能
              <img src={post.avatar} alt="Avatar" className="avatar" />
              */}
              <span>{post.author}</span>
            </div>
            <p>{post.content}</p>
            <div className="post-footer">
              <span>Date: {post.date}</span>
            </div>
            <div className="post-actions">
              <button>👍 {post.likes} Likes</button>
              <button>🔄 Share</button>
              <button>💬 {post.comments.length} Comments</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default SearchPage;