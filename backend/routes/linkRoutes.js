const express = require("express");

const {
  linkCaregiver,
} = require(
  "../controllers/patientCaregiverController"
);

const {
  getPatientForCaregiver,
} = require(
  "../controllers/linkController"
);

const router = express.Router();

router.post(
  "/link",
  linkCaregiver
);

router.get(
  "/patient/:caregiverId",
  getPatientForCaregiver
);

module.exports = router;