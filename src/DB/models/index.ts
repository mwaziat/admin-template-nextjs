import Roles from "./roles";
import Users from "./users";
import UsersRoles from "./usersroles";


Roles.associate();
Users.associate();
UsersRoles.associate();;

export {
  Roles,
  Users,
  UsersRoles,
}