export interface SupplierAttributes {
  id: number;
  name: string;
  phone: string;
  email: string;
  address: string;
  createdBy: number;
  updatedBy?: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface SupplierCreateAttributes
  extends Omit<SupplierAttributes, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'> {}

export interface SupplierUpdateAttributes
  extends Partial<Omit<SupplierAttributes, 'id'>> {}
