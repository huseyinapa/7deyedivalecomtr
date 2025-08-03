import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ConfigService } from "@nestjs/config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    })
  );

  // CORS config
  app.enableCors();

  // Swagger API documentation
  const config = new DocumentBuilder()
    .setTitle("Yedi API")
    .setDescription("Yedi Courier API - Kurye ve teslimat hizmetleri için API")
    .setVersion("1.0")
    .addTag("auth", "Kimlik doğrulama işlemleri")
    .addTag("users", "Kullanıcı yönetimi")
    .addTag("courier-application", "Kurye başvuruları")
    .addTag("call-courier", "Kurye çağırma istekleri")
    .addTag("courier-service", "Kurye hizmetleri")
    .addBearerAuth(
      {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        name: "JWT",
        description: "JWT token girin",
        in: "header",
      },
      "access-token"
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/docs", app, document);

  // Start the application
  const port = configService.get<number>("PORT", 3000);
  await app.listen(port);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
