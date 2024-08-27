import { Model, DataTypes } from 'sequelize';
import sequelize from './connection';
import Purchases from './purchases';
import Products from './products';
import { PurchaseItemAttributes, PurchaseItemCreateAttributes } from '@/types/purchase-items';

class PurchaseItems extends Model<PurchaseItemAttributes, PurchaseItemCreateAttributes> implements PurchaseItemAttributes {
  public id!: number;
  public purchaseId!: number;
  public productId!: number;
  public quantity!: number;
  public price!: number;
  public createdAt?: Date;
  public updatedAt?: Date;
  public deletedAt?: Date;

  public static associate() {
    PurchaseItems.belongsTo(Purchases, {
      foreignKey: 'purchase_id',
      as: 'purchase',
    });

    PurchaseItems.belongsTo(Products, {
      foreignKey: 'product_id',
      as: 'product',
    });
  }
}

PurchaseItems.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    purchaseId: {
      type: DataTypes.INTEGER,
      field: 'purchase_id',
      allowNull: false,
    },
    productId: {
      type: DataTypes.INTEGER,
      field: 'product_id',
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
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
    tableName: 'purchase_items',
    sequelize,
    timestamps: true,
    underscored: true,
    paranoid: true, // Enables soft delete
  }
);

export default PurchaseItems;
