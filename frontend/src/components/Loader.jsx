import React from "react";

export default function Loader({ text = "Loading..." }) {
  return (
    <div className="container">
      <div className="card">{text}</div>
    </div>
  );
}
