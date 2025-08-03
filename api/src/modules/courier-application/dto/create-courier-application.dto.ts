import {
  IsNotEmpty,
  IsEmail,
  IsOptional,
  IsString,
  IsBoolean,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateCourierApplicationDto {
  @ApiProperty({ description: "Application UID", required: false })
  @IsOptional()
  @IsString()
  uid?: string;

  @ApiProperty({ description: "First name" })
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty({ description: "Last name" })
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty({ description: "Email address" })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ description: "Phone number" })
  @IsNotEmpty()
  @IsString()
  phone: string;

  @ApiProperty({ description: "City" })
  @IsNotEmpty()
  @IsString()
  city: string;

  @ApiProperty({ description: "District", required: false })
  @IsOptional()
  @IsString()
  district?: string;

  @ApiProperty({ description: "Address", required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ description: "Birth date", required: false })
  @IsOptional()
  @IsString()
  birthDate?: string;

  @ApiProperty({ description: "Gender", required: false })
  @IsOptional()
  @IsString()
  gender?: string;

  @ApiProperty({ description: "Nationality", required: false })
  @IsOptional()
  @IsString()
  nationality?: string;

  @ApiProperty({ description: "ID Number", required: false })
  @IsOptional()
  @IsString()
  idNumber?: string;

  @ApiProperty({ description: "Marital status", required: false })
  @IsOptional()
  @IsString()
  maritalStatus?: string;

  @ApiProperty({ description: "Military status", required: false })
  @IsOptional()
  @IsString()
  militaryStatus?: string;

  @ApiProperty({ description: "Education level", required: false })
  @IsOptional()
  @IsString()
  education?: string;

  @ApiProperty({ description: "License class", required: false })
  @IsOptional()
  @IsString()
  licenseClass?: string;

  @ApiProperty({ description: "Vehicle type", required: false })
  @IsOptional()
  @IsString()
  vehicleType?: string;

  @ApiProperty({ description: "Work period", required: false })
  @IsOptional()
  @IsString()
  workPeriod?: string;

  @ApiProperty({ description: "Has vehicle", required: false })
  @IsOptional()
  @IsBoolean()
  hasVehicle?: boolean;

  @ApiProperty({ description: "Courier experience", required: false })
  @IsOptional()
  @IsString()
  courierExperience?: string;

  @ApiProperty({ description: "Work experiences", required: false })
  @IsOptional()
  @IsString()
  workExperiences?: string;

  @ApiProperty({ description: "References", required: false })
  @IsOptional()
  @IsString()
  references?: string;

  @ApiProperty({ description: "Additional notes", required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}
