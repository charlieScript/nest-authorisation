import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as passport from 'passport';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);


  // app.use(session({
  //   secret: 'secret',
  //   resave: false,
  //   saveUninitialized: true,
  //   cookie: { maxAge: 60000 }
  // }));

  // app.use(passport.initialize());
  // app.use(passport.session());
  const PORT = process.env.PORT || 3000;
  await app.listen(PORT);
}
bootstrap();
