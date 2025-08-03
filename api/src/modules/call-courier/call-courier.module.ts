import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CallCourierController } from "./call-courier.controller";
import { CallCourierService } from "./call-courier.service";
import { CallCourier } from "./entities/call-courier.entity";

@Module({
  imports: [TypeOrmModule.forFeature([CallCourier])],
  controllers: [CallCourierController],
  providers: [CallCourierService],
  exports: [CallCourierService],
})
export class CallCourierModule {}
