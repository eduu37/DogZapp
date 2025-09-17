import Alerta from "../models/Alerta.js";
import Usuario from "../models/Usuario.js";
import { emitToCommunity } from "../services/socket.js";
import { sendPushToTokens } from "../services/push.js";

// Crear una alerta
export async function createAlerta(req, res, next) {
  try {
    const { titulo, descripcion, tipo, ubicacion } = req.body;
    const userId = req.user.userId;

    // Traemos usuario y poblamos comunidad
    const usuario = await Usuario.findById(userId).populate("comunidad");

    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    if (!usuario.comunidad) {
      return res
        .status(400)
        .json({ message: "El usuario no pertenece a ninguna comunidad" });
    }

    const alerta = new Alerta({
      titulo,
      descripcion,
      tipo,
      ubicacion,
      autor: userId,
      comunidad: usuario.comunidad._id,
    });
    await alerta.save();

    // Emitir alerta por socket
    emitToCommunity(usuario.comunidad._id.toString(), "nueva-alerta", alerta);

    // Enviar push (opcional)
    const miembros = await Usuario.find({
      comunidad: usuario.comunidad._id,
      fcmTokens: { $exists: true, $not: { $size: 0 } },
    });
    const tokens = miembros.flatMap((m) => m.fcmTokens || []);
    if (tokens.length)
      await sendPushToTokens(tokens, {
        title: `Alerta: ${tipo}`,
        body: titulo || descripcion,
        data: { alertaId: alerta._id.toString() },
      });

    res.status(201).json(alerta);
  } catch (err) {
    console.error("Error en createAlerta:", err);
    next(err);
  }
}

// Listar alertas de la comunidad
export async function listarAlertas(req, res, next) {
  try {
    const userId = req.user.userId;

    const usuario = await Usuario.findById(userId).populate("comunidad");

    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    if (!usuario.comunidad) {
      return res
        .status(400)
        .json({ message: "El usuario no pertenece a ninguna comunidad" });
    }

    const alertas = await Alerta.find({ comunidad: usuario.comunidad._id })
      .sort({ fecha: -1 })
      .limit(100);

    res.json(alertas);
  } catch (err) {
    console.error("Error en listarAlertas:", err);
    next(err);
  }
}
