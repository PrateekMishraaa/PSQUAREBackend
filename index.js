import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import userRoutes from "./routes/Users.js";
import candidateRoutes from "./routes/Canditate.js";

dotenv.config();
const PORT = process.env.PORT || 3000;

const app = express();

// ✅ Proper CORS middleware
app.use(cors({
  origin: [
    "https://pscomp-prateeks-projects-501ef9d0.vercel.app",
    "https://psquarebackend-1.onrender.com"
  ],
  credentials: true,
}));


app.use(express.json());

// ---- ROUTES ----
app.use("/api", userRoutes);
app.use("/api", candidateRoutes);

// health check
app.get("/", (req, res) => res.send("hello pandit ji"));

// ---- DB & SERVER ----
mongoose
  .connect(process.env.MONGOURI)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("Mongo error ➜", err.message));

app.listen(PORT, () => console.log(`Server running on ${PORT}`));
