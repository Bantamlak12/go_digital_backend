import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import * as session from 'express-session';
import * as passport from 'passport';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Create Redis client
  // const RedisClient = Redis.createClient({
  //   url: 'redis://localhost:6379',
  // });

  // // Connect to Redis
  // await RedisClient.connect();

  // // Configure Redis session store
  // const RedisStore = connectRedis(session);

  // Configuring session middleware with Redis store
  app.use(
    session({
      secret: process.env.SESSION_KEY,
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === 'production' ? true : false,
        maxAge: 24 * 60 * 60 * 1000,
      },
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());

  // Set Global validation pipeline
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Go Digital Backend')
    .setDescription(
      'These APIs are documented very well to help frontend developers during integration.',
    )
    .setVersion('1.0')
    .addTag('Go Digital Backend APIs')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
