const cron = require("node-cron");
const Medicine = require("../models/Medicine");
const User = require("../models/User");
const Notification = require("../models/Notification");
const admin = require("../firebaseAdmin");
const { getIO } = require("../socket");
const PatientCaregiver = require("../models/PatientCaregiver");

// Runs every minute
cron.schedule("* * * * *", async () => {
  console.log("\n==============================");
  console.log("Checking missed medicines...");

  try {
    const now = new Date();

    const currentMinutes =
      now.getHours() * 60 + now.getMinutes();

    console.log("Current Minutes:", currentMinutes);

    const medicines = await Medicine.find({
      status: "Pending",
      missedNotificationSent: false,
    });

    console.log("Pending Medicines:", medicines.length);

    for (const medicine of medicines) {
      // Convert medicine time (HH:mm) into minutes
      const [hour, minute] = medicine.time
        .split(":")
        .map(Number);

      const medicineMinutes = hour * 60 + minute;

      // Check if medicine is overdue by 30 minutes
      if (currentMinutes - medicineMinutes < 1){
        continue;
      }

      console.log("--------------------------------");
      console.log("Missed Medicine:", medicine.name);

      const patient = await User.findById(
        medicine.patientId
      );

      if (!patient) {
        console.log("Patient not found");
        continue;
      }

      if (!patient.fcmToken) {
        console.log("Patient has no FCM Token");
      }

      // Update medicine status
      medicine.status = "Missed";
      medicine.missedNotificationSent = true;

      await medicine.save();

      console.log("Medicine status updated to Missed");

      // Save notification in MongoDB
      const notification =
        await Notification.create({
          patientId: medicine.patientId,
          medicineId: medicine._id.toString(),
          title: "⚠️ Medicine Missed",
          body: `You missed your medicine: ${medicine.name}`,
          type: "Missed Medicine",
        });

      console.log("Notification saved");

      // Send Firebase Push Notification
      if (patient.fcmToken) {
        const message = {
          token: patient.fcmToken,

          notification: {
            title: "⚠️ Medicine Missed",
            body: `You missed your medicine: ${medicine.name}`,
          },

          webpush: {
            headers: {
              Urgency: "high",
            },
            notification: {
              title: "⚠️ Medicine Missed",
              body: `You missed your medicine: ${medicine.name}`,
              icon: "/vite.svg",
              requireInteraction: true,
            },
            fcmOptions: {
              link: "http://localhost:5173",
            },
          },
        };

        await admin.messaging().send(message);

        console.log("Firebase Missed Notification Sent");
      }

      // Emit Socket.IO Event
      const io = getIO();

      io.emit("newNotification", notification);

      console.log("Socket Notification Emitted");

      console.log(
        `Missed notification sent to ${patient.email}`
      );

      // ======================================
// CAREGIVER NOTIFICATION
// ======================================

const link = await PatientCaregiver.findOne({
  patientId: medicine.patientId,
});

if (!link) {
  console.log("No caregiver linked");
} else {
  const caregiver = await User.findById(link.caregiverId);

  if (!caregiver) {
    console.log("Caregiver not found");
  } else {
    console.log("Caregiver:", caregiver.email);

    const caregiverNotification = await Notification.create({
      patientId: caregiver._id,
      medicineId: medicine._id.toString(),
      title: "⚠️ Patient Missed Medicine",
      body: `${patient.name} missed ${medicine.name}`,
      type: "Caregiver Alert",
    });

    console.log("Caregiver notification saved");

    if (caregiver.fcmToken) {
      const caregiverMessage = {
        token: caregiver.fcmToken,

        notification: {
          title: "⚠️ Patient Missed Medicine",
          body: `${patient.name} missed ${medicine.name}`,
        },

        webpush: {
          notification: {
            title: "⚠️ Patient Missed Medicine",
            body: `${patient.name} missed ${medicine.name}`,
            icon: "/vite.svg",
          },
          fcmOptions: {
            link: "http://localhost:5173",
          },
        },
      };

      await admin.messaging().send(caregiverMessage);

      console.log("Caregiver Firebase Notification Sent");
    }

    io.emit("newNotification", caregiverNotification);

    console.log("Caregiver Socket Notification Emitted");
  }
}
    }

    console.log("==============================\n");
  } catch (err) {
    console.log(err);
  }
});