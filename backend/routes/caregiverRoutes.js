const express = require("express");

const {
  addCaregiver,
  getCaregiver,
} = require("../controllers/caregiverController");

const router = express.Router();

router.post("/", addCaregiver);

router.get("/:patientId", getCaregiver);

module.exports = router;