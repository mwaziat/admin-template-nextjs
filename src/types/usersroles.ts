export interface UsersRoleAttributes {
  id: number;
  userId: number;
  roleId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UsersRoleCreateAttributes
  extends Omit<UsersRoleAttributes, 'id' | 'created_at' | 'updated_at'> {}

export interface UsersRoleUpdateAttributes
  extends Partial<Omit<UsersRoleAttributes, 'id'>> {}
