const mongoose = require("mongoose");

const patientCaregiverSchema =
  new mongoose.Schema(
    {
      patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      caregiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    },
    {
      timestamps: true,
    }
  );

module.exports = mongoose.model(
  "PatientCaregiver",
  patientCaregiverSchema
);