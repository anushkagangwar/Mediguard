const mongoose = require("mongoose");

const medicineSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    dosage: {
      type: String,
      required: true,
    },
    frequency: {
      type: String,
      default: "Daily",
    },
    time: {
      type: String,
      required: true,
    },
    startDate: {
      type: String,
    },
    endDate: {
      type: String,
    },
    notes: {
      type: String,
    },
    status: {
      type: String,
      default: "Pending",
    },
    
    notificationSent: {
       type: Boolean,
       default: false,
      },

    missedNotificationSent: {
       type: Boolean,
       default: false,
    },


    // 👇 important for caregiver-patient system (future use)
    patientId: {
      type: String,
    },
    caregiverId: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Medicine", medicineSchema);