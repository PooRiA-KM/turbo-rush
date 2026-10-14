import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { registerServiceWorker } from "./pwa";

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);

// Register PWA Service Worker
registerServiceWorker();
