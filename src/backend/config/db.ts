import mongoose from "mongoose";
import { MongooseGlobal } from "../types/global.types";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "Por favor, define la variable MONGODB_URI dentro del archivo .env"
  );
}

let cached = (global as unknown as { mongoose: MongooseGlobal }).mongoose;

if (!cached) {
  cached = (global as unknown as { mongoose: MongooseGlobal }).mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongooseInstance) => {
      console.log("🚀 Conexión exitosa a MongoDB: verdicienta_db");
      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error("❌ Error conectando a MongoDB:", e);
    throw e;
  }

  return cached.conn;
}