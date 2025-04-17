import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //GLOBAL VALIDATION PIPES
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // ENABLE CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });

  // GLOBAL SERIALIZATION INTERCEPTORS
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  // SWAGGER DOCUMENTATION
  const config = new DocumentBuilder()
    .setTitle('Nestjs Blog App Api Tutorial')
    .setDescription(
      'rhfbejberhberjhkfberjhfberjhbgerhbgrjgbrhge rjlvge rvjhrebgerjh vherervherberhvkefgeufyegoeuhuhfuhrufho3uihf3u4',
    )
    .setTermsOfService('terms-of-service')
    .setLicense('MIT License', 'mit')
    .addServer('http://localhost:3000')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
