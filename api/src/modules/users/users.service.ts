import {
  Injectable,
  NotFoundException,
  ConflictException,
  OnModuleInit,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as bcrypt from "bcrypt";
import { User } from "./entities/user.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async onModuleInit() {
    await this.seedDefaultUsers();
  }

  private async seedDefaultUsers() {
    // Check if admin user already exists
    const existingAdmin = await this.userRepository.findOne({
      where: { email: "dev@gmail.com" }, // Updated to match your login
    });

    if (existingAdmin) {
      // Update existing user to admin if not already
      if (existingAdmin.role !== "admin") {
        existingAdmin.role = "admin";
        await this.userRepository.save(existingAdmin);
        console.log(`✅ Updated ${existingAdmin.email} to admin role`);
      }
      console.log(
        `✅ Admin user already exists: ${existingAdmin.email} with ID: ${existingAdmin.id}`
      );
      return;
    }

    // Add default admin user to database
    const adminPassword = await bcrypt.hash("123456789", 10); // Simple password
    const adminUser = this.userRepository.create({
      name: "Dev Admin",
      email: "dev@gmail.com",
      password: adminPassword,
      role: "admin",
      isActive: true,
    });

    const savedAdmin = await this.userRepository.save(adminUser);
    console.log(
      `✅ Admin user seeded to database: ${savedAdmin.email} with ID: ${savedAdmin.id}`
    );

    const totalUsers = await this.userRepository.count();
    console.log(`📊 Total users in database: ${totalUsers}`);
  }

  async create(
    createUserDto: CreateUserDto,
    createdBy?: string
  ): Promise<User> {
    const { email, password, role = "user" } = createUserDto;

    // Security: Ensure role is always set to 'user' or 'admin' only
    const allowedRoles = ["user", "admin"];
    const safeRole = allowedRoles.includes(role) ? role : "user";

    // Check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new ConflictException("Email already exists");
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
      role: safeRole,
      isActive: true,
      createdBy: createdBy || "system", // Default to 'system' if no creator specified
    });

    const savedUser = await this.userRepository.save(user);
    console.log(
      `👤 New user created: ${savedUser.email} with role: ${savedUser.role} by: ${savedUser.createdBy}`
    );

    return savedUser;
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    console.log(`🔍 Looking for user with email: ${email}`);

    const user = await this.userRepository.findOne({
      where: { email },
    });
    if (!user) {
      console.log(`❌ User not found: ${email}`);
      throw new NotFoundException(`User with email ${email} not found`);
    }

    console.log(`✅ User found: ${user.email} with ID: ${user.id}`);
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    // If password is being updated, hash it
    if (updateUserDto.password) {
      const saltRounds = 10;
      updateUserDto.password = await bcrypt.hash(
        updateUserDto.password,
        saltRounds
      );
      console.log(`🔐 Password updated for user: ${user.email}`);
    }

    // Update user properties
    Object.assign(user, updateUserDto);

    return await this.userRepository.save(user);
  }

  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);

    // Prevent deletion of the main admin user
    if (user.email === "dev@gmail.com") {
      throw new ConflictException("Cannot delete the main admin user");
    }

    console.log(`🗑️ User deleted: ${user.email}`);
    await this.userRepository.remove(user);
  }
}
