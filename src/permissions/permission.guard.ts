import { ForbiddenError } from '@casl/ability';
import { CanActivate, ExecutionContext, ForbiddenException, mixin, Type } from '@nestjs/common';
import { AbilityFactory, Action } from 'src/ability/ability.factory';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { Books } from 'src/users/entities/books.entity';
import Permission from './permission.enum';

const PermissionGuard = (permission: Action, subject: any): Type<CanActivate> => {
  class PermissionGuardMixin extends JwtAuthGuard {
    // constructor(private canAbilityFactory: AbilityFactory) {
    //   super()
    // }
    async canActivate(context: ExecutionContext) {
      await super.canActivate(context);

      
      const request = context.switchToHttp().getRequest();
      // console.log(request.user);
      const user = request.user;
      const abili = new AbilityFactory()   
      const ability = abili.defineAbilityFor(user);
      // const isAllowed = ability.can(permission, subject)
      // console.log(isAllowed);
      
      
      try {
        ForbiddenError.from(ability).throwUnlessCan(permission, subject);
        return true;
      } catch (error) {
        if (error instanceof ForbiddenError) {
          throw new ForbiddenException(error.message);
        }
      }
      // return user?.permission === permission;
    }
  }

  return mixin(PermissionGuardMixin);
};

export default PermissionGuard;