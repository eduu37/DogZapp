import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.js";
import alertRoutes from "./routes/alertas.js";
import { initSocket } from "./services/socket.js";
import errorHandler from "./middlewares/errorHandler.js";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

const allowedOrigins = [
  "http://localhost:19006",          // Expo local
  "http://localhost:3000",           // Si pruebas con React web local
  "exp://127.0.0.1:19000",           // Expo Go (a veces usa este esquema)
  process.env.API_URL // Tu backend en Railway
];

app.use(cors({
  origin: (origin, callback) => {
    // Permitir si no hay origin (ej: app nativa) o si está en la lista
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("No permitido por CORS"));
    }
  },
  credentials: true
}));


app.use(helmet());
app.use(express.json({ limit: "5mb" }));
app.use(morgan("dev"));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 200 }));

// rutas
app.use("/api/auth", authRoutes);
app.use("/api/alertas", alertRoutes);

// prueba de servidor
app.get("/", (req, res) => res.send("Servidor funcionando 🚀"));

// error handler
app.use(errorHandler);

// iniciar DB y socket
await connectDB(process.env.MONGO_URL);
initSocket(io);

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Servidor escuchando en puerto ${PORT}`));
