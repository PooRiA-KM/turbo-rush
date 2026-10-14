import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { setAppleTouchIcon } from "./iconGenerator";

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);

// Generate PNG icons at runtime for Safari compatibility
// This ensures iOS gets a proper PNG icon even if the build-time generation fails
try {
  setAppleTouchIcon();
} catch (e) {
  console.warn('[PWA] Runtime icon generation failed:', e);
}
