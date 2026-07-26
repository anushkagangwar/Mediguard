
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { listenForNotifications } from "./services/notification";

async function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    try {
      const registration = await navigator.serviceWorker.register(
        "/firebase-messaging-sw.js"
      );

      console.log("✅ Service Worker Registered:", registration);

      // Start listening after registration
      listenForNotifications();
    } catch (err) {
      console.error("❌ Service Worker Registration Failed:", err);
    }
  }
}

registerServiceWorker();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);