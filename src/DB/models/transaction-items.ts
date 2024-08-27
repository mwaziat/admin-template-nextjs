import { Model, DataTypes } from 'sequelize';
import sequelize from './connection';
import Transactions from './transactions';
import Products from './products';
import { TransactionItemAttributes, TransactionItemCreateAttributes } from '@/types/transaction-items';

class TransactionItems extends Model<TransactionItemAttributes, TransactionItemCreateAttributes> implements TransactionItemAttributes {
  public id!: number;
  public transactionId!: number;
  public productId!: number;
  public quantity!: number;
  public price!: number;
  public createdAt?: Date;
  public updatedAt?: Date;
  public deletedAt?: Date;

  public static associate() {
    TransactionItems.belongsTo(Transactions, {
      foreignKey: 'transaction_id',
      as: 'transaction',
    });

    TransactionItems.belongsTo(Products, {
      foreignKey: 'product_id',
      as: 'product',
    });
  }
}

TransactionItems.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    transactionId: {
      type: DataTypes.INTEGER,
      field: 'transaction_id',
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
    tableName: 'transaction_items',
    sequelize,
    timestamps: true,
    underscored: true,
    paranoid: true, // Enables soft delete
  }
);

export default TransactionItems;
