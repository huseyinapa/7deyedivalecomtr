import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CourierApplicationController } from "./courier-application.controller";
import { CourierApplicationService } from "./courier-application.service";
import { CourierApplication } from "./entities/courier-application.entity";

@Module({
  imports: [TypeOrmModule.forFeature([CourierApplication])],
  controllers: [CourierApplicationController],
  providers: [CourierApplicationService],
  exports: [CourierApplicationService],
})
export class CourierApplicationModule {}
