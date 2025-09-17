import express from "express";
import { register, login } from "../controllers/authController.js";
import { body, validationResult } from "express-validator";

const router = express.Router();

router.post(
  "/register",
  [
    body("nombre").notEmpty().withMessage("El nombre es obligatorio"),
    body("email").isEmail().withMessage("Email inválido"),
    body("password").isLength({ min: 6 }).withMessage("Mínimo 6 caracteres"),
    body("codigoComunidad").notEmpty().withMessage("Código requerido"),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next(); // ✅ pasa al siguiente middleware
  },
  register // ✅ aquí ya se llama como middleware de Express
);

router.post("/login", login);

export default router;
