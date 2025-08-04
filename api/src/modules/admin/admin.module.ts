import { Module } from "@nestjs/common";
import { AdminController } from "./admin.controller";
import { AuthModule } from "../auth/auth.module";
import { CourierApplicationModule } from "../courier-application/courier-application.module";

@Module({
  imports: [AuthModule, CourierApplicationModule],
  controllers: [AdminController],
})
export class AdminModule {}
