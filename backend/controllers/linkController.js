const User = require("../models/User");
const PatientCaregiver = require(
  "../models/PatientCaregiver"
);

const getPatientForCaregiver = async (
  req,
  res
) => {
  try {
    const { caregiverId } = req.params;

    const link =
      await PatientCaregiver.findOne({
        caregiverId,
      });

    if (!link) {
      return res.status(404).json({
        message:
          "No patient linked to this caregiver",
      });
    }

    const patient =
      await User.findById(
        link.patientId
      ).select("-password");

    res.status(200).json({
      patient,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getPatientForCaregiver,
};