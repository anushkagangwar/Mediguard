import { useEffect, useState } from "react";
import axios from "axios";
import DashboardNavbar from "../components/DashboardNavbar";
import socket from "../services/socket";
import {
  FaBell,
  FaTrash,
  FaCheckCircle,
  FaRegCircle,
} from "react-icons/fa";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);

  const patientId = localStorage.getItem("userId");

  useEffect(() => {
    if (patientId) {
      fetchNotifications();
    }
  }, []);

  useEffect(() => {
  socket.on("newNotification", (notification) => {
    console.log("📩 New Notification:", notification);

    setNotifications((prev) => [
      notification,
      ...prev,
    ]);
  });

  return () => {
    socket.off("newNotification");
  };
}, []);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/notification/patient/${patientId}`
        
      );

      setNotifications(res.data);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  const markAsRead = async (id) => {
    try {
      await axios.put(
        `http://localhost:5000/api/notification/${id}/read`
      );

      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteNotification = async (id) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/notification/${id}`
      );

      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
     <DashboardNavbar />
    <div className="notifications-container">
      <div className="notifications-header">
        <h1>
          <FaBell
            style={{
              color: "#FFC107",
              marginRight: "10px",
            }}
          />
          Notifications
        </h1>

        <p>
          View all medicine reminders and notification
          history.
        </p>
      </div>

      {notifications.length === 0 ? (
        <div className="empty-box">
          <FaBell
            style={{
              fontSize: "60px",
              color: "#bbb",
              marginBottom: "15px",
            }}
          />

          <h2>No Notifications Yet</h2>

          <p>
            All medicine reminders will appear here.
          </p>
        </div>
      ) : (
        notifications.map((notification) => (
          <div
            key={notification._id}
            className="notification-card"
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <div>
                <h2 className="notification-title">
                  {notification.title}
                </h2>

                <p className="notification-body">
                  {notification.body}
                </p>

                <p className="notification-date">
                  {new Date(
                    notification.createdAt
                  ).toLocaleString()}
                </p>
              </div>

              <div>
                {notification.isRead ? (
                  <span className="read">
                    <FaCheckCircle /> Read
                  </span>
                ) : (
                  <span className="unread">
                    <FaRegCircle /> Unread
                  </span>
                )}
              </div>
            </div>

            <div className="notification-footer">
              <div></div>

              <div className="notification-buttons">
                {!notification.isRead && (
                  <button
                    className="mark-btn"
                    onClick={() =>
                      markAsRead(notification._id)
                    }
                  >
                    Mark as Read
                  </button>
                )}

                <button
                  className="delete-btn"
                  onClick={() =>
                    deleteNotification(notification._id)
                  }
                >
                  <FaTrash /> Delete
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
    </>
  );
}