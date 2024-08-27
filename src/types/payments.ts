export interface PaymentAttributes {
  id: number;
  purchaseId?: number; // ID pembelian jika terkait dengan pembelian
  saleId?: number; // ID penjualan jika terkait dengan penjualan
  amount: number;
  paymentDate: Date;
  paymentMethod: string; // Contoh: 'cash', 'credit card', 'bank transfer', dll.
  createdBy: number;
  updatedBy?: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface PaymentCreateAttributes extends Omit<PaymentAttributes, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'> {}

export interface PaymentUpdateAttributes extends Partial<Omit<PaymentAttributes, 'id' | 'createdBy' | 'createdAt' | 'deletedAt'>> {}
