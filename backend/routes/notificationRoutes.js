const express = require("express");
const router = express.Router();

const User = require("../models/User");
const Notification = require("../models/Notification");

router.post("/save-token", async (req, res) => {
  try {
    
      console.log(req.body);

    const { email, fcmToken } = req.body;

    console.log("Email:", email);
    console.log("Token:", fcmToken);

    const user = await User.findOneAndUpdate(
      { email },
      { fcmToken },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json({
      message: "FCM Token Saved",
      user,
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: err.message,
    });
  }
});

// ==========================
// GET ALL NOTIFICATIONS
// ==========================
router.get("/patient/:patientId", async (req, res) => {
  try {
    const notifications = await Notification.find({
      patientId: req.params.patientId,
    }).sort({ createdAt: -1 });

    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/unread/:patientId", async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      patientId: req.params.patientId,
      isRead: false,
    });

    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ==========================
// MARK AS READ
// ==========================
router.put("/:id/read", async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { returnDocument: "after" }
    );

    res.json(notification);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================
// DELETE NOTIFICATION
// ==========================
router.delete("/:id", async (req, res) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);

    res.json({
      message: "Notification deleted",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});





module.exports = router;