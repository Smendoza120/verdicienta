import { connectDB } from "../../../config/db";
import { UserModel } from "../models/userModel";
import {
  RegisterUserDTO,
  LoginUserDTO,
  UserResponse,
  UpdateUserDTO,
  JWTPayload,
} from "../interfaces/userInterface";
import { hashPassword, comparePassword } from "../utils/passwordUtils";
import { generateToken } from "../utils/jwtUtils";

export class AuthService {
  /**
   * Registra un nuevo usuario en la base de datos
   */
  async register(
    data: RegisterUserDTO,
  ): Promise<{ user: UserResponse; token: string }> {
    await connectDB();

    const { name, email, password, role, isActive } = data;

    if (!name || !email || !password) {
      throw new Error("El nombre, correo y contraseña son obligatorios.");
    }

    // Verificar si el usuario ya existe
    const existingUser = await UserModel.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      throw new Error("El correo electrónico ya se encuentra registrado.");
    }

    // Encriptar la contraseña
    const hashedPassword = await hashPassword(password);

    const userIsActive = typeof isActive === "boolean" ? isActive : true;

    // Crear el usuario (por defecto el rol es Vendedor si no se especifica)
    const newUser = await UserModel.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: role || "Vendedor",
      isActive: userIsActive,
    });

    const userPayload: JWTPayload = {
      id: newUser._id.toString(),
      email: newUser.email,
      role: newUser.role,
    };

    const token = generateToken(userPayload);

    const userResponse: UserResponse = {
      id: newUser._id.toString(),
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      isActive: newUser.isActive,
      createdAt: newUser.createdAt,
    };

    return { user: userResponse, token };
  }

  /**
   * Inicia sesión verificando credenciales y emite un token JWT con expiración de 20s
   */
  async login(
    data: LoginUserDTO,
  ): Promise<{ user: UserResponse; token: string; expiresIn: string }> {
    await connectDB();

    const { email, password } = data;

    if (!email || !password) {
      throw new Error("El correo y la contraseña son obligatorios.");
    }

    // Buscar al usuario e incluir explícitamente el campo password (ya que tiene select: false en el schema)
    const user = await UserModel.findOne({ email: email.toLowerCase() }).select(
      "+password",
    );

    if (!user) {
      throw new Error("Credenciales inválidas.");
    }

    if (user.isActive === false) {
      throw new Error(
        "Tu cuenta se encuentra deshabilitada. Contacta al Administrador.",
      );
    }

    // Verificar la contraseña
    const isPasswordValid = await comparePassword(
      password,
      user.password || "",
    );

    if (!isPasswordValid) {
      throw new Error("Credenciales inválidas.");
    }

    const userPayload: JWTPayload = {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    const token = generateToken(userPayload);
    const expiresIn = process.env.JWT_EXPIRES_IN || "20s";

    const userResponse: UserResponse = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive ?? true,
    };

    return { user: userResponse, token, expiresIn };
  }

  /**
   * Obtiene la lista de todos los usuarios
   */
  async getUsers(activeOnly?: boolean): Promise<UserResponse[]> {
    await connectDB();

    const query = activeOnly !== undefined ? { isActive: activeOnly } : {};
    const users = await UserModel.find(query).sort({ createdAt: -1 });

    return users.map((user) => ({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive ?? true,
      createdAt: user.createdAt,
    }));
  }

  /**
   * Actualiza los datos de un usuario (incluyendo cambiar rol o estado)
   */
  async updateUser(id: string, data: UpdateUserDTO): Promise<UserResponse> {
    await connectDB();

    const updateData: Partial<UpdateUserDTO> = { ...data };

    // Si se envía una nueva contraseña, la hasheamos
    if (updateData.password) {
      updateData.password = await hashPassword(updateData.password);
    }

    const updatedUser = await UserModel.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      throw new Error("Usuario no encontrado.");
    }

    return {
      id: updatedUser._id.toString(),
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      isActive: updatedUser.isActive ?? true,
      createdAt: updatedUser.createdAt,
    };
  }

  /**
   * Deshabilita o habilita a un usuario (Borrado lógico)
   */
  async toggleUserStatus(id: string, isActive: boolean): Promise<UserResponse> {
    return this.updateUser(id, { isActive });
  }
}
