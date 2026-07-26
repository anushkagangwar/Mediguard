

console.log("PatientCaregiver routes loaded");

const express = require("express");

const {
  linkCaregiver,
  getPatientsByCaregiver,
   getDashboardPatient,
} = require("../controllers/patientCaregiverController");

console.log("linkCaregiver =", linkCaregiver);

const router = express.Router();

router.post("/link", linkCaregiver);

// router.post("/link", (req, res) => {
//   console.log("LINK ROUTE HIT");
//   res.json({ success: true });
// });

router.get(
  "/caregiver/:caregiverId",
  getPatientsByCaregiver
);



router.get("/test", (req, res) => {
  res.send("Patient Caregiver Route Working");
});

router.get(
  "/dashboard/:caregiverId",
  getDashboardPatient
);

module.exports = router;