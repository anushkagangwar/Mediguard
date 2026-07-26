const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    patientId: {
      type: String,
      required: true,
    },

    medicineId: {
      type: String,
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    body: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      default: "Medicine Reminder",
    },

    isRead: {
      type: Boolean,
      default: false,
    },

    sentAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Notification",
  notificationSchema
);