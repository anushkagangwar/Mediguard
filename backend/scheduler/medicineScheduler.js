const cron = require("node-cron");
const Medicine = require("../models/Medicine");
const User = require("../models/User");
const Notification = require("../models/Notification");
const admin = require("../firebaseAdmin");
const { getIO } = require("../socket");

console.log("🚀 medicineScheduler loaded");

cron.schedule(
  "* * * * *",
  async () => {
    console.log("\n==============================");
    console.log("Checking medicines...");

    try {
      // IST Time
      const now = new Date();

      const istTime = new Date(
        now.toLocaleString("en-US", {
          timeZone: "Asia/Kolkata",
        })
      );

      const currentTime =
        istTime.getHours().toString().padStart(2, "0") +
        ":" +
        istTime.getMinutes().toString().padStart(2, "0");

      console.log("Current IST Time:", currentTime);

      const medicines = await Medicine.find({
        time: currentTime,
        status: "Pending",
        notificationSent: false,
      });

      console.log("Medicines Found:", medicines.length);

      for (const medicine of medicines) {
        console.log("--------------------------------");
        console.log("Medicine:", medicine.name);

        const patient = await User.findById(medicine.patientId);

        if (!patient) {
          console.log("Patient not found");
          continue;
        }

        const notification = await Notification.create({
          patientId: medicine.patientId,
          medicineId: medicine._id.toString(),
          title: "💊 Time To Take Medicine",
          body: `Time to take ${medicine.name}`,
          type: "Medicine Reminder",
        });

        console.log("Notification Saved");

        if (patient.fcmToken) {
          const message = {
            token: patient.fcmToken,

            notification: {
              title: "💊 Time To Take Medicine",
              body: `Time to take ${medicine.name}`,
            },

            data: {
              title: "💊 Time To Take Medicine",
              body: `Time to take ${medicine.name}`,
              type: "medicine-reminder",
            },

            webpush: {
              headers: {
                Urgency: "high",
              },
              notification: {
                title: "💊 Time To Take Medicine",
                body: `Time to take ${medicine.name}`,
                icon: "/vite.svg",
                requireInteraction: true,
              },
              fcmOptions: {
                link: "https://YOUR-NETLIFY-URL.netlify.app",
              },
            },
          };

          await admin.messaging().send(message);

          console.log("Firebase Reminder Sent");
        }

        const io = getIO();

        io.emit("newNotification", notification);

        console.log("Socket Notification Sent");

        medicine.notificationSent = true;

        await medicine.save();

        console.log("Medicine Updated");
      }

      console.log("==============================\n");
    } catch (err) {
      console.log(err);
    }
  },
  {
    timezone: "Asia/Kolkata",
  }
);