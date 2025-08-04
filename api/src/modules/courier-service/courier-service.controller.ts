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
import { CourierServiceService } from "./courier-service.service";
import { CreateCourierServiceDto } from "./dto/create-courier-service.dto";
import { UpdateCourierServiceDto } from "./dto/update-courier-service.dto";
import { CourierService } from "./entities/courier-service.entity";
import { Public } from "../auth/decorators/public.decorator";

@ApiTags("courier-service")
@Controller("courier-service")
export class CourierServiceController {
  constructor(private readonly courierServiceService: CourierServiceService) {}

  @Post()
  @Public()
  @Throttle({ default: { limit: 5, ttl: 300000 } }) // 5 requests per 5 minutes
  @ApiOperation({ summary: "Create a new courier service" })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "Service has been successfully created",
    type: CourierService,
  })
  async create(
    @Body() createCourierServiceDto: CreateCourierServiceDto
  ): Promise<CourierService> {
    return await this.courierServiceService.create(createCourierServiceDto);
  }

  @Get()
  @ApiOperation({ summary: "Get all courier services" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Return all services",
    type: [CourierService],
  })
  async findAll(): Promise<CourierService[]> {
    return await this.courierServiceService.findAll();
  }

  @Get("check-uid")
  @ApiOperation({
    summary: "Check if a UID is unique in the courier service table",
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
    const isUnique = await this.courierServiceService.checkUidUnique(uid);
    return { isUnique };
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a courier service by id" })
  @ApiParam({
    name: "id",
    required: true,
    description: "The ID of the courier service",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Return the service",
    type: CourierService,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Service not found",
  })
  async findOne(@Param("id") id: string): Promise<CourierService> {
    return await this.courierServiceService.findOne(id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update a courier service" })
  @ApiParam({
    name: "id",
    required: true,
    description: "The ID of the courier service to update",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Service has been successfully updated",
    type: CourierService,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Service not found",
  })
  async update(
    @Param("id") id: string,
    @Body() updateCourierServiceDto: UpdateCourierServiceDto
  ): Promise<CourierService> {
    return await this.courierServiceService.update(id, updateCourierServiceDto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete a courier service" })
  @ApiParam({
    name: "id",
    required: true,
    description: "The ID of the courier service to delete",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Service has been successfully deleted",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Service not found",
  })
  async remove(@Param("id") id: string): Promise<void> {
    return await this.courierServiceService.remove(id);
  }
}
