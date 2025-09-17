import User from "../models/Usuario.js"; // tu modelo de usuario
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res, next) => {
  try {
    const { nombre, email, password, codigoComunidad } = req.body;

    // ✅ Verificar si ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "El email ya está registrado" });
    }

    // ✅ Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Crear usuario
    const newUser = new User({
      nombre,
      email,
      password: hashedPassword,
      codigoComunidad,
    });

    await newUser.save();

    // ✅ Generar token JWT
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.status(201).json({ user: { nombre, email, codigoComunidad }, token });
  } catch (error) {
    console.error(error);
    next(error); // pasa al manejador de errores global
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