import React from "react";
import PostCard from "./PostCard";

export default function GalleryGrid({ posts }) {
  return (
    <div className="gallery-container">
      {posts.map((post, i) => {
        return <PostCard key={i} post={post} />;
      })}
    </div>
  );
}
