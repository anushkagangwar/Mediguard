import { useState, useEffect } from "react";
import axios from "axios";
import DashboardNavbar from "../components/DashboardNavbar";

export default function Caregiver() {
  const [caregiver, setCaregiver] = useState({
    name: "",
    relationship: "",
    phone: "",
    email: "",
  });

  const [isEditing, setIsEditing] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  // ✅ FETCH CAREGIVER BY PATIENT ID (correct concept)
  const fetchCaregiver = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/caregiver/${user.id}`
      );

      if (res.data) {
        setCaregiver(res.data);
      }
    } catch (error) {
      console.log("Fetch error:", error);
    }
  };

  useEffect(() => {
    fetchCaregiver();
  }, []);

  const handleChange = (e) => {
    setCaregiver({
      ...caregiver,
      [e.target.name]: e.target.value,
    });
  };

  // ✅ CREATE / UPDATE CAREGIVER
  const handleSave = async () => {
  try {
    // Save caregiver details
    await axios.post(
      "http://localhost:5000/api/caregiver",
      {
        patientId: user.id,
        name: caregiver.name,
        relationship: caregiver.relationship,
        phone: caregiver.phone,
        email: caregiver.email,
      }
    );

    // Create patient-caregiver link
    await axios.post(
     "http://localhost:5000/api/patient-caregiver/link",
      {
        patientId: user.id,
        caregiverEmail: caregiver.email,
      }
    );

    alert("Caregiver saved successfully!");

    setIsEditing(false);

    fetchCaregiver();
  } catch (error) {
    console.log(error);
    alert("Failed to save caregiver");
  }
};

  return (
    <>
      <DashboardNavbar />

      <div className="caregiver-page">

        <div className="page-header">
          <h1>Caregiver</h1>
        </div>

        <div className="caregiver-card">

          {isEditing || !caregiver.name ? (
            <>
              <label>Name</label>
              <input
                name="name"
                value={caregiver.name}
                onChange={handleChange}
              />

              <label>Relationship</label>
              <input
                name="relationship"
                value={caregiver.relationship}
                onChange={handleChange}
              />

              <label>Phone</label>
              <input
                name="phone"
                value={caregiver.phone}
                onChange={handleChange}
              />

              <label>Email</label>
              <input
                name="email"
                value={caregiver.email}
                onChange={handleChange}
              />

              <button onClick={handleSave} className="save-btn">
                Save Caregiver
              </button>
            </>
          ) : (
            <>
              <h2>{caregiver.name}</h2>

              <p>Relationship: {caregiver.relationship}</p>
              <p>Phone: {caregiver.phone}</p>
              <p>Email: {caregiver.email}</p>

              <button
                className="edit-btn"
                onClick={() => setIsEditing(true)}
              >
                Edit Caregiver
              </button>
            </>
          )}

        </div>
      </div>
    </>
  );
}