import { ProductAttributes } from './products';
import { TransactionAttributes } from './transactions';

export interface TransactionItemAttributes {
  id: number;
  transactionId: number;
  productId: number;
  quantity: number;
  price: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  transaction?: TransactionAttributes;
  product?: ProductAttributes;
}

export interface TransactionItemCreateAttributes
  extends Omit<TransactionItemAttributes, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'transaction' | 'product'> {}

export interface TransactionItemUpdateAttributes
  extends Partial<Omit<TransactionItemAttributes, 'id'>> {}
