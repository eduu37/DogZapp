import mongoose from "mongoose";

const alertaSchema = new mongoose.Schema({
  titulo: String,
  descripcion: String,
  tipo: { type: String, enum: ["roja", "amarilla", "info"], default: "info" },
  fecha: { type: Date, default: Date.now },
  ubicacion: {
    lat: Number,
    lng: Number
  },
  fotos: [String],
  autor: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario" },
  comunidad: { type: mongoose.Schema.Types.ObjectId, ref: "Comunidad" }
});

export default mongoose.model("Alerta", alertaSchema);
