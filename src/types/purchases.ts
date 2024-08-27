import { SupplierAttributes } from './suppliers';
import { PurchaseItemAttributes } from './purchase-items';
import { PurchaseItemCreateAttributes } from './purchase-items';

export interface PurchaseAttributes {
  id: number;
  purchaseDate: Date;
  totalAmount: number;
  supplierId: number;
  createdBy: number;
  updatedBy?: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  supplier?: SupplierAttributes;
  items?: PurchaseItemAttributes[];
}

export interface PurchaseCreateAttributes
  extends Omit<PurchaseAttributes, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'supplier' | 'items'> {
  items: PurchaseItemCreateAttributes[];
}

export interface PurchaseUpdateAttributes
  extends Partial<Omit<PurchaseAttributes, 'id'>> {}
