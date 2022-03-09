import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from 'passport-jwt'
import { UsersService } from "src/users/users.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  
  constructor(private usersService: UsersService) {
    super({
      secretOrKey: 'hey',
      ignoreExpiration: false,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
    })
  }

  async validate(payload: any) {
    const user = await this.usersService.findOne(payload.name)
    return {
      username: user.username,
      roles: user.roles,
      permission: user.permission
    }
  }
}