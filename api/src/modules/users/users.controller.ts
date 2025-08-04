import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  HttpCode,
  HttpStatus,
  ConflictException,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { User } from "./entities/user.entity";
import { PaginationDto } from "../../common/dto/pagination.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { CurrentUser } from "../../common/decorators/current-user.decorator";

@ApiTags("users")
@Controller("users")
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles("admin")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Create a new user (Admin only)" })
  @ApiResponse({
    status: 201,
    description: "User created successfully",
    type: User,
  })
  @ApiResponse({ status: 400, description: "Bad request" })
  @ApiResponse({ status: 409, description: "User already exists" })
  @ApiResponse({ status: 403, description: "Admin access required" })
  async create(
    @Body() createUserDto: CreateUserDto,
    @CurrentUser() adminUser: any
  ): Promise<{
    success: boolean;
    message: string;
    data: Partial<User>;
  }> {
    const user = await this.usersService.create(createUserDto, adminUser.email);

    return {
      success: true,
      message: `${createUserDto.role || "user"} created successfully by admin`,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
        createdBy: user.createdBy,
      },
    };
  }

  @Get()
  @Roles("admin")
  @ApiOperation({ summary: "Get all users (Admin only)" })
  @ApiResponse({ status: 200, description: "Return all users", type: [User] })
  @ApiResponse({ status: 403, description: "Admin access required" })
  async findAll(@Query() paginationDto: PaginationDto): Promise<{
    success: boolean;
    data: User[];
    total: number;
  }> {
    const users = await this.usersService.findAll();
    return {
      success: true,
      data: users,
      total: users.length,
    };
  }

  @Get(":id")
  @Roles("admin")
  @ApiOperation({ summary: "Get a user by ID (Admin only)" })
  @ApiParam({ name: "id", description: "User ID" })
  @ApiResponse({ status: 200, description: "Return a user by ID", type: User })
  @ApiResponse({ status: 404, description: "User not found" })
  @ApiResponse({ status: 403, description: "Admin access required" })
  async findOne(@Param("id") id: string): Promise<{
    success: boolean;
    data: User;
  }> {
    const user = await this.usersService.findOne(+id);
    return {
      success: true,
      data: user,
    };
  }

  @Patch(":id")
  @Roles("admin")
  @ApiOperation({ summary: "Update a user (Admin only)" })
  @ApiParam({ name: "id", description: "User ID" })
  @ApiResponse({
    status: 200,
    description: "User updated successfully",
    type: User,
  })
  @ApiResponse({ status: 404, description: "User not found" })
  @ApiResponse({ status: 403, description: "Admin access required" })
  async update(
    @Param("id") id: string,
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() adminUser: any
  ): Promise<{
    success: boolean;
    message: string;
    data: User;
  }> {
    const user = await this.usersService.update(+id, updateUserDto);
    return {
      success: true,
      message: `User ${user.email} updated successfully by admin`,
      data: user,
    };
  }

  @Delete(":id")
  @Roles("admin")
  @ApiOperation({ summary: "Delete a user (Admin only)" })
  @ApiParam({ name: "id", description: "User ID" })
  @ApiResponse({ status: 200, description: "User deleted successfully" })
  @ApiResponse({ status: 404, description: "User not found" })
  @ApiResponse({ status: 403, description: "Admin access required" })
  async remove(
    @Param("id") id: string,
    @CurrentUser() adminUser: any
  ): Promise<{
    success: boolean;
    message: string;
  }> {
    // Prevent admin from deleting themselves
    if (+id === adminUser.id) {
      throw new ConflictException("You cannot delete your own account");
    }

    await this.usersService.remove(+id);
    return {
      success: true,
      message: `User deleted successfully by admin`,
    };
  }
}
