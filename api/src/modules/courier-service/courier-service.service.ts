import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CourierService as CourierServiceEntity } from "./entities/courier-service.entity";
import { CreateCourierServiceDto } from "./dto/create-courier-service.dto";
import { UpdateCourierServiceDto } from "./dto/update-courier-service.dto";

@Injectable()
export class CourierServiceService {
  constructor(
    @InjectRepository(CourierServiceEntity)
    private readonly courierServiceRepository: Repository<CourierServiceEntity>
  ) {}

  async create(
    createCourierServiceDto: CreateCourierServiceDto
  ): Promise<CourierServiceEntity> {
    const newService = this.courierServiceRepository.create(
      createCourierServiceDto
    );
    return await this.courierServiceRepository.save(newService);
  }

  async findAll(): Promise<CourierServiceEntity[]> {
    return await this.courierServiceRepository.find({
      order: { createdAt: "DESC" },
    });
  }

  async findOne(id: string): Promise<CourierServiceEntity> {
    const service = await this.courierServiceRepository.findOne({
      where: { id },
    });

    if (!service) {
      throw new NotFoundException(`Courier service with ID ${id} not found`);
    }

    return service;
  }

  async update(
    id: string,
    updateCourierServiceDto: UpdateCourierServiceDto
  ): Promise<CourierServiceEntity> {
    const service = await this.findOne(id);

    // Update the service with new data
    Object.assign(service, updateCourierServiceDto);

    return await this.courierServiceRepository.save(service);
  }

  async remove(id: string): Promise<void> {
    const result = await this.courierServiceRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Courier service with ID ${id} not found`);
    }
  }

  async checkUidUnique(id: string): Promise<boolean> {
    const count = await this.courierServiceRepository.count({ where: { id } });
    return count === 0;
  }
}
