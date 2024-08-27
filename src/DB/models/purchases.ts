import { Model, DataTypes } from 'sequelize';
import sequelize from './connection';
import Suppliers from './suppliers';
import { PurchaseAttributes, PurchaseCreateAttributes } from '@/types/purchases';

class Purchases extends Model<PurchaseAttributes, PurchaseCreateAttributes> implements PurchaseAttributes {
  public id!: number;
  public purchaseDate!: Date;
  public totalAmount!: number;
  public supplierId!: number;
  public createdBy!: number;
  public updatedBy?: number;
  public createdAt?: Date;
  public updatedAt?: Date;
  public deletedAt?: Date;

  public static associate() {
    Purchases.belongsTo(Suppliers, {
      foreignKey: 'supplier_id',
      as: 'supplier',
    });
  }
}

Purchases.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    purchaseDate: {
      type: DataTypes.DATE,
      field: 'purchase_date',
      allowNull: false,
    },
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      field: 'total_amount',
      allowNull: false,
    },
    supplierId: {
      type: DataTypes.INTEGER,
      field: 'supplier_id',
      allowNull: false,
    },
    createdBy: {
      field: 'created_by',
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    updatedBy: {
      field: 'updated_by',
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    createdAt: {
      field: 'created_at',
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      field: 'updated_at',
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    deletedAt: {
      field: 'deleted_at',
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    tableName: 'purchases',
    sequelize,
    timestamps: true,
    underscored: true,
    paranoid: true, // Enables soft delete
  }
);

export default Purchases;
