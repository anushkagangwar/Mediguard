
const cron = require("node-cron");
const Medicine = require("../models/Medicine");
const User = require("../models/User");
const Notification = require("../models/Notification");
const admin = require("../firebaseAdmin");
const { getIO } = require("../socket");

cron.schedule("* * * * *", async () => {
  console.log("\n==============================");
  console.log("Checking medicines...");

  try {
    const now = new Date();

    const currentTime =
      now.getHours().toString().padStart(2, "0") +
      ":" +
      now.getMinutes().toString().padStart(2, "0");

    console.log("Current Time:", currentTime);

    const medicines = await Medicine.find({
      time: currentTime,
      status: "Pending",
      notificationSent: false,
    });

    console.log("Medicines Found:", medicines.length);

    for (const medicine of medicines) {
      console.log("--------------------------------");
      console.log("Medicine:", medicine.name);
      console.log("Medicine Time:", medicine.time);
      console.log("Patient ID:", medicine.patientId);

      const patient = await User.findById(medicine.patientId);

      if (!patient) {
        console.log("❌ Patient not found");
        continue;
      }

      console.log("Patient:", patient.email);
      console.log("FCM Token:", patient.fcmToken);

      if (!patient.fcmToken) {
        console.log("❌ Patient has no FCM Token");
        continue;
      }

      const message = {
  token: patient.fcmToken,

  notification: {
    title: "💊 MediGuard",
    body: `Time to take ${medicine.name}`,
  },

  data: {
    title: "💊 MediGuard",
    body: `Time to take ${medicine.name}`,
    type: "medicine-reminder",
  },

  webpush: {
    headers: {
      Urgency: "high",
    },
    notification: {
      title: "💊 MediGuard",
      body: `Time to take ${medicine.name}`,
      icon: "/vite.svg",
      requireInteraction: true,
    },
    fcmOptions: {
      link: "http://localhost:5173",
    },
  },
};

      console.log("➡️ Sending Firebase Notification...");

      try {
        const firebaseResponse = await admin.messaging().send(message);
        console.log("✅ Firebase Sent Successfully");
        console.log(firebaseResponse);
      } catch (err) {
        console.log("❌ Firebase Error");
        console.log(err);
        continue;
      }

      console.log("➡️ Saving Notification to MongoDB...");

      const notification = await Notification.create({
        patientId: medicine.patientId,
        medicineId: medicine._id.toString(),
        title: "💊 MediGuard",
        body: `Time to take ${medicine.name}`,
        type: "Medicine Reminder",
      });

      console.log("✅ Notification Saved");
      console.log(notification);

      console.log("➡️ Getting Socket.IO Instance...");

      const io = getIO();

      console.log("✅ Socket.IO Instance Found");

      console.log("➡️ Emitting Notification...");

      io.emit("newNotification", notification);

      console.log("✅ Notification Emitted");

      medicine.notificationSent = true;

      await medicine.save();

      console.log("✅ Medicine Updated");
      console.log(`Notification sent to ${patient.email}`);
    }

    console.log("==============================\n");
  } catch (err) {
    console.log("❌ Scheduler Error");
    console.log(err);
  }
});