import React from "react";

export default function Error({ message }) {
  return (
    <div className="error-message">
      <p>{message}</p>
    </div>
  );
}
