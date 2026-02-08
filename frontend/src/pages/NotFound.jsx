import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="container">
      <div className="card">
        <h2>404</h2>
        <p>Page not found.</p>
        <Link to="/">Go Home</Link>
      </div>
    </div>
  );
}
