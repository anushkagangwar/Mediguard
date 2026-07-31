import { useEffect, useState } from "react";
import axios from "axios";
import DashboardNavbar from "../components/DashboardNavbar";

export default function Alerts() {
  const [medicines, setMedicines] = useState([]);

  // ✅ FETCH FROM DATABASE (MongoDB)
  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
  try {
    const user = JSON.parse(
      localStorage.getItem("user")
    );

    // const res = await axios.get(
    //   `http://localhost:5000/api/medicine/patient/${user.id}`
    // );
    let res;

if (user.role === "patient") {
  res = await axios.get(
    ` https://mediguard-vgkt.onrender.com/api/medicine/patient/${user.id}`
  );
} else {
  res = await axios.get(
    ` https://mediguard-vgkt.onrender.com/api/medicine/caregiver/${user.id}`
  );
}

    setMedicines(
      Array.isArray(res.data)
        ? res.data
        : []
    );
  } catch (err) {
    console.error(
      "Error fetching alerts:",
      err
    );
    setMedicines([]);
  }
};

  // 🚨 ALERT LOGIC (derived from DB data)
  const missedMedicines = Array.isArray(medicines)
  ? medicines.filter(
      (medicine) => medicine.status === "Missed"
    )
  : [];

const pendingMedicines = Array.isArray(medicines)
  ? medicines.filter(
      (medicine) => medicine.status === "Pending"
    )
  : [];
  return (
    <>
      <DashboardNavbar />

      <div className="alerts-page">

        {/* HEADER */}
        <div className="alerts-header">
          <h1>🔔 Alerts Center</h1>
          <p>Stay updated with your medication schedule.</p>
        </div>

        {/* STATS */}
        <div className="alert-stats">

          <div className="alert-stat-card">
            <h3>Total Alerts</h3>
            <p>
              {missedMedicines.length + pendingMedicines.length}
            </p>
          </div>

          <div className="alert-stat-card missed">
            <h3>Missed</h3>
            <p>{missedMedicines.length}</p>
          </div>

          <div className="alert-stat-card pending">
            <h3>Upcoming</h3>
            <p>{pendingMedicines.length}</p>
          </div>

        </div>

        {/* ALERTS GRID */}
        <div className="alerts-grid">

          {/* MISSED */}
          <div className="alerts-section">
            <h2>⚠️ Missed Medicines</h2>

            {missedMedicines.length > 0 ? (
              missedMedicines.map((medicine) => (
                <div
                  key={medicine._id}
                  className="alert-card missed-card"
                >
                  <h3>{medicine.name}</h3>
                  <p>Missed at {medicine.time}</p>
                  <p>Dosage: {medicine.dosage}</p>
                </div>
              ))
            ) : (
              <p>No missed medicines.</p>
            )}
          </div>

          {/* PENDING */}
          <div className="alerts-section">
            <h2>⏰ Upcoming Medicines</h2>

            {pendingMedicines.length > 0 ? (
              pendingMedicines.map((medicine) => (
                <div
                  key={medicine._id}
                  className="alert-card pending-card"
                >
                  <h3>{medicine.name}</h3>
                  <p>Scheduled at {medicine.time}</p>
                  <p>Dosage: {medicine.dosage}</p>
                </div>
              ))
            ) : (
              <p>No upcoming medicines.</p>
            )}
          </div>

        </div>

      </div>
    </>
  );
}