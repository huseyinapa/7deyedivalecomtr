import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  Min,
  IsEmail,
  IsUUID,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateCourierServiceDto {
  @ApiProperty({ description: "Company name" })
  @IsNotEmpty()
  @IsString()
  companyName: string;

  @ApiProperty({ description: "Contact person name" })
  @IsNotEmpty()
  @IsString()
  contactName: string;

  @ApiProperty({ description: "Contact email" })
  @IsNotEmpty()
  @IsEmail()
  contactEmail: string;

  @ApiProperty({ description: "Contact phone number" })
  @IsNotEmpty()
  @IsString()
  contactPhone: string;

  @ApiProperty({ description: "Business sector", required: false })
  @IsOptional()
  @IsString()
  sector?: string;

  @ApiProperty({ description: "Number of branches", required: false })
  @IsOptional()
  @IsNumber()
  @Min(1)
  branchCount?: number;

  @ApiProperty({ description: "Requested start date", required: false })
  @IsOptional()
  @IsString()
  startDate?: string;

  @ApiProperty({
    description: "Type of courier service needed",
    required: false,
  })
  @IsOptional()
  @IsString()
  courierType?: string;

  @ApiProperty({ description: "Number of couriers needed", required: false })
  @IsOptional()
  @IsNumber()
  @Min(1)
  courierCount?: number;

  @ApiProperty({ description: "Service city" })
  @IsNotEmpty()
  @IsString()
  city: string;

  @ApiProperty({ description: "Service district" })
  @IsNotEmpty()
  @IsString()
  district: string;

  @ApiProperty({ description: "Company address", required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ description: "Additional notes", required: false })
  @IsOptional()
  @IsString()
  additionalNotes?: string;

  @ApiProperty({ description: "Unique identifier", required: false })
  @IsOptional()
  @IsUUID()
  uid?: string;
}
