const admin = require("./firebaseAdmin");

async function sendTestNotification() {
  try {
    const message = {
      token:"cvdNNQlOs-QTgu0UaehyJZ:APA91bGmpjuqpy9qLIUgfaze0hOae_VsWw1uLKI8A2CcT0IhKdJUagTlZ1xv5UUe60p0mWury3Jcr4lWaTZlt-q36J0ajFAPXVxvwtB7I5O9X8gxrmB115o",

      notification: {
        title: "MediGuard",
        body: "Congratulations! Your first notification works 🎉",
      },
    };

    const response = await admin.messaging().send(message);

    console.log("Notification sent:", response);
  } catch (err) {
    console.error(err);
  }
}

sendTestNotification();