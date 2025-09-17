import express from "express";
import { requireAuth } from "../middlewares/auth.js";
import { createAlerta, listarAlertas } from "../controllers/alertController.js";

const router = express.Router();
router.post("/", requireAuth, createAlerta);
router.get("/", requireAuth, listarAlertas);

export default router;
