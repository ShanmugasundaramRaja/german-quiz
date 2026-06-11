import React from "react";
import { useLocation, Link } from "react-router-dom";

export default function PlaceholderPage({ title }) {
  const location = useLocation();
  return (
    <div className="container">
      <div className="placeholder-page">
        <Link to="/" className="back-link">
          ← Back to Home
        </Link>
        <h1 className="placeholder-title">{title}</h1>
        <p className="placeholder-sub">
          This section is coming soon. Check back later!
        </p>
      </div>
    </div>
  );
}
