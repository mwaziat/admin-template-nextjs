import { CustomerAttributes } from './customers';
import { TransactionItemAttributes, TransactionItemCreateAttributes } from './transaction-items';

export interface TransactionAttributes {
  id: number;
  transactionDate: Date;
  totalAmount: number;
  customerId: number;
  createdBy: number;
  updatedBy?: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  customer?: CustomerAttributes;
  items?: TransactionItemAttributes[];
}

export interface TransactionCreateAttributes
  extends Omit<TransactionAttributes, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'customer' | 'items'> {
  items: TransactionItemCreateAttributes[];
}

export interface TransactionUpdateAttributes
  extends Partial<Omit<TransactionAttributes, 'id'>> {}
