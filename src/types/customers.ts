export interface CustomerAttributes {
  id: number;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address: string;
  createdBy: number;
  updatedBy?: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface CustomerCreateAttributes
  extends Omit<CustomerAttributes, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'> {}

export interface CustomerUpdateAttributes
  extends Partial<Omit<CustomerAttributes, 'id'>> {}
