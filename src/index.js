import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css"; // or your global reset

// Enable dark theme variables
if (typeof document !== "undefined") {
  document.documentElement.setAttribute("data-theme", "dark");
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);