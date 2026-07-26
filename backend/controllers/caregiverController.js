const Caregiver = require("../models/caregiver");
const User = require("../models/User");
const PatientCaregiver = require("../models/PatientCaregiver");

const addCaregiver = async (req, res) => {
  try {
    const existing = await Caregiver.findOne({
      patientId: req.body.patientId,
    });

    if (existing) {
      existing.name = req.body.name;
      existing.relationship = req.body.relationship;
      existing.phone = req.body.phone;
      existing.email = req.body.email;

      await existing.save();

      return res.json(existing);
    }

   const caregiver = await Caregiver.create({
  patientId: req.body.patientId,
  name: req.body.name,
  relationship: req.body.relationship,
  phone: req.body.phone,
  email: req.body.email,
});

// ==========================
// LINK CAREGIVER ACCOUNT
// ==========================
const caregiverUser = await User.findOne({
  email: req.body.email,
  role: "caregiver",
});

if (caregiverUser) {
  const existingLink =
    await PatientCaregiver.findOne({
      patientId: req.body.patientId,
      caregiverId: caregiverUser._id,
    });

  if (!existingLink) {
    await PatientCaregiver.create({
      patientId: req.body.patientId,
      caregiverId: caregiverUser._id,
    });
  }
}

res.status(201).json(caregiver);


  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getCaregiver = async (req, res) => {
  try {
    const caregiver = await Caregiver.findOne({
      patientId: req.params.patientId,
    });

    res.json(caregiver);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  addCaregiver,
  getCaregiver,
};