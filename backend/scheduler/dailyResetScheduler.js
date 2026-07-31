const cron = require("node-cron");
const Medicine = require("../models/Medicine");

// Runs every day at 12:00 AM IST
cron.schedule(
  "0 0 * * *",
  async () => {
    console.log("=================================");
    console.log("Resetting Daily Medicines...");

    try {
      const result = await Medicine.updateMany(
        {
          frequency: "Daily",
        },
        {
          $set: {
            status: "Pending",
            notificationSent: false,
            missedNotificationSent: false,
          },
        }
      );

      console.log(
        `Reset ${result.modifiedCount} medicines`
      );

      console.log("Daily reset completed");
      console.log("=================================");
    } catch (err) {
      console.log(err);
    }
  },
  {
    timezone: "Asia/Kolkata",
  }
);