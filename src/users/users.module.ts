import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { AbilityModule } from 'src/ability/ability.module';

@Module({
  providers: [UsersService],
  exports: [UsersService],
  imports: [AuthModule, AbilityModule],
  controllers: [UsersController],
})
export class UsersModule { }
