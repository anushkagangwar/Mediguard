import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="home-page">

      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">
          <div className="logo-icon">❤</div>
          <span>MediGuard</span>
        </div>

        <div className="nav-buttons">
          <Link to="/login" className="signin-btn">
            Sign in
          </Link>

          <Link to="/register" className="getstarted-btn">
            Get started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero">

        <div className="hero-badge">
          🛡 Calm, clinical, caring
        </div>

        <h1>
          Never miss a dose.
          <span> Keep family in the loop.</span>
        </h1>

        <p>
          MediGuard turns medicine schedules into gentle reminders,
          tracks adherence, and lets trusted family caregivers monitor
          doses in real time.
        </p>

        <div className="hero-buttons">

          <Link to="/register">
            <button className="primary-btn">
              Create your free account
            </button>
          </Link>

          <Link to="/login">
            <button className="secondary-btn">
              I already have an account
            </button>
          </Link>

        </div>

      </section>

      {/* Features */}
      <section className="features">

        <div className="feature-card">
          <div className="feature-icon">💊</div>

          <h3>Smart schedules</h3>

          <p>
            Add any medicine with custom times,
            food rules, and refill alerts.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">🔔</div>

          <h3>Timely reminders</h3>

          <p>
            Mark each dose taken or skipped —
            missed doses are flagged automatically.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">👨‍👩‍👧</div>

          <h3>Family caregivers</h3>

          <p>
            Invite loved ones to view adherence
            and step in when needed.
          </p>
        </div>

      </section>

    </div>
  );
}