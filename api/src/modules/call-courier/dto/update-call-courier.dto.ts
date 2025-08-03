import { PartialType } from "@nestjs/swagger";
import { CreateCallCourierDto } from "./create-call-courier.dto";
import { IsOptional, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateCallCourierDto extends PartialType(CreateCallCourierDto) {
  @ApiProperty({ description: "Call status", required: false })
  @IsOptional()
  @IsString()
  status?: string;
}
