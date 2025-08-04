import { ExecutionContext, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { APP_GUARD, APP_FILTER, APP_INTERCEPTOR } from "@nestjs/core";
import { AuthModule } from "./modules/auth/auth.module";
import { UsersModule } from "./modules/users/users.module";
import { AdminModule } from "./modules/admin/admin.module";
import { HealthModule } from "./modules/health/health.module";
import { CourierApplicationModule } from "./modules/courier-application/courier-application.module";
import { CallCourierModule } from "./modules/call-courier/call-courier.module";
import { CourierServiceModule } from "./modules/courier-service/courier-service.module";
import { JwtAuthGuard } from "./modules/auth/guards/jwt-auth.guard";
import { GlobalExceptionFilter } from "./common/filters/global-exception.filter";
import { TransformInterceptor } from "./common/interceptors/transform.interceptor";
import { SecurityInterceptor } from "./common/interceptors/security.interceptor";
import { DatabaseModule } from "./database/database.module";
import { DatabaseService } from "./database/database.service";
import databaseConfig from "./config/database.config";
import jwtConfig from "./config/jwt.config";
import appConfig from "./config/app.config";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { Request } from "express";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
      load: [databaseConfig, jwtConfig, appConfig],
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        generateKey: (context: ExecutionContext, methodName: string) => {
          const request = context.switchToHttp().getRequest<Request>();
          const ip = request.ip as string;
          const userId =
            (request.user as { id: string } | undefined)?.id ?? "guest";
          const route = (request.route as { path: string })?.path ?? "unknown";
          return `throttle:${userId}:${route}:${methodName}:${ip}`;
        },
        throttlers: [
          {
            ttl: 60000, // 60 seconds
            limit: 50, // 50 requests per minute (more reasonable)
          },
        ],
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule, DatabaseModule],
      inject: [DatabaseService],
      useFactory: (databaseService: DatabaseService) =>
        databaseService.getTypeOrmConfig(),
    }),
    AuthModule,
    UsersModule,
    AdminModule,
    HealthModule,
    CourierApplicationModule,
    CallCourierModule,
    CourierServiceModule,
    DatabaseModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: SecurityInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
  ],
})
export class AppModule {}
