import React from "react";

// SearchPage 组件：显示搜索结果
function SearchPage({ posts, search, setSearch, setShowSearchPage }) {
  // 过滤帖子，根据搜索词
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
              <img src={post.avatar} alt="Avatar" className="avatar" />
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
