import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element with id 'root' was not found in the document.");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
