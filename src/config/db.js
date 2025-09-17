import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      keepAlive: true,
      socketTimeoutMS: 45000,
      serverSelectionTimeoutMS: 5000,
      dbName: process.env.DB_NAME || "test", // asegúrate que coincide con tu base en Railway
    });
    console.log("✅ MongoDB conectado correctamente en Railway");
  } catch (err) {
    console.error("❌ Error conectando a MongoDB:", err.message);
    process.exit(1);
  }
};

export default connectDB;
