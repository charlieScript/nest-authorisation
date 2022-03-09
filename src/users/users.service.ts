import { ForbiddenError } from '@casl/ability';
import { BadRequestException, Injectable } from '@nestjs/common';
import { AbilityFactory, Action } from 'src/ability/ability.factory';
import Permission from 'src/permissions/permission.enum';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Books } from './entities/books.entity';
import { Role } from './entities/role.enum';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(private abilityFactory: AbilityFactory) { }

  users: User[] = [
    {
      id: 1,
      username: 'charles',
      password: 'chigozie',
      roles: ["admin"],
      bio: "admin bro",
      isAdmin: true,
      orgId: 1,
      permission: Permission.ReadBook
    },
    {
      id: 2,
      username: 'maria',
      password: 'guess',
      roles: ["user"],
      bio: "user bro",
      isAdmin: false,
      orgId: 2,
      permission: Permission.CreateBook
    },
    {
      id: 3,
      username: 'test',
      password: 'test',
      roles: ["user"],
      bio: "user bro",
      isAdmin: false,
      orgId: 1,
      permission: Permission.CreateBook
    },
  ];

  books: Books[] = [
    {
      name: 'w',
      author: 'a'
    },
    {
      name: 'w',
      author: 'a'
    },
  ];

  async findOne(username: string): Promise<User | undefined> {
    return this.users.find(user => user.username === username);
  }

  async create(createUserDto: User, currentUser: User) {
    const ability = this.abilityFactory.defineAbilityFor(currentUser);
    ForbiddenError.from(ability).throwUnlessCan(Action.Create, User);
    this.users.push(createUserDto);
    return this.users;
  }

  findAll() {
    return this.users;
  }

  findBooks() {
    return this.books;
  }

  async update(user: User) {
    if (user.username !== '') {
      user.bio = user.bio;
      return user;
    }

    throw new BadRequestException();
  }

  remove(username: string): any {
    this.users = this.users.filter(i => i.username !== username);
    return this.users;
  }
}
