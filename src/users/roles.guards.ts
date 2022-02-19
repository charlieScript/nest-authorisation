// import { Role } from './entities/role.enum';
// import { CanActivate, ExecutionContext, mixin, Type } from '@nestjs/common';

// export const RolesGuard = (role: Role): Type<CanActivate> => {
//   class RoleGuardMixin implements CanActivate {
//     canActivate(context: ExecutionContext) {
//       const request = context.switchToHttp().getRequest();
//       const user = request.user;

//       return user?.roles.includes(role);
//     }
//   }

//   return mixin(RoleGuardMixin);
// };

import { Role } from './entities/role.enum';
import { CanActivate, ExecutionContext, mixin, Type } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';

export const RolesGuard = (role: Role): Type<CanActivate> => {
  class RoleGuardMixin extends JwtAuthGuard {
    async canActivate(context: ExecutionContext) {
      await super.canActivate(context);

      const request = context.switchToHttp().getRequest();
      const user = request.user;

      return user?.roles.includes(role);
    }
  }

  return mixin(RoleGuardMixin);
};
