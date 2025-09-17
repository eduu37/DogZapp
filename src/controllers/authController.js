import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Usuario from "../models/Usuario.js";
import Comunidad from "../models/Comunidad.js";

const SALT_ROUNDS = 10;

export async function register(req, res, next) {
  try {
    const { nombre, email, password, codigoComunidad } = req.body;
    const hashed = await bcrypt.hash(password, SALT_ROUNDS);
    const comunidad = await Comunidad.findOne({ codigo: codigoComunidad });
    if (!comunidad) return res.status(400).json({ message: "Código de comunidad inválido" });

    const usuario = new Usuario({ nombre, email, password: hashed, comunidad: comunidad._id });
    await usuario.save();
    logger.info("Usuario registrado", { userId: user._id });
    res.status(201).json({ message: "Usuario creado" });
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await Usuario.findOne({ email });
    if (!user) return res.status(401).json({ message: "Credenciales inválidas" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: "Credenciales inválidas" });

    const token = jwt.sign({ userId: user._id, rol: user.rol }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN
    });

    res.json({
      token,
      user: { id: user._id, nombre: user.nombre, email: user.email, comunidad: user.comunidad }
    });
  } catch (err) {
    next(err);
  }
}


