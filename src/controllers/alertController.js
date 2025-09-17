import Alerta from "../models/Alerta.js";
import Usuario from "../models/Usuario.js";
import { emitToCommunity } from "../services/socket.js";
import { sendPushToTokens } from "../services/push.js";

export async function createAlerta(req, res, next) {
  try {
    const { titulo, descripcion, tipo, ubicacion } = req.body;
    const userId = req.user.userId;

    const usuario = await Usuario.findById(userId).populate("comunidad");
    if (!usuario || !usuario.comunidad) return res.status(400).json({ message: "Usuario no asociado a comunidad" });

    const alerta = new Alerta({
      titulo,
      descripcion,
      tipo,
      ubicacion,
      autor: userId,
      comunidad: usuario.comunidad._id
    });
    await alerta.save();

    // emitir alerta por socket
    emitToCommunity(usuario.comunidad._id.toString(), "nueva-alerta", alerta);

    // enviar push (opcional)
    const miembros = await Usuario.find({ comunidad: usuario.comunidad._id, fcmTokens: { $exists: true, $not: { $size: 0 } } });
    const tokens = miembros.flatMap(m => m.fcmTokens || []);
    if (tokens.length) await sendPushToTokens(tokens, { title: `Alerta: ${tipo}`, body: titulo || descripcion, data: { alertaId: alerta._id.toString() } });

    res.status(201).json(alerta);
  } catch (err) {
    next(err);
  }
}

export async function listarAlertas(req, res, next) {
  try {
    const userId = req.user.userId;
    const usuario = await Usuario.findById(userId);
    const alertas = await Alerta.find({ comunidad: usuario.comunidad }).sort({ fecha: -1 }).limit(100);
    res.json(alertas);
  } catch (err) {
    logger.error("Error creando alerta", { error: err.message });
    next(err);
  }
}
