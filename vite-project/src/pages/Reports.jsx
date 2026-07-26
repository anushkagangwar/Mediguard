

import { useEffect, useState } from "react";
import axios from "axios";
import DashboardNavbar from "../components/DashboardNavbar";

export default function Reports() {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMedicines();
  }, []);
const fetchMedicines = async () => {
  try {
    const user = JSON.parse(
      localStorage.getItem("user")
    );

    if (!user) return;

    // ✅ Update overdue medicines first
    await axios.put(
      "http://localhost:5000/api/medicine/check-missed"
    );

    // ✅ Then fetch medicines
    // const res = await axios.get(
    //    `http://localhost:5000/api/medicine/patient/${user.id}`
    // );
    let res;

if (user.role === "patient") {
  res = await axios.get(
    `http://localhost:5000/api/medicine/patient/${user.id}`
  );
} else {
  res = await axios.get(
    `http://localhost:5000/api/medicine/caregiver/${user.id}`
  );
}

    const data = Array.isArray(res.data)
      ? res.data
      : [];

    setMedicines(data);
    } finally {
      setLoading(false);
    }
  };

  const medicineList = Array.isArray(medicines)
    ? medicines
    : [];

  const total = medicineList.length;

  const taken = medicineList.filter(
    (m) => m.status === "Taken"
  ).length;

  const missed = medicineList.filter(
    (m) => m.status === "Missed"
  ).length;

  const pending = medicineList.filter(
    (m) =>
      !m.status ||
      m.status === "Pending"
  ).length;

  const adherence =
    total > 0
      ? Math.round((taken / total) * 100)
      : 0;

  return (
    <>
      <DashboardNavbar />

      <div className="reports-page">

        <div className="reports-header">
          <h1>Medication Reports</h1>
          <p>
            Track your medicine adherence
            and activity.
          </p>
        </div>

        <div className="report-cards">

          <div className="report-card">
            <h3>Total Medicines</h3>
            <span>{total}</span>
          </div>

          <div className="report-card taken">
            <h3>Taken</h3>
            <span>{taken}</span>
          </div>

          <div className="report-card missed">
            <h3>Missed</h3>
            <span>{missed}</span>
          </div>

          <div className="report-card pending">
            <h3>Pending</h3>
            <span>{pending}</span>
          </div>

          <div className="report-card adherence">
            <h3>Adherence</h3>
            <span>{adherence}%</span>
          </div>

        </div>

        <div className="activity-section">

          <h2>Recent Medicines</h2>

          {loading ? (
            <p>Loading medicines...</p>
          ) : medicineList.length > 0 ? (
            <table className="reports-table">

              <thead>
                <tr>
                  <th>Name</th>
                  <th>Dosage</th>
                  <th>Time</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {medicineList.map(
                  (medicine) => (
                    <tr
                      key={
                        medicine._id
                      }
                    >
                      <td>
                        {medicine.name}
                      </td>

                      <td>
                        {medicine.dosage}
                      </td>

                      <td>
                        {medicine.time}
                      </td>

                      <td
                        className={
                          medicine.status ===
                          "Taken"
                            ? "status-taken"
                            : medicine.status ===
                              "Missed"
                            ? "status-missed"
                            : "status-pending"
                        }
                      >
                        {medicine.status ||
                          "Pending"}
                      </td>
                    </tr>
                  )
                )}
              </tbody>

            </table>
          ) : (
            <p>
              No report data available.
            </p>
          )}

        </div>

      </div>
    </>
  );
}