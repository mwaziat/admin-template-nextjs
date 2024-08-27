import { CategoryAttributes } from "./categories";

export interface ProductAttributes {
  id: number;
  name: string;
  sku: string;
  description?: string;
  price: number;
  stock: number;
  categoryId: number;
  supplierId: number;
  createdBy: number;
  updatedBy?: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  category?: CategoryAttributes;
}

export interface ProductCreateAttributes
  extends Omit<ProductAttributes, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'category'> {
  categoryId: number;
}

export interface ProductUpdateAttributes
  extends Partial<Omit<ProductAttributes, 'id'>> {}
