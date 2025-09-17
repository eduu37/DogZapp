// src/routes/archivos.js (ejemplo)
import multer from "multer";
import express from "express";
const upload = multer({ dest: "uploads/" });
const router = express.Router();

router.post("/upload", upload.single("file"), (req, res) => {
  // req.file.path -> usar para subir a S3 o guardar ruta
  res.json({ file: req.file });
});
export default router;
