import Permission from "src/permissions/permission.enum";

export class User {
  id: number;
  username: string;
  password: string;
  roles: string[];
  bio: string;
  isAdmin: boolean;
  orgId: number;
  permission: Permission
}




