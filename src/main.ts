import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import * as session from 'express-session';
import * as passport from 'passport';
import RedisStore from 'connect-redis';
import { createClient } from 'redis';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Create a Redis client
  const redisClient = createClient();

  // Handle redis connection error
  redisClient.on('error', (err) => {
    console.error('Redis client not connected', err);
    process.exit(1);
  });

  try {
    // Handle Redis connection
    await redisClient.connect(); // Await the connection before using it
    console.log('Redis client conected.');

    redisClient.on('debug', console.log);

    // Configuring session middleware with Redis store
    app.use(
      session({
        store: new RedisStore({
          client: redisClient,
          ttl: 24 * 60 * 60, // ttl need in seconds
        }),
        secret: process.env.SESSION_KEY,
        resave: false,
        saveUninitialized: false,
        cookie: {
          secure: process.env.NODE_ENV === 'production' ? true : false,
          httpOnly: process.env.NODE_ENV === 'production' ? true : false,
          sameSite: 'strict',
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
  } catch (error) {
    console.error('Failed to connect to redis or start the server.', error);
    process.exit(1);
  }
}

bootstrap();
