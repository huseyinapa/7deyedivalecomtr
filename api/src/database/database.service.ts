import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";

@Injectable()
export class DatabaseService {
  private readonly logger = new Logger(DatabaseService.name);

  constructor(private configService: ConfigService) {}

  /**
   * Get TypeORM configuration options
   */
  getTypeOrmConfig(): TypeOrmModuleOptions {
    const config = {
      type: "postgres",
      host: this.configService.get<string>("database.host"),
      port: this.configService.get<number>("database.port"),
      username: this.configService.get<string>("database.username"),
      password: this.configService.get<string>("database.password"),
      database: this.configService.get<string>("database.database"),
      schema: this.configService.get<string>("database.schema"),
      entities: this.configService.get<string[]>("database.entities"),
      synchronize: this.configService.get<boolean>("database.synchronize"),
      migrations: this.configService.get<string[]>("database.migrations"),
      logging: this.configService.get<boolean>("database.logging"),
      autoLoadEntities: true,
      ssl: false,
      extra: {
        max: 20,
        connectionTimeoutMillis: 0,
        idleTimeoutMillis: 0,
      },
    } as TypeOrmModuleOptions;

    return config;
  }

  /**
   * Log database configuration (excluding sensitive data)
   */
  logConfig(): void {
    const config = this.getTypeOrmConfig();
    const dbConfig = config as any; // Type assertion for logging purposes

    this.logger.log(
      `Database connection to: ${dbConfig.host}:${dbConfig.port}/${dbConfig.database}`
    );
    this.logger.log(`Schema: ${dbConfig.schema}`);
    this.logger.log(`Synchronize: ${dbConfig.synchronize}`);
    this.logger.log(`Auto Load Entities: ${config.autoLoadEntities}`);
  }
}
