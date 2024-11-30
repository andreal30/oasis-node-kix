import express from "express";
import configs from "./configs/configs.js";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./db/db.js";
import flatRoutes from "./routes/flat.router.js";
import userRoutes from "./routes/user.router.js";
import authRoutes from "./routes/auth.router.js";
import logsRoutes from "./routes/logs.router.js";
import messageRoutes from "./routes/message.router.js";
const app = express();
dotenv.config();

//Middleware para parsear JSON
app.use(express.json());
app.use(cors());

connectDB();

app.use("/flats", flatRoutes);
app.use("/messages", messageRoutes);
app.use("/users", userRoutes);
app.use("/auth", authRoutes);
app.use("/logs", logsRoutes);

app.listen(configs.PORT, () => {
  console.log(`Server running on port ${configs.PORT}`);
});
