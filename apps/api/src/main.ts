import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configuredOrigins = (
    process.env.FRONTEND_URL || process.env.CORS_ORIGIN
  )
    ?.split(',')
    .map((origin) => origin.trim().replace(/\/$/, ''))
    .filter(Boolean);

  const allowedOrigins = new Set(
    configuredOrigins?.length
      ? configuredOrigins
      : ['http://localhost:3000', 'http://127.0.0.1:3000'],
  );

  if (process.env.NODE_ENV !== 'production') {
    allowedOrigins.add('http://localhost:3000');
    allowedOrigins.add('http://127.0.0.1:3000');
  }

  app.enableCors({
    origin: Array.from(allowedOrigins),
    credentials: true,
  });

  const port = Number(process.env.PORT) || 3001;
  await app.listen(port, '0.0.0.0');
}
void bootstrap();
