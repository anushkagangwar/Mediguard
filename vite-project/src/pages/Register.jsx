import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (
      formData.password !==
      formData.confirmPassword
    ) {
      alert("Passwords do not match");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password:formData.password,
             role: formData.role,
          }),
        }
      );

      const data =
        await response.json();

      if (response.ok) {
        alert(
          "Registration Successful"
        );
        navigate("/login");
      } else {

          alert(
          data.message ||
           data.error ||
             "Registration Failed"
            );
      }
    } catch (error) {
      console.error(error);
      alert("Server Error");
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">

        <h1>Create Account</h1>

        <p className="subtitle">
          Join MediGuard and start
          managing medications smarter.
        </p>

        <form
          className="register-form"
          onSubmit={handleRegister}
        >

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={
              formData.confirmPassword
            }
            onChange={handleChange}
            required
          />

          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
          >
            <option value="">
              Select Role
            </option>
            <option value="patient">
              Patient
            </option>
            <option value="caregiver">
              Caregiver
            </option>
          </select>

          <button
            type="submit"
            className="register-btn"
          >
            Create Account
          </button>

        </form>

        <p className="login-link">
          Already have an account?{" "}
          <Link to="/login">
            Sign In
          </Link>
        </p>

      </div>
    </div>
  );
}