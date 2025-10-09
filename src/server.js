import express from "express";
import cors from "cors";
import "dotenv/config";

import userRoutes from "./routes/authRoutes.js";
import lostItemRoutes from "./routes/lostItemRoutes.js"

import { connectDB } from "./lib/db.js";
import job from "./lib/cron.js";

const app = express();
const PORT = process.env.PORT || 3000;

job.start()
app.use(express.json());
app.use(cors());

app.use("/api/auth", userRoutes);
app.use("/api/item",lostItemRoutes)

app.listen(PORT, () => {
  console.log(`Server is runing on port ${PORT}`);
  connectDB();
});
