import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CallCourier } from "./entities/call-courier.entity";
import { CreateCallCourierDto } from "./dto/create-call-courier.dto";
import { UpdateCallCourierDto } from "./dto/update-call-courier.dto";

@Injectable()
export class CallCourierService {
  constructor(
    @InjectRepository(CallCourier)
    private readonly callCourierRepository: Repository<CallCourier>
  ) {}

  async create(
    createCallCourierDto: CreateCallCourierDto
  ): Promise<CallCourier> {
    const newCall = this.callCourierRepository.create(createCallCourierDto);
    return await this.callCourierRepository.save(newCall);
  }

  async findAll(): Promise<CallCourier[]> {
    return await this.callCourierRepository.find();
  }

  async findOne(id: string): Promise<CallCourier> {
    const call = await this.callCourierRepository.findOne({ where: { id } });
    if (!call) {
      throw new NotFoundException(`Call courier with ID ${id} not found`);
    }
    return call;
  }

  async update(
    id: string,
    updateCallCourierDto: UpdateCallCourierDto
  ): Promise<CallCourier> {
    const call = await this.findOne(id);

    // Update the call with new data
    Object.assign(call, updateCallCourierDto);

    return await this.callCourierRepository.save(call);
  }

  async remove(id: string): Promise<void> {
    const result = await this.callCourierRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Call courier with ID ${id} not found`);
    }
  }

  async checkUidUnique(id: string): Promise<boolean> {
    const count = await this.callCourierRepository.count({ where: { id } });
    return count === 0;
  }
}
