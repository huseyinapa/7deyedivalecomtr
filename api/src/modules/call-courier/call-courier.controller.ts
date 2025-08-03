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
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from "@nestjs/swagger";
import { CallCourierService } from "./call-courier.service";
import { CreateCallCourierDto } from "./dto/create-call-courier.dto";
import { UpdateCallCourierDto } from "./dto/update-call-courier.dto";
import { CallCourier } from "./entities/call-courier.entity";
import { Public } from "../auth/decorators/public.decorator";

@ApiTags("call-courier")
@Controller("call-courier")
export class CallCourierController {
  constructor(private readonly callCourierService: CallCourierService) {}

  @Post()
  @Public()
  @ApiOperation({ summary: "Create a new courier call request" })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "Call request has been successfully created",
    type: CallCourier,
  })
  async create(
    @Body() createCallCourierDto: CreateCallCourierDto
  ): Promise<CallCourier> {
    return await this.callCourierService.create(createCallCourierDto);
  }

  @Get()
  @ApiOperation({ summary: "Get all courier call requests" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Return all call requests",
    type: [CallCourier],
  })
  async findAll(): Promise<CallCourier[]> {
    return await this.callCourierService.findAll();
  }

  @Get("check-uid")
  @ApiOperation({
    summary: "Check if a UID is unique in the call courier table",
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
    const isUnique = await this.callCourierService.checkUidUnique(uid);
    return { isUnique };
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a courier call request by id" })
  @ApiParam({
    name: "id",
    required: true,
    description: "The ID of the courier call",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Return the call request",
    type: CallCourier,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Call request not found",
  })
  async findOne(@Param("id") id: string): Promise<CallCourier> {
    return await this.callCourierService.findOne(id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update a courier call request" })
  @ApiParam({
    name: "id",
    required: true,
    description: "The ID of the courier call to update",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Call request has been successfully updated",
    type: CallCourier,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Call request not found",
  })
  async update(
    @Param("id") id: string,
    @Body() updateCallCourierDto: UpdateCallCourierDto
  ): Promise<CallCourier> {
    return await this.callCourierService.update(id, updateCallCourierDto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete a courier call request" })
  @ApiParam({
    name: "id",
    required: true,
    description: "The ID of the courier call to delete",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Call request has been successfully deleted",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Call request not found",
  })
  async remove(@Param("id") id: string): Promise<void> {
    return await this.callCourierService.remove(id);
  }
}
