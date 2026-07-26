require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

// Routes
const authRoutes = require("./routes/authRoutes");
const linkRoutes = require("./routes/linkRoutes");
const caregiverRoutes = require("./routes/caregiverRoutes");
const patientCaregiverRoutes = require("./routes/patientCaregiverRoutes");
const medicineRoutes = require("./routes/medicineRoutes"); // ✅ ADDED (IMPORTANT)
const notificationRoutes = require("./routes/notificationRoutes");

const http = require("http");
const { Server } = require("socket.io");
const { setIO } = require("./socket");


connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/caregiver", caregiverRoutes);
app.use("/api/link", linkRoutes);
app.use("/api/patient-caregiver", patientCaregiverRoutes);

// ✅ MEDICINE ROUTES (THIS FIXES YOUR SAVE BUTTON ISSUE)
app.use("/api/medicine", medicineRoutes);
app.use("/api/notification", notificationRoutes);

// Health check route
app.get("/", (req, res) => {
  res.send("MediGuard API Running");
});



const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});
console.log("✅ Socket.IO Initialized");

setIO(io);

// Start scheduler AFTER Socket.IO is initialized
require("./scheduler/medicineScheduler");
require("./scheduler/missedMedicineScheduler");
require("./scheduler/dailyResetScheduler");

app.set("io", io);

io.on("connection", (socket) => {
  console.log("🟢 User Connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("🔴 User Disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;

console.log("Before server.listen()");

server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

console.log("After server.listen()");