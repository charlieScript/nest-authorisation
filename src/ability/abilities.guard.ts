import { ForbiddenError } from "@casl/ability";
import { CanActivate, ExecutionContext, ForbiddenException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { CHECK_ABILITIES, RequiredRole } from "./ability.decorator";
import { AbilityFactory } from "./ability.factory";



export class AbilitiesGuard implements CanActivate {
  constructor(private reflector: Reflector, private canAbilityFactory: AbilityFactory) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    
    const rules = this.reflector.get<RequiredRole[]>(CHECK_ABILITIES, context.getHandler());

    const policyHandlers =
      this.reflector.get<RequiredRole[]>(
        CHECK_ABILITIES,
        context.getHandler(),
      ) || [];

    const { user } = context.switchToHttp().getRequest();
    const ability = this.canAbilityFactory.defineAbilityFor(user);

    try {
      rules.forEach(rule => ForbiddenError.from(ability).throwUnlessCan(rule.action, rule.subject));
      return true;
    } catch (error) {
      if (error instanceof ForbiddenError) {
        throw new ForbiddenException(error.message)
      }
    }
  }
}