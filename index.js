import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import userRoutes from "./routes/Users.js";
import candidateRoutes from "./routes/Canditate.js";

dotenv.config();
const PORT = process.env.PORT || 3000;

const app = express();

// ✅ CORS Setup - MUST BE FIRST
app.use(cors({
  origin: "https://pscomp.vercel.app", // your Vercel frontend
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));

// ✅ Optional Debug - Add CORS headers manually to be extra safe
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://pscomp.vercel.app");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

app.use(express.json());

// Routes
app.use("/api", userRoutes);
app.use("/api", candidateRoutes);

// Health check
app.get("/", (req, res) => res.send("hello pandit ji"));

// DB & Server
mongoose
  .connect(process.env.MONGOURI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ Mongo error ➜", err.message));

app.listen(PORT, () => console.log(`🚀 Server running on ${PORT}`));
