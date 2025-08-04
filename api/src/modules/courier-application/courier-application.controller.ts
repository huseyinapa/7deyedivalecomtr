import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  Query,
  UseGuards,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from "@nestjs/swagger";
import { Throttle } from "@nestjs/throttler";
import { CourierApplicationService } from "./courier-application.service";
import { CreateCourierApplicationDto } from "./dto/create-courier-application.dto";
import { UpdateCourierApplicationDto } from "./dto/update-courier-application.dto";
import { CourierApplication } from "./entities/courier-application.entity";
import { Public } from "../auth/decorators/public.decorator";
import { EmailRateLimitGuard } from "../../common/guards/email-rate-limit.guard";

@ApiTags("courier-application")
@Controller("courier-application")
export class CourierApplicationController {
  constructor(
    private readonly courierApplicationService: CourierApplicationService
  ) {}

  @Post()
  @Public()
  @UseGuards(EmailRateLimitGuard)
  @ApiOperation({ summary: "Create a new courier application" })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "Application has been successfully created",
    type: CourierApplication,
  })
  async create(
    @Body() createCourierApplicationDto: CreateCourierApplicationDto
  ): Promise<CourierApplication> {
    return await this.courierApplicationService.create(
      createCourierApplicationDto
    );
  }

  @Get("check-uid")
  @ApiOperation({
    summary: "Check if a UID is unique for courier applications",
  })
  @ApiQuery({
    name: "uid",
    required: true,
    description: "The UID to check for uniqueness",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Returns whether the UID is unique",
    type: Boolean,
  })
  async checkUid(@Query("uid") uid: string): Promise<{ isUnique: boolean }> {
    const isUnique = await this.courierApplicationService.checkUidUnique(uid);
    return { isUnique };
  }

  @Get()
  @ApiOperation({ summary: "Get all courier applications" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Return all applications",
    type: [CourierApplication],
  })
  async findAll(): Promise<CourierApplication[]> {
    return await this.courierApplicationService.findAll();
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a courier application by id" })
  @ApiParam({
    name: "id",
    required: true,
    description: "The ID of the courier application",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Return the application",
    type: CourierApplication,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Application not found",
  })
  async findOne(@Param("id") id: string): Promise<CourierApplication> {
    return await this.courierApplicationService.findOne(id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update a courier application" })
  @ApiParam({
    name: "id",
    required: true,
    description: "The ID of the courier application to update",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Application has been successfully updated",
    type: CourierApplication,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Application not found",
  })
  async update(
    @Param("id") id: string,
    @Body() updateCourierApplicationDto: UpdateCourierApplicationDto
  ): Promise<CourierApplication> {
    return await this.courierApplicationService.update(
      id,
      updateCourierApplicationDto
    );
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete a courier application" })
  @ApiParam({
    name: "id",
    required: true,
    description: "The ID of the courier application to delete",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Application has been successfully deleted",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Application not found",
  })
  async remove(@Param("id") id: string): Promise<void> {
    return await this.courierApplicationService.remove(id);
  }
}
