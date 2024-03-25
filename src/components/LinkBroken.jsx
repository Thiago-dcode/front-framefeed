import React from "react";
import { NavLink } from "react-router-dom";
export default function LinkBroken() {
  return (
    <div className="home"
      style={{
        color: "white",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "1rem",
      }}
    >
      <h2> Sorry, this page isn't available.</h2>
      <p>
        The link you followed may be broken, or the page may have been removed.
        <NavLink
          style={{
            color: "var(--green)",
            marginLeft: "0.4rem",
          }}
          to={"/"}
        >
          Go back to FrameFeed.
        </NavLink>
      </p>
    </div>
  );
}
