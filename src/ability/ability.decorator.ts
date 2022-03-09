import { SetMetadata } from "@nestjs/common";
import { Action, Subjects } from "./ability.factory";

export const CHECK_ABILITIES = 'check_abilitiy';

export interface RequiredRole {
  action: Action;
  subject: Subjects;
}

export const CheckAbilities = (...requirements: RequiredRole[]) => SetMetadata(CHECK_ABILITIES, requirements);