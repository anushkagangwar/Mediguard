


const User = require("../models/User");
const PatientCaregiver = require(
  "../models/PatientCaregiver"
);


const linkCaregiver = async (req, res) => {
  console.log("✅ linkCaregiver controller called");
  try {
    console.log("BODY:", req.body);

    const {
      patientId,
      caregiverEmail,
    } = req.body;

    console.log("EMAIL:", caregiverEmail);

 console.log("Request Body:", req.body);
console.log("Caregiver Email:", caregiverEmail);

    const caregiver = await User.findOne({
      email: caregiverEmail,
      role: "caregiver",
    });

   

    console.log("FOUND:", caregiver);

    if (!caregiver) {
      return res.status(404).json({
        message: "Caregiver account not found",
      });
    }

    const link = await PatientCaregiver.create({
      patientId,
      caregiverId: caregiver._id,
    });

    res.status(201).json(link);

  } catch (error) {
    console.log("ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// GET PATIENTS OF A CAREGIVER
const getPatientsByCaregiver =
  async (req, res) => {
    try {
      const links =
        await PatientCaregiver.find({
          caregiverId:
            req.params.caregiverId,
        });

      res.json(links);
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };

  const getDashboardPatient = async (req, res) => {
  try {
    const { caregiverId } = req.params;

    const link = await PatientCaregiver.findOne({
      caregiverId,
    }).populate("patientId");

    if (!link) {
      return res.status(404).json({
        message: "No linked patient found",
      });
    }

    res.json(link.patientId);

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  linkCaregiver,
  getPatientsByCaregiver,
  getDashboardPatient,
};