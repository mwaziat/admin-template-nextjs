import { RoleAttributes } from "./roles";

export interface UserAttributes {
  id: number;
  firstName: string;
  lastName: string;
  name: string;
  username: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  isActive: boolean;
  createdBy: number;
  updatedBy?: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  roles?: RoleAttributes[];
}

export interface UserCreateAttributes
  extends Omit<UserAttributes, 'id' | 'created_at' | 'updated_at' | 'deleted_at' | 'roles'> {
    roles: number[];
  }

export interface UserUpdateAttributes
  extends Partial<Omit<UserAttributes, 'id'>> {}
