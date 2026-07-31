import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { FaHeart } from "react-icons/fa";
import socket from "../services/socket";
import {
  FaHome,
  FaPills,
  FaUserNurse,
  FaChartBar,
  FaBell,
} from "react-icons/fa";

export default function DashboardNavbar() {
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);

  const handleLogout = () => {
    // Clear all stored data
    localStorage.clear();

    // Redirect to login page
    navigate("/login");
  };
  const fetchUnreadCount = async () => {
  try {
    const patientId = localStorage.getItem("userId");

    const res = await axios.get(
      ` https://mediguard-vgkt.onrender.com/api/notification/unread/${patientId}`
    );

    setUnreadCount(res.data.count);
  } catch (err) {
    console.log(err);
  }
};
useEffect(() => {
  fetchUnreadCount();

  const interval = setInterval(fetchUnreadCount, 5000);

  return () => clearInterval(interval);
}, []);

useEffect(() => {
  socket.on("newNotification", () => {
    fetchUnreadCount();
  });

  return () => {
    socket.off("newNotification");
  };
}, []);

  return (
    <nav className="dashboard-navbar">
      <div className="dashboard-logo">
        <div className="logo-icon">
          <FaHeart />
        </div>
        <span>MediGuard</span>
      </div>

      <div className="nav-links">
        <Link to="/dashboard">
          <FaHome />
          <span>Dashboard</span>
        </Link>

        <Link to="/addmedicine">
          <FaPills />
          <span>Medicines</span>
        </Link>

        <Link to="/caregiver">
          <FaUserNurse />
          <span>Caregiver</span>
        </Link>

        <Link to="/reports">
          <FaChartBar />
          <span>Reports</span>
        </Link>

        <Link to="/alerts">
          <FaBell />
          <span>Alerts</span>
        </Link>
       
      <Link to="/notifications" className="notifications-link">
  <FaBell />
  <span>Notifications</span>

  {unreadCount > 0 && (
    <span className="notification-badge">
      {unreadCount}
    </span>
  )}
</Link>
        
      </div>

      <button
        className="logout-btn"
        onClick={handleLogout}
      >
        Sign Out
      </button>
    </nav>
  );

}