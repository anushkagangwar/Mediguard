const cron = require("node-cron");
const Medicine = require("../models/Medicine");
const User = require("../models/User");
const Notification = require("../models/Notification");
const admin = require("../firebaseAdmin");
const { getIO } = require("../socket");
const PatientCaregiver = require("../models/PatientCaregiver");


console.log("🚀 medicineScheduler loaded");
cron.schedule(
  "* * * * *",
  async () => {
    console.log("\n==============================");
    console.log("Checking missed medicines...");

    try {
      // IST TIME
      const now = new Date();

      const istTime = new Date(
        now.toLocaleString("en-US", {
          timeZone: "Asia/Kolkata",
        })
      );

      const currentMinutes =
        istTime.getHours() * 60 +
        istTime.getMinutes();

      console.log(
        "Current IST Time:",
        `${istTime
          .getHours()
          .toString()
          .padStart(2, "0")}:${istTime
          .getMinutes()
          .toString()
          .padStart(2, "0")}`
      );

      const medicines = await Medicine.find({
        status: "Pending",
        missedNotificationSent: false,
      });

      console.log("Pending Medicines:", medicines.length);

      for (const medicine of medicines) {
        const [hour, minute] = medicine.time
          .split(":")
          .map(Number);

        const medicineMinutes = hour * 60 + minute;

        const difference =
          currentMinutes - medicineMinutes;

        // Change 1 to 30 if you want missed notification after 30 minutes
        if (difference < 1) {
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

        medicine.status = "Missed";
        medicine.missedNotificationSent = true;

        await medicine.save();

        console.log("Medicine marked as Missed");

        // Save patient notification
        const notification =
          await Notification.create({
            patientId: medicine.patientId,
            medicineId: medicine._id.toString(),
            title: "⚠️ Medicine Missed",
            body: `You missed your medicine: ${medicine.name}`,
            type: "Missed Medicine",
          });

        console.log("Patient notification saved");

        // Firebase notification to patient
        if (patient.fcmToken) {
          const message = {
            token: patient.fcmToken,

            notification: {
              title: "⚠️ Medicine Missed",
              body: `You missed your medicine: ${medicine.name}`,
            },

            data: {
              title: "⚠️ Medicine Missed",
              body: `You missed your medicine: ${medicine.name}`,
              type: "missed-medicine",
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
                link: "https://YOUR-NETLIFY-URL.netlify.app",
              },
            },
          };

          await admin.messaging().send(message);

          console.log("Patient Firebase Notification Sent");
        }

        // Socket notification
        const io = getIO();

        io.emit("newNotification", notification);

        console.log("Patient Socket Notification Sent");

        // ======================================
        // CAREGIVER NOTIFICATION
        // ======================================

        const link =
          await PatientCaregiver.findOne({
            patientId: medicine.patientId,
          });

        if (link) {
          const caregiver =
            await User.findById(link.caregiverId);

          if (caregiver) {
            const caregiverNotification =
              await Notification.create({
                patientId: caregiver._id,
                medicineId:
                  medicine._id.toString(),
                title:
                  "⚠️ Patient Missed Medicine",
                body: `${patient.name} missed ${medicine.name}`,
                type: "Caregiver Alert",
              });

            console.log(
              "Caregiver notification saved"
            );

            if (caregiver.fcmToken) {
              const caregiverMessage = {
                token: caregiver.fcmToken,

                notification: {
                  title:
                    "⚠️ Patient Missed Medicine",
                  body: `${patient.name} missed ${medicine.name}`,
                },

                data: {
                  title:
                    "⚠️ Patient Missed Medicine",
                  body: `${patient.name} missed ${medicine.name}`,
                  type: "caregiver-alert",
                },

                webpush: {
                  headers: {
                    Urgency: "high",
                  },
                  notification: {
                    title:
                      "⚠️ Patient Missed Medicine",
                    body: `${patient.name} missed ${medicine.name}`,
                    icon: "/vite.svg",
                    requireInteraction: true,
                  },
                  fcmOptions: {
                    link: "https://YOUR-NETLIFY-URL.netlify.app",
                  },
                },
              };

              await admin.messaging().send(
                caregiverMessage
              );

              console.log(
                "Caregiver Firebase Notification Sent"
              );
            }

            io.emit(
              "newNotification",
              caregiverNotification
            );

            console.log(
              "Caregiver Socket Notification Sent"
            );
          }
        }
      }

      console.log("==============================\n");
    } catch (err) {
      console.log("Scheduler Error");
      console.log(err);
    }
  },
  {
    timezone: "Asia/Kolkata",
  }
);