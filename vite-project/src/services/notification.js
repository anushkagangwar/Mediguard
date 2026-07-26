import { getToken, onMessage } from "firebase/messaging";
import { messaging } from "../firebase";

export const requestNotificationPermission = async () => {
  try {
    const permission = await Notification.requestPermission();

    if (permission !== "granted") {
      return null;
    }

    // Wait for the registered service worker
    const registration = await navigator.serviceWorker.ready;

    const token = await getToken(messaging, {
      vapidKey:
        "BEBFcHMgKHxhNh-EwLsnDqkA6ePiJ0f4ErXwzg8P5Lg3qBbsusbgnD8aNI9C5IpQGZvlo7IVd3lvHWgijTT9wrA",
      serviceWorkerRegistration: registration,
    });

    console.log("NEW TOKEN:", token);

    return token;
  } catch (err) {
    console.log(err);
    return null;
  }
};
export const listenForNotifications = () => {
  console.log("Listening for Firebase foreground messages...");

onMessage(messaging, (payload) => {
  console.log("🔥 Foreground Message Received:", payload);

  new Notification(
    payload.notification?.title || payload.data.title,
    {
      body: payload.notification?.body || payload.data.body,
      icon: "/vite.svg",
    }
  );
});
};