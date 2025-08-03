import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  Min,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateCallCourierDto {
  @ApiProperty({ description: "Unique identifier" })
  @IsOptional()
  @IsString()
  uid?: string;

  @ApiProperty({ description: "Sender's name" })
  @IsNotEmpty()
  @IsString()
  senderName: string;

  @ApiProperty({ description: "Sender's phone number" })
  @IsNotEmpty()
  @IsString()
  senderPhone: string;

  @ApiProperty({ description: "Sender's address" })
  @IsNotEmpty()
  @IsString()
  senderAddress: string;

  @ApiProperty({ description: "Receiver's name" })
  @IsNotEmpty()
  @IsString()
  receiverName: string;

  @ApiProperty({ description: "Receiver's phone number" })
  @IsNotEmpty()
  @IsString()
  receiverPhone: string;

  @ApiProperty({ description: "Receiver's address" })
  @IsNotEmpty()
  @IsString()
  receiverAddress: string;

  @ApiProperty({ description: "Package description" })
  @IsOptional()
  @IsString()
  packageDescription?: string;

  @ApiProperty({ description: "Package weight in kg" })
  @IsNumber()
  @Min(0)
  packageWeight: number;

  @ApiProperty({ description: "Package value" })
  @IsOptional()
  @IsNumber()
  @Min(0)
  packageValue?: number;

  @ApiProperty({ description: "Additional notes" })
  @IsOptional()
  @IsString()
  notes?: string;
}
