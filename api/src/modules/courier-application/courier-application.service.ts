import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CourierApplication } from "./entities/courier-application.entity";
import { CreateCourierApplicationDto } from "./dto/create-courier-application.dto";
import { UpdateCourierApplicationDto } from "./dto/update-courier-application.dto";

@Injectable()
export class CourierApplicationService {
  constructor(
    @InjectRepository(CourierApplication)
    private readonly courierApplicationRepository: Repository<CourierApplication>
  ) {}

  async create(
    createCourierApplicationDto: CreateCourierApplicationDto
  ): Promise<CourierApplication> {
    const newApplication = this.courierApplicationRepository.create(
      createCourierApplicationDto
    );
    return await this.courierApplicationRepository.save(newApplication);
  }

  async findAll(): Promise<CourierApplication[]> {
    return await this.courierApplicationRepository.find();
  }

  async findOne(id: string): Promise<CourierApplication> {
    const application = await this.courierApplicationRepository.findOne({
      where: { id },
    });
    if (!application) {
      throw new NotFoundException(
        `Courier application with ID ${id} not found`
      );
    }
    return application;
  }

  async update(
    id: string,
    updateCourierApplicationDto: UpdateCourierApplicationDto
  ): Promise<CourierApplication> {
    const application = await this.findOne(id);

    // Update the application with new data
    Object.assign(application, updateCourierApplicationDto);

    return await this.courierApplicationRepository.save(application);
  }

  async remove(id: string): Promise<void> {
    const result = await this.courierApplicationRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(
        `Courier application with ID ${id} not found`
      );
    }
  }

  async checkUidUnique(id: string): Promise<boolean> {
    const count = await this.courierApplicationRepository.count({
      where: { id },
    });
    return count === 0;
  }
}
