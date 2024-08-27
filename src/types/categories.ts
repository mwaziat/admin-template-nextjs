import { ProductAttributes } from "./products";

export interface CategoryAttributes {
  id: number;
  name: string;
  description?: string;
  createdBy: number;
  updatedBy?: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  products?: ProductAttributes[];
}

export interface CategoryCreateAttributes
  extends Omit<CategoryAttributes, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'products'> {}

export interface CategoryUpdateAttributes
  extends Partial<Omit<CategoryAttributes, 'id'>> {}
