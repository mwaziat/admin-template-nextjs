export interface InventoryMovementAttributes {
  id: number;
  productId: number;
  quantity: number;
  movementType: 'in' | 'out'; // 'in' untuk penambahan stok, 'out' untuk pengurangan stok
  movementDate: Date;
  reference: string; // Referensi ke purchase, sales, dll.
  createdBy: number;
  updatedBy?: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface InventoryMovementCreateAttributes extends Omit<InventoryMovementAttributes, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'> {}

export interface InventoryMovementUpdateAttributes extends Partial<Omit<InventoryMovementAttributes, 'id' | 'createdBy' | 'createdAt' | 'deletedAt'>> {}
