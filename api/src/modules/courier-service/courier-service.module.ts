import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CourierServiceController } from "./courier-service.controller";
import { CourierServiceService } from "./courier-service.service";
import { CourierService } from "./entities/courier-service.entity";

@Module({
  imports: [TypeOrmModule.forFeature([CourierService])],
  controllers: [CourierServiceController],
  providers: [CourierServiceService],
  exports: [CourierServiceService],
})
export class CourierServiceModule {}
