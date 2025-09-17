import mongoose from "mongoose";

const usuarioSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    comunidad: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comunidad", // referencia al modelo Comunidad
      required: true,   // obligatorio
    },
    fcmTokens: {
      type: [String],
      default: [],
    },
    rol: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  { timestamps: true }
);

const Usuario = mongoose.model("Usuario", usuarioSchema);
export default Usuario;
