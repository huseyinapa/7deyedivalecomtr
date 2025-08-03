import { PartialType } from "@nestjs/swagger";
import { CreateCourierApplicationDto } from "./create-courier-application.dto";
import { IsOptional, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateCourierApplicationDto extends PartialType(
  CreateCourierApplicationDto
) {
  @ApiProperty({ description: "Application status", required: false })
  @IsOptional()
  @IsString()
  status?: string;
}
