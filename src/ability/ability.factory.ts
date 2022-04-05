import { Ability, AbilityBuilder, AbilityClass, ExtractSubjectType, InferSubjects } from "@casl/ability";
import { Injectable } from "@nestjs/common";
import { Books } from "src/users/entities/books.entity";
import { User } from "src/users/entities/user.entity";

export enum Action {
  Manage = "manage", // wildcard for any operations
  Read = "read",
  Create = 'create',
  Update = "update",
  Delete = "delete",
}

export type Subjects = InferSubjects<typeof User | typeof Books> | "all";

export type AppAbility = Ability<[Action, Subjects]>;

@Injectable()
export class AbilityFactory {
  defineAbilityFor(user: User) {
    // define roles
    const { can, cannot, build } = new AbilityBuilder(Ability as AbilityClass<AppAbility>);
    
    // can manage all users
    if (user.roles.includes('admin')) {
      can(Action.Read, User);
      // cannot(Action.Manage, User, { orgId: { $ne: user.orgId} }).because('You are not allowed to manage other users');
    } else {
      can(Action.Read, Books);
    }

    return build({
      detectSubjectType: (item) => 
      item.constructor as ExtractSubjectType<Subjects>
    });
  }
}
