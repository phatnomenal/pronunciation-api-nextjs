import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AppConfigService } from './config/config.service';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  const configService = app.get(AppConfigService);
  
  // Validate configuration
  configService.validateConfig();
  
  // CORS
  app.enableCors({
    origin: configService.corsOrigins,
    credentials: true,
  });
  
  // Global prefix
  app.setGlobalPrefix('api');
  
  // Validation
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));
  
  // Filters and Interceptors
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new LoggingInterceptor());
  
  // Swagger Documentation
  const config = new DocumentBuilder()
    .setTitle('Pronunciation Trainer API')
    .setDescription('Cloud-based pronunciation analysis using OpenAI APIs')
    .setVersion('2.0.0')
    .addTag('pronunciation')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  
  const port = configService.port;
  await app.listen(port);
  
  console.log('');
  console.log('═══════════════════════════════════════════════════════');
  console.log('🚀 Pronunciation Trainer API');
  console.log('═══════════════════════════════════════════════════════');
  console.log(`📍 Server:        http://localhost:${port}`);
  console.log(`📚 Documentation: http://localhost:${port}/docs`);
  console.log(`🏥 Health Check:  http://localhost:${port}/api/health`);
  console.log(`🌍 Environment:   ${configService.nodeEnv}`);
  console.log('═══════════════════════════════════════════════════════');
  console.log('');
}

bootstrap();