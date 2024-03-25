import React from "react";
import { NavLink } from "react-router-dom";

export default function UserLink({
  user,
  className = "",
  username = true,
  onclick = undefined,
}) {
  return (
    <NavLink
      onClick={onclick}
      className={"user-link " + className}
      to={"/" + user.username}
    >
      <div className="avatar">
        <img src={user.avatar} alt={user.username + " avatar"} />
      </div>
      {username && <p>{user.username}</p>}
    </NavLink>
  );
}
