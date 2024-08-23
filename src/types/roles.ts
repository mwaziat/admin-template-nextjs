export interface RoleAttributes {
  id: number;
  name: string;
  description: string;
  createdBy: number;
  updatedBy?: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface RoleCreateAttributes
  extends Omit<RoleAttributes, 'id' | 'created_at' | 'updated_at' | 'deleted_at'> {}

export interface RoleUpdateAttributes
  extends Partial<Omit<RoleAttributes, 'id'>> {}
