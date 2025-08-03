import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class CreateUserDto {
  @ApiProperty({ description: "User name", example: "John Doe" })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: "User email", example: "john@example.com" })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ description: "User password", example: "securePassword123" })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;
}
