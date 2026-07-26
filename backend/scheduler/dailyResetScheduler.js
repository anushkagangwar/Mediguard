

const cron = require("node-cron");
const Medicine = require("../models/Medicine");

// Runs every day at 12:00 AM
cron.schedule("0 0 * * *", async () => {
  console.log("=================================");
  console.log("Resetting Daily Medicines...");

  try {
    const medicines = await Medicine.find({
      frequency: "Daily",
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let count = 0;

    for (const medicine of medicines) {
      // Skip if medicine has not started yet
      if (medicine.startDate) {
        const start = new Date(medicine.startDate);
        start.setHours(0, 0, 0, 0);

        if (today < start) {
          continue;
        }
      }

      // Skip if medicine has already ended
      if (medicine.endDate) {
        const end = new Date(medicine.endDate);
        end.setHours(0, 0, 0, 0);

        if (today > end) {
          continue;
        }
      }

      // Reset only if yesterday's medicine was completed
      if (
        medicine.status === "Taken" ||
        medicine.status === "Missed"
      ) {
        medicine.status = "Pending";
        medicine.notificationSent = false;
        medicine.missedNotificationSent = false;

        await medicine.save();

        count++;

        console.log(`✅ Reset: ${medicine.name}`);
      }
    }

    console.log(`Reset ${count} medicines`);
    console.log("Daily reset completed");
    console.log("=================================");
  } catch (err) {
    console.log(err);
  }
});