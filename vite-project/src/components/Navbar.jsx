

import { Link } from "react-router-dom";
import { FaHeart } from "react-icons/fa";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">
        <div className="logo-box">
          <FaHeart />
        </div>
        <h2>MediGuard</h2>
      </div>

      <div className="nav-btns">
        <Link to="/login">
          <button className="signin">Sign in</button>
        </Link>

        <Link to="/register">
          <button className="start-btn">Get started</button>
        </Link>
      </div>
    </nav>
  );
}