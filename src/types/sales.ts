export interface SalesAttributes {
  id: number;
  userId: number;
  totalAmount: number;
  saleDate: Date;
  createdBy: number;
  updatedBy?: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface SalesCreateAttributes
  extends Omit<SalesAttributes, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'> {}

export interface SalesUpdateAttributes
  extends Partial<Omit<SalesAttributes, 'id' | 'createdBy' | 'createdAt' | 'updatedAt' | 'deletedAt'>> {}
