import { NestFactory } from '@nestjs/core';
import helmet from 'fastify-helmet';
import compression from 'fastify-compress';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { contentParser } from 'fastify-multer';
import { join } from 'path';

async function bootstrap() {
  try {
    const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());

    app.register(compression, { encodings: ['gzip', 'deflate'] });
    app.register(contentParser);
    app.enableCors({ allowedHeaders: "*", origin: "*" });
    app.register(helmet, {
      contentSecurityPolicy: {
        directives: {
          defaultSrc: [`'self'`],
          styleSrc: [`'self'`, `'unsafe-inline'`],
          imgSrc: [`'self'`, 'data:', 'validator.swagger.io'],
          scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
        },
      },
    })

    await app.listen(process.env.PORT, process.env.HOST);
  } catch (err) {
    console.log(err);
  }
}

bootstrap();