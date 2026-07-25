import { Schema, model, models } from "mongoose";
import { IUser } from "../interfaces/userInterface";

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "El nombre es obligatorio."],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "El correo electrónico es obligatorio."],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Por favor ingresa un correo electrónico válido.",
      ],
    },
    password: {
      type: String,
      required: [true, "La contraseña es obligatoria."],
      select: false, // 🔒 Protección: NUNCA se incluye en consultas por defecto
    },
    role: {
      type: String,
      enum: {
        values: ["Administrador", "Vendedor"],
        message: "El rol '{VALUE}' no es válido. Debe ser Administrador o Vendedor.",
      },
      default: "Vendedor",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const UserModel = models.User || model<IUser>("User", userSchema);