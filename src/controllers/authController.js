import Usuario from "../models/Usuario.js";
import Comunidad from "../models/Comunidad.js"; // asegúrate de tener este modelo
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res, next) => {
  try {
    const { nombre, email, password, codigoComunidad } = req.body;

    // Verificar si el usuario ya existe
    const existingUser = await Usuario.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "El email ya está registrado" });
    }

    // Buscar la comunidad según el código
    const comunidad = await Comunidad.findOne({ codigo: codigoComunidad });
    if (!comunidad) {
      return res.status(400).json({ message: "Código de comunidad inválido" });
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario con comunidad asignada
    const newUser = new Usuario({
      nombre,
      email,
      password: hashedPassword,
      comunidad: comunidad._id,
    });

    await newUser.save();

    // Generar JWT
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(201).json({
      user: { nombre, email, comunidad: comunidad.nombre },
      token,
    });
  } catch (error) {
    console.error("Error en register:", error);
    next(error);
  }
};

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
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