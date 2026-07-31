
import { requestNotificationPermission } from "../services/notification";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        " https://mediguard-vgkt.onrender.com/api/auth/login",
        {
          email,
          password,
        }
      );

      console.log(res.data);

      localStorage.setItem(
        "token",
        res.data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(res.data.user)
      );

     localStorage.setItem(
      "userId",
         res.data.user.id
           );

      const fcmToken = await requestNotificationPermission();

      console.log("FCM Token:", fcmToken);

      try {
  const response = await axios.post(
    " https://mediguard-vgkt.onrender.com/api/notification/save-token",
    {
      email: res.data.user.email,
      fcmToken,
    }
  );

  console.log("Save Token Response:", response.data);
} catch (err) {
  console.error("Save Token Error:", err.response?.data || err.message);
}

     alert("Login Successful");

if (res.data.user.role === "caregiver") {

  const patientRes = await axios.get(
    ` https://mediguard-vgkt.onrender.com/api/patient-caregiver/dashboard/${res.data.user.id}`
  );

  localStorage.setItem(
    "selectedPatient",
    JSON.stringify(patientRes.data)
  );

}

navigate("/dashboard");    

    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Login Failed"
      );
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">

        <h1>Welcome Back</h1>

        <p className="subtitle">
          Sign in to continue using MediGuard.
        </p>

        <form
          className="login-form"
          onSubmit={handleLogin}
        >

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            required
          />

          <button
            type="submit"
            className="login-btn"
          >
            Sign In
          </button>

        </form>

        <p className="register-link">
          Don't have an account?{" "}
          <Link to="/register">
            Create Account
          </Link>
        </p>

      </div>
    </div>
  );
}