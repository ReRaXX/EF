import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserRepository } from "../repositories/user.repository";
import { User, UserRole, UserStatus } from "../entities/user.entity";
import { RegisterDto } from "../dtos/register.dto";
import { LoginDto } from "../dtos/login.dto";
import {
  ConflictError,
  NotFoundError,
  UnauthorizedError,
  ForbiddenError,
} from "../errors/app-error";

const SALT_ROUNDS = 10;

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async register(dto: RegisterDto): Promise<{ user: Partial<User>; token: string }> {
    const email = dto.email.toLowerCase().trim();
    const existing = await this.userRepository.findByEmail(email);
    if (existing) {
      throw new ConflictError("Email is already registered");
    }

    const hashedPassword = await bcrypt.hash(dto.password, SALT_ROUNDS);

    const user = await this.userRepository.create({
      fullName: dto.fullName,
      birthDate: dto.birthDate,
      email,
      password: hashedPassword,
      role: UserRole.USER,
      status: UserStatus.ACTIVE,
    });

    const token = this.generateToken(user);

    const { password: _, ...userWithoutPassword } = user as User & { password: string };
    return { user: userWithoutPassword, token };
  }

  async login(dto: LoginDto): Promise<{ user: Partial<User>; token: string }> {
    const user = await this.userRepository.findByEmailWithPassword(dto.email.toLowerCase().trim());
    if (!user) {
      throw new UnauthorizedError("Invalid email or password");
    }

    if (user.status === UserStatus.BLOCKED) {
      throw new ForbiddenError("Account is blocked");
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedError("Invalid email or password");
    }

    const token = this.generateToken(user);

    const { password: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
  }

  async getUserById(
    requesterId: string,
    requesterRole: UserRole,
    targetId: string
  ): Promise<User> {
    if (requesterRole !== UserRole.ADMIN && requesterId !== targetId) {
      throw new ForbiddenError("You can only view your own profile");
    }

    const user = await this.userRepository.findById(targetId);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    return user;
  }

  async getAllUsers(requesterRole: UserRole): Promise<User[]> {
    if (requesterRole !== UserRole.ADMIN) {
      throw new ForbiddenError("Only admins can view all users");
    }

    return this.userRepository.findAll();
  }

  async toggleBlock(
    requesterId: string,
    requesterRole: UserRole,
    targetId: string
  ): Promise<User> {
    if (requesterRole !== UserRole.ADMIN && requesterId !== targetId) {
      throw new ForbiddenError("You can only block/unblock your own account");
    }

    const user = await this.userRepository.findById(targetId);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    const newStatus =
      user.status === UserStatus.ACTIVE ? UserStatus.BLOCKED : UserStatus.ACTIVE;

    const updated = await this.userRepository.update(targetId, { status: newStatus });
    return updated!;
  }

  private generateToken(user: User): string {
    const secret = process.env.JWT_SECRET || "fallback-secret";
    const expiresIn = process.env.JWT_EXPIRES_IN || "24h";

    return jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      secret,
      { expiresIn } as jwt.SignOptions
    );
  }
}
