import { useState, useEffect } from "react";
import axios from "axios";
import DashboardNavbar from "../components/DashboardNavbar";

export default function AddMedicines() {
  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const API =
    " https://mediguard-vgkt.onrender.com/api/medicine";

  const [showModal, setShowModal] =
    useState(false);

  const [medicines, setMedicines] =
    useState([]);

  const [editId, setEditId] =
    useState(null);

  const [searchTerm, setSearchTerm] =
    useState("");

  const [formData, setFormData] =
    useState({
      name: "",
      dosage: "",
      frequency: "Daily",
      time: "",
      startDate: "",
      endDate: "",
      notes: "",
    });

  // FETCH MEDICINES OF LOGGED-IN PATIENT
  const fetchMedicines = async () => {
    try {
      if (!user) return;

      // const res = await axios.get(
      //   `${API}/patient/${user.id}`
      // );

      let res;

if (user.role === "patient") {
  res = await axios.get(
    `${API}/patient/${user.id}`
  );
} else {
  res = await axios.get(
    `${API}/caregiver/${user.id}`
  );
}

      setMedicines(
        Array.isArray(res.data)
          ? res.data
          : []
      );
    } catch (err) {
      console.error(
        "Error fetching medicines:",
        err
      );
    }
  };

  useEffect(() => {
    fetchMedicines();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  // AUTO MISSED CHECK
  useEffect(() => {
    const interval =
      setInterval(() => {
        setMedicines((prev) =>
          prev.map((medicine) => {
            if (
              medicine.status !==
              "Pending"
            )
              return medicine;

            const now = new Date();

            const currentTime =
              now
                .getHours()
                .toString()
                .padStart(2, "0") +
              ":" +
              now
                .getMinutes()
                .toString()
                .padStart(2, "0");

            if (
              medicine.time &&
              currentTime >
                medicine.time
            ) {
              return {
                ...medicine,
                status: "Missed",
              };
            }

            return medicine;
          })
        );
      }, 60000);

    return () =>
      clearInterval(interval);
  }, []);

  // SAVE / UPDATE
  const handleSave = async () => {
    try {
      if (
        !formData.name ||
        !formData.dosage ||
        !formData.time
      ) {
        alert(
          "Please fill all required fields"
        );
        return;
      }

      if (editId) {
        await axios.put(
          `${API}/${editId}`,
          formData
        );
      } else {
        await axios.post(API, {
          ...formData,
          patientId: user.id,
        });
      }

      await fetchMedicines();

      setFormData({
        name: "",
        dosage: "",
        frequency: "Daily",
        time: "",
        startDate: "",
        endDate: "",
        notes: "",
      });

      setEditId(null);
      setShowModal(false);
    } catch (err) {
      console.error(
        "Save error:",
        err
      );
      alert("Save failed");
    }
  };

  // DELETE
  const handleDelete = async (
    id
  ) => {
    try {
      await axios.delete(
        `${API}/${id}`
      );

      fetchMedicines();
    } catch (err) {
      console.error(err);
    }
  };

  // MARK AS TAKEN
  const markAsTaken = async (
    id
  ) => {
    try {
      await axios.put(
        `${API}/${id}`,
        {
          status: "Taken",
        }
      );

      fetchMedicines();
    } catch (err) {
      console.error(err);
    }
  };

  // EDIT
  const handleEdit = (
    medicine
  ) => {
    setFormData({
      name: medicine.name,
      dosage: medicine.dosage,
      frequency:
        medicine.frequency,
      time: medicine.time,
      startDate:
        medicine.startDate,
      endDate:
        medicine.endDate,
      notes: medicine.notes,
    });

    setEditId(medicine._id);
    setShowModal(true);
  };

  const filteredMedicines = medicines.filter((medicine) =>
    medicine.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <DashboardNavbar />

      <div className="medicines-page">

        <div className="page-header">
          <h1>Medicines</h1>

          <button
            className="add-med-btn"
            onClick={() => {
              setEditId(null);
              setFormData({
                name: "",
                dosage: "",
                frequency: "Daily",
                time: "",
                startDate: "",
                endDate: "",
                notes: "",
              });
              setShowModal(true);
            }}
          >
            + Add Medicine
          </button>
        </div>

        <div className="search-box">
          <input
            type="text"
            placeholder="Search medicines..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="medicine-grid">

          {filteredMedicines.length === 0 ? (
            <div className="medicine-card">
              <h3>No Medicines Found</h3>
              <p>Add a medicine or try a different search.</p>
            </div>
          ) : (
            filteredMedicines.map((medicine) => (
              <div key={medicine._id} className="medicine-card">

                <h3>{medicine.name}</h3>

                <p>Dosage: {medicine.dosage}</p>
                <p>Frequency: {medicine.frequency}</p>
                <p>Reminder Time: {medicine.time}</p>
                <p>Start Date: {medicine.startDate || "--"}</p>
                <p>End Date: {medicine.endDate || "--"}</p>

                <p
                  className={
                    medicine.status === "Taken"
                      ? "status-taken"
                      : medicine.status === "Missed"
                      ? "status-missed"
                      : "status-pending"
                  }
                >
                  Status: {medicine.status || "Pending"}
                </p>

                <div className="medicine-actions">

                  <button
                    className="edit-btn"
                    onClick={() => handleEdit(medicine)}
                  >
                    Edit
                  </button>

                  <button
                    className="taken-btn"
                    disabled={medicine.status === "Taken"}
                    onClick={() => markAsTaken(medicine._id)}
                  >
                    {medicine.status === "Taken"
                      ? "Completed"
                      : "Taken"}
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(medicine._id)}
                  >
                    Delete
                  </button>

                </div>
              </div>
            ))
          )}

        </div>

        {showModal && (
          <div className="modal-overlay">

            <div className="medicine-modal">

              <div className="modal-header">

                <h2>{editId ? "Edit Medicine" : "Add Medicine"}</h2>

                <button
                  className="close-btn"
                  onClick={() => {
                    setShowModal(false);
                    setEditId(null);
                  }}
                >
                  ✕
                </button>

              </div>

              <div className="modal-content">

                <label>Name</label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />

                <label>Dosage</label>
                <input
                  name="dosage"
                  value={formData.dosage}
                  onChange={handleChange}
                />

                <label>Time</label>
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                />

                <div className="form-row">

                  <div>
                    <label>Start Date</label>
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label>End Date</label>
                    <input
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleChange}
                    />
                  </div>

                </div>

                <select
                  name="frequency"
                  value={formData.frequency}
                  onChange={handleChange}
                >
                  <option>Daily</option>
                  <option>Twice Daily</option>
                  <option>Weekly</option>
                </select>

                <div className="modal-buttons">

                  <button
                    className="cancel-btn"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>

                  <button
                    className="save-btn"
                    onClick={handleSave}
                  >
                    {editId ? "Update" : "Save"}
                  </button>

                </div>

              </div>

            </div>

          </div>
        )}

      </div>
    </>
  );
}
