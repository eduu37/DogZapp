import mongoose from "mongoose";

const ComunidadSchema = new mongoose.Schema({
  nombre: String,
  codigo: String
}, { collection: "comunidades" }); // <--- forzar nombre exacto

export default mongoose.model("Comunidad", ComunidadSchema);
