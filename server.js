import express from "express";
import { connectDB } from "./app/db/db.js";
// import flatRoutes from "./app/routes/flat.router.js";
import userRoutes from "./app/routes/user.router.js";
import authRoutes from "./app/routes/auth.router.js";
import logsRoutes from "./app/routes/logs.router.js";
// import messageRoutes from "./app/routes/message.router.js";
import configs from "./app/configs/configs.js";
import cors from "cors";

const app = express();

//Middleware para parsear JSON
app.use(express.json());
app.use(cors());

connectDB();

// app.use("/flats", flatRoutes);
// app.use("/messages", messageRoutes);
app.use("/users", userRoutes);
app.use("/auth", authRoutes);
app.use("/logs", logsRoutes);

app.listen(configs.PORT, () => {
  console.log(`Server running on port ${configs.PORT}`);
});
