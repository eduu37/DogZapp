import request from "supertest";
import express from "express";
import dotenv from "dotenv";
import { connectDB } from "../config/db.js";
import authRoutes from "../routes/auth.js";
import alertRoutes from "../routes/alertas.js";

dotenv.config();
const app = express();
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/alertas", alertRoutes);

beforeAll(async () => {
  await connectDB(process.env.MONGO_URL);
});

describe("Backend Alarma Comunitaria", () => {
  let token;

  it("Debería registrar usuario", async () => {
    const res = await request(app).post("/api/auth/register").send({
      nombre: "Tester",
      email: "tester@example.com",
      password: "123456",
      codigoComunidad: "COM123"
    });
    expect(res.statusCode).toBe(201);
  });

  it("Debería iniciar sesión", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "tester@example.com",
      password: "123456"
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
    token = res.body.token;
  });

  it("Debería crear alerta", async () => {
    const res = await request(app)
      .post("/api/alertas")
      .set("Authorization", `Bearer ${token}`)
      .send({
        titulo: "Prueba alerta",
        descripcion: "Prueba desde test",
        tipo: "info",
        ubicacion: { lat: -36.6, lng: -72.1 }
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.titulo).toBe("Prueba alerta");
  });

  it("Debería listar alertas", async () => {
    const res = await request(app)
      .get("/api/alertas")
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
