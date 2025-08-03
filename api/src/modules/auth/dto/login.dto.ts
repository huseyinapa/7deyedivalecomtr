import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class LoginDto {
  @ApiProperty({ description: "User email", example: "john@example.com" })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ description: "User password", example: "securePassword123" })
  @IsNotEmpty()
  @IsString()
  password: string;
}
