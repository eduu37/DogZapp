import mongoose from "mongoose";

const usuarioSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  rol: { type: String, enum: ["usuario", "moderador", "admin"], default: "usuario" },
  comunidad: { type: mongoose.Schema.Types.ObjectId, ref: "Comunidad" },
  fcmTokens: [{ type: String }]
});

export default mongoose.model("Usuario", usuarioSchema);
