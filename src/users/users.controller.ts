import { Controller, Get, Post, Body, Patch, Param, Delete, SetMetadata, UseGuards, Request, ForbiddenException, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from './entities/role.enum';
import { Roles } from './role.decorator';
import { LocalAuthGuard } from 'src/auth/local-auth.guard';
import { AuthenticatedGuard } from '../auth/authenticated.guard';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { RolesGuard } from './roles.guards';
import { User } from './entities/user.entity';
import { AbilityFactory, Action, AppAbility } from 'src/ability/ability.factory';
import { ForbiddenError } from '@casl/ability';
import { CheckAbilities } from 'src/ability/ability.decorator';
import { AbilitiesGuard } from 'src/ability/abilities.guard';
import { PoliciesGuard } from 'src/ability/policy/policy.guard';
import { CheckPolicies } from 'src/ability/policy/policy.decorator';
import { Books } from './entities/books.entity';
import PermissionGuard from 'src/permissions/permission.guard';
import Permission from 'src/permissions/permission.enum';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService, private readonly authService: AuthService, private abilityFactory: AbilityFactory) { }

  @UseGuards(RolesGuard(Role.ADMIN))
  @Post()
  async create(@Body() createUserDto: User, @Request() req) {
    // const ability = this.abilityFactory.defineAbilityFor(req.user)

    // const isAllowed = ability.can(Action.Create, User)
    // if (!isAllowed) {
    //   throw new ForbiddenException()
    // }
    
    return await this.usersService.create(createUserDto, req.user);
    // try {
    //   return this.usersService.create(createUserDto, req.user);
    // } catch (error) {
    //   if (error instanceof ForbiddenError) {
    //     throw new ForbiddenException()
    //   }
    // }

  }

  // @UseGuards(JwtAuthGuard)
  @UseGuards(RolesGuard(Role.ADMIN))
  @Get('/books')
  async getBooks(@Request() req) {
    console.log(req.user);
    const ability = this.abilityFactory.defineAbilityFor(req.user)
    const isAllowed = ability.can(Action.Delete, Books);
    if(isAllowed) {
      throw new ForbiddenException()
    }
    return this.usersService.findBooks()
  }

  // @UseGuards(RolesGuard(Role.ADMIN))
  @UseGuards(PermissionGuard(Action.Read, Books))
  @Get('/test')
  test(@Request() req) {
    // console.log(req.user);
    return 'working'
  }

  // @UseGuards(RolesGuard(Role.ADMIN))
  @Get()
  findAll(@Request() req) {
    return this.usersService.findAll();
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  // @Roles(Role.ADMIN)
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(RolesGuard(Role.ADMIN))
  @Patch('')
  async update(@Body() updateUserDto: User, @Request() req) {
    const user = await this.usersService.findOne(updateUserDto.username)
    const ability = this.abilityFactory.defineAbilityFor(req.user)
    try {
      ForbiddenError.from(ability).throwUnlessCan(Action.Update, user);
      return this.usersService.update(updateUserDto);
    } catch (error) {
      if (error instanceof ForbiddenError) {
        throw new ForbiddenException(error.message);
      }
    }
    return this.usersService.update(updateUserDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  // @UseGuards(AbilitiesGuard)
  // @CheckAbilities({ action: Action.Delete, subject: User })
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, User))
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
