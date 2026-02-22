import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";

dotenv.config(); // Load .env file

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Backend working 🚀");
});

// MongoDB connect using ENV
mongoose.connect(process.env.DB_URI)
  .then(() => console.log("MongoDB connected ✅"))
  .catch(err => console.log("Mongo error:", err));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});
