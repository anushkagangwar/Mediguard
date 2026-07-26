const express = require("express");
const router = express.Router();

const Medicine = require("../models/Medicine");
const PatientCaregiver = require("../models/PatientCaregiver");

// ==========================
// CREATE MEDICINE
// ==========================
router.post("/", async (req, res) => {
  try {
    const medicine = await Medicine.create(req.body);
    res.status(201).json(medicine);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

// ==========================
// UPDATE MISSED MEDICINES
// ==========================
router.put("/check-missed", async (req, res) => {
  try {
    const medicines = await Medicine.find({
      status: "Pending",
    });

    const now = new Date();

    const currentTime =
      now.getHours().toString().padStart(2, "0") +
      ":" +
      now.getMinutes().toString().padStart(2, "0");

    for (const medicine of medicines) {
      if (
        medicine.time &&
        medicine.time < currentTime
      ) {
        medicine.status = "Missed";
        await medicine.save();
      }
    }

    res.json({
      message: "Missed medicines updated",
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

// ==========================
// GET ALL MEDICINES
// (Admin / Testing)
// ==========================
router.get("/", async (req, res) => {
  try {
    const medicines = await Medicine.find();

    res.json(medicines);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

// ==========================
// GET MEDICINES OF ONE PATIENT
// ==========================
router.get("/patient/:patientId", async (req, res) => {
  try {
    const medicines = await Medicine.find({
      patientId: req.params.patientId,
    });

    res.json(medicines);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

// ==========================
// GET MEDICINES FOR CAREGIVER
// ==========================
// router.get(
//   "/caregiver/:caregiverId",
//   async (req, res) => {
//     try {
//       const links =
//         await PatientCaregiver.find({
//           caregiverId:
//             req.params.caregiverId,
//         });

//       const patientIds = links.map(
//         (link) => link.patientId
//       );

//       const medicines =
//         await Medicine.find({
//           patientId: {
//             $in: patientIds,
//           },
//         });

//       res.json(medicines);
//     } catch (err) {
//       res.status(500).json({
//         error: err.message,
//       });
//     }
//   }
// );

router.get(
  "/caregiver/:caregiverId",
  async (req, res) => {
    try {
      console.log(
        "Caregiver ID:",
        req.params.caregiverId
      );

      const links =
        await PatientCaregiver.find({
          caregiverId:
            req.params.caregiverId,
        });

      console.log("Links:", links);

      const patientIds = links.map(
        (link) => link.patientId
      );

      console.log(
        "Patient IDs:",
        patientIds
      );

      const medicines =
        await Medicine.find({
          patientId: {
            $in: patientIds,
          },
        });

      console.log(
        "Medicines Found:",
        medicines
      );

      res.json(medicines);
    } catch (err) {
      console.log("ERROR:", err);

      res.status(500).json({
        error: err.message,
      });
    }
  }
);

// ==========================
// UPDATE MEDICINE
// ==========================
router.put("/:id", async (req, res) => {
  try {
    const updatedMedicine =
      await Medicine.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );

    res.json(updatedMedicine);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

// ==========================
// DELETE MEDICINE
// ==========================
router.delete("/:id", async (req, res) => {
  try {
    await Medicine.findByIdAndDelete(
      req.params.id
    );

    res.json({
      message: "Deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

module.exports = router;