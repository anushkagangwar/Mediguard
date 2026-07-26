import {
  FaPills,
  FaBell,
  FaUsers
} from "react-icons/fa";

export default function Features() {
  return (
    <section className="features">

      <div className="card">
        <div className="icon">
          <FaPills />
        </div>

        <h3>Smart schedules</h3>

        <p>
          Add any medicine with custom times,
          food rules and refill alerts.
        </p>
      </div>

      <div className="card">
        <div className="icon">
          <FaBell />
        </div>

        <h3>Timely reminders</h3>

        <p>
          Mark each dose taken or skipped.
          Missed doses are flagged automatically.
        </p>
      </div>

      <div className="card">
        <div className="icon">
          <FaUsers />
        </div>

        <h3>Family caregivers</h3>

        <p>
          Invite loved ones to monitor adherence
          and step in when needed.
        </p>
      </div>

    </section>
  );
}