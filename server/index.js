const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: { origin: "http://localhost:5173", methods: ["GET", "POST"] },
});

app.use(cors());
app.use(express.json());

// for now, use your local Mongo; later Docker will change this URI
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/full_stack_demo";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("Mongo error:", err.message));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// simple WebSocket demo
io.on("connection", (socket) => {
  console.log("🔌 client connected:", socket.id);
  socket.emit("welcome", { message: "Hello from Node server 👋" });
});

const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, () => {
  console.log(`🚀 API + WebSocket running on http://localhost:${PORT}`);
});
