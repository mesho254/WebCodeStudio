import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();  // For frontend

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('WebCodeStudio API')
    .setDescription('The WebCodeStudio API documentation')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(5000);  // Change to 5000 for consistency
}
bootstrap();