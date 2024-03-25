import React, { useState } from "react";
import Likes from "./Likes";
import { NavLink } from "react-router-dom";
export default function PostCard({ post }) {
  const [isMouseOver, setIsMouseOver] = useState(false);
  return (
    <NavLink
      onMouseLeave={() => setIsMouseOver(false)}
      onMouseOver={() => setIsMouseOver(true)}
      style={{ backgroundImage: `url(${post.image})` }}
      className={`post-card ${post.image_shape}`}
      to={`/posts/${post.slug}`}
    >
      <div
        style={{
          display: `${isMouseOver ? "flex" : "none"}`,
        }}
        className={`author-like`}
      >
        <h3>{post.author.username}</h3>

        <Likes className={"like-component"} _likes= {post.likes} />
      </div>

      <div
        style={{
          display: `${isMouseOver ? "flex" : "none"}`,
        }}
        className={`title`}
      >
        <h2>{post.title}</h2>
      </div>
    </NavLink>
  );
}
