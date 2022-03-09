import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { RolesGuard } from './users/roles.guards';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AbilityModule } from './ability/ability.module';

@Module({
  imports: [UsersModule, AuthModule, AbilityModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
