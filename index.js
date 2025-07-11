// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import userRoutes from "./routes/Users.js";
import candidateRoutes from "./routes/Canditate.js";

dotenv.config();
const PORT = process.env.PORT || 3000;

const app = express();

// CORS: allow your Vercel front‑end to hit the API
cors({
  origin: [
       'https://psquare.vercel.app',
       'https://psquarebackend.onrender.com/'
     ],
     credentials: true,
});


app.use(express.json());

// ---- ROUTES ----
app.use("/api/users", userRoutes);
app.use("/api/candidates", candidateRoutes);

// health check
app.get("/", (req, res) => res.send("hello pandit ji"));

// ---- DB & SERVER ----
mongoose
  .connect(process.env.MONGOURI)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("Mongo error ➜", err.message));

app.listen(PORT, () => console.log(`Server running on ${PORT}`));
