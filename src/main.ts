import { NestFactory } from '@nestjs/core';
import * as helmet from 'helmet';
import compression from 'fastify-compress';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';

async function bootstrap() {
  try {
    const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());
    
    app.use(helmet());
    app.register(compression, { encodings: ['gzip', 'deflate'] });
    app.enableCors({ allowedHeaders: "*", origin: "*" });

    await app.listen(process.env.PORT || 8080, '0.0.0.0');
  } catch (err) {
    console.log(err);
  }
}

bootstrap();