import { ProductAttributes } from './products';
import { PurchaseAttributes } from './purchases';

export interface PurchaseItemAttributes {
  id: number;
  purchaseId: number;
  productId: number;
  quantity: number;
  price: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  purchase?: PurchaseAttributes;
  product?: ProductAttributes;
}

export interface PurchaseItemCreateAttributes
  extends Omit<PurchaseItemAttributes, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'purchase' | 'product'> {}

export interface PurchaseItemUpdateAttributes
  extends Partial<Omit<PurchaseItemAttributes, 'id'>> {}
