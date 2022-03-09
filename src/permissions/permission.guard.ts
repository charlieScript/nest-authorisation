import { CanActivate, ExecutionContext, mixin, Type } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import Permission from './permission.enum';

const PermissionGuard = (permission: Permission): Type<CanActivate> => {
  class PermissionGuardMixin extends JwtAuthGuard {
    async canActivate(context: ExecutionContext) {
      await super.canActivate(context);

      const request = context.switchToHttp().getRequest();
      // console.log(request.user);
      const user = request.user;

      return user?.permission === permission;
    }
  }

  return mixin(PermissionGuardMixin);
};

export default PermissionGuard;