

import DashboardNavbar from "../components/DashboardNavbar";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Dashboard() {
  const [medicines, setMedicines] = useState([]);
  const [caregiver, setCaregiver] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCaregiver();
    fetchMedicines();
  }, []);

//   const fetchCaregiver = async () => {
//   try {
//     const user = JSON.parse(
//       localStorage.getItem("user")
//     );

//     if (!user) return;

//     const res = await axios.get(
//       `http://localhost:5000/api/caregiver/${user.id}`
//     );

//     console.log("Caregiver:", res.data);

//     setCaregiver(res.data);
//   } catch (err) {
//     console.log(err);
//     setCaregiver(null);
//   }
// };

const fetchCaregiver = async () => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) return;

    let patientId;

    if (user.role === "patient") {
      patientId = user.id;
    } else {
      const patient = JSON.parse(
        localStorage.getItem("selectedPatient")
      );

      if (!patient) return;

      patientId = patient._id;
    }

    const res = await axios.get(
      `http://localhost:5000/api/caregiver/${patientId}`
    );

    console.log("Caregiver:", res.data);

    setCaregiver(res.data);

  } catch (err) {
    console.log(err);
    setCaregiver(null);
  }
};

 const fetchMedicines = async () => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) return;

    let patientId;

    if (user.role === "patient") {
      patientId = user.id;
    } else {
      const patient = JSON.parse(
        localStorage.getItem("selectedPatient")
      );

      if (!patient) return;

      patientId = patient._id;
    }

    // Update missed medicines
    await axios.put(
      "http://localhost:5000/api/medicine/check-missed"
    );

    const res = await axios.get(
      `http://localhost:5000/api/medicine/patient/${patientId}`
    );

    console.log("Medicines Response:", res.data);

    const data = Array.isArray(res.data)
      ? res.data
      : [];

    setMedicines(data);

  } catch (err) {
    console.error(err);
    setMedicines([]);
  }

  };

  const upcomingDose =
    medicines.length > 0
      ? [...medicines].sort((a, b) =>
          (a.time || "").localeCompare(
            b.time || ""
          )
        )[0]
      : null;

  const takenCount = medicines.filter(
    (m) => m.status === "Taken"
  ).length;

  const missedCount = medicines.filter(
    (m) => m.status === "Missed"
  ).length;

  const pendingCount = medicines.filter(
    (m) =>
      !m.status || m.status === "Pending"
  ).length;

  const adherence =
    medicines.length > 0
      ? Math.round(
          (takenCount / medicines.length) * 100
        )
      : 0;

  return (
    <>
      <DashboardNavbar />

      <div className="dashboard">

        <div className="welcome-card">
          <h1>Welcome Back</h1>
          <p>
            Your medication overview for
            today.
          </p>
        </div>

        {/* STATS */}
        <div className="stats">

          <div className="stat-card">
            <h3>Total Medicines</h3>
            <p>{medicines.length}</p>
          </div>

          <div className="stat-card">
            <h3>Pending</h3>
            <p>{pendingCount}</p>
          </div>

          <div className="stat-card">
            <h3>Taken</h3>
            <p>{takenCount}</p>
          </div>

          <div className="stat-card">
            <h3>Missed</h3>
            <p>{missedCount}</p>
          </div>

          <div className="stat-card">
            <h3>Adherence</h3>
            <p>{adherence}%</p>
          </div>

        </div>

        {/* MAIN GRID */}
        <div className="dashboard-grid">

          <div className="section-card">
            <h2>Today's Medicines</h2>

            {medicines.length > 0 ? (
              medicines.map((medicine) => (
                <div key={medicine._id}>
                  <p>
                    {medicine.name} -{" "}
                    {medicine.time}
                  </p>
                </div>
              ))
            ) : (
              <p>
                No medicines scheduled.
              </p>
            )}
          </div>

          <div className="section-card">
            <h2>Upcoming Dose</h2>

            {upcomingDose ? (
              <>
                <p>
                  <strong>
                    {upcomingDose.name}
                  </strong>
                </p>

                <p>
                  Time:{" "}
                  {upcomingDose.time}
                </p>

                <p>
                  Dosage:{" "}
                  {upcomingDose.dosage}
                </p>
              </>
            ) : (
              <p>No upcoming doses.</p>
            )}
          </div>

          <div className="section-card">
            <h2>Caregiver Status</h2>

  {caregiver ? (
    <>
      <p>
        <strong>{caregiver.name}</strong>
      </p>

      <p>
        Relationship: {caregiver.relationship}
      </p>
    </>
  ) : (
    <p>No caregiver linked.</p>
  )}
      </div>
 

          <div className="section-card">
            <h2>📊 Reports</h2>

            {medicines.length > 0 ? (
              medicines
                .slice(0, 3)
                .map((medicine) => (
                  <div
                    key={medicine._id}
                    className="recent-medicine"
                  >
                    <strong>
                      {medicine.name}
                    </strong>

                    <span>
                      {medicine.status ||
                        "Pending"}
                    </span>
                  </div>
                ))
            ) : (
              <p>No reports available.</p>
            )}
          </div>

          <div className="section-card">
            <h2>Quick Actions</h2>

            <button
              className="action-btn"
              onClick={() =>
                navigate("/addmedicine")
              }
            >
              Add Medicine
            </button>

            <button
              className="action-btn"
              onClick={() =>
                navigate("/reports")
              }
            >
              View Reports
            </button>
          </div>

        </div>

      </div>
    </>
  );
}
