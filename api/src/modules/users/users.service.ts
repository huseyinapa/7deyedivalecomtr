import {
  Injectable,
  NotFoundException,
  ConflictException,
} from "@nestjs/common";
import { User } from "./entities/user.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

@Injectable()
export class UsersService {
  private users: User[] = [];
  private idCounter = 1;

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { email } = createUserDto;

    // Check if user already exists
    const existingUser = this.users.find((user) => user.email === email);
    if (existingUser) {
      throw new ConflictException("Email already exists");
    }

    // Create new user
    const user = {
      id: this.idCounter++,
      ...createUserDto,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as User;

    this.users.push(user);
    return user;
  }

  async findAll(): Promise<User[]> {
    return this.users;
  }

  async findOne(id: number): Promise<User> {
    const user = this.users.find((user) => user.id === id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = this.users.find((user) => user.email === email);
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    // Update user properties
    Object.assign(user, {
      ...updateUserDto,
      updatedAt: new Date(),
    });

    return user;
  }

  async remove(id: number): Promise<void> {
    const userIndex = this.users.findIndex((user) => user.id === id);
    if (userIndex === -1) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    this.users.splice(userIndex, 1);
  }
}
