// En este archivo debemos tener las configuracion iniciales de nuestro proyecto
// 1. Creacion del servidor con express para levantar el servidor en un puerto en especifico
// 2. La definicion de las rutas que van a manejar en el proyecto
// 2.1. /users /flats /messages /auth
// 3. Llamar a nuestro archivo de conexion a la BDD
// 4. Podemos agregar un middleware global -> cors
// 5. El server se comunica con la capa de routes

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./db/db.js";
import flatRouter from "./routes/flat.router.js";
import messageRouter from "./routes/message.router.js";

//initialize express
const app = express();
dotenv.config();
connectDB();
//middleware
app.use(cors());
app.use(express.json());

//routes
app.use("/flats", flatRouter);
app.use("/messages", messageRouter);

//server
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
