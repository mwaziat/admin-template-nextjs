import { Model, DataTypes } from 'sequelize';
import sequelize from './connection';
import Customers from './customers';
import { TransactionAttributes, TransactionCreateAttributes } from '@/types/transactions';

class Transactions extends Model<TransactionAttributes, TransactionCreateAttributes> implements TransactionAttributes {
  public id!: number;
  public transactionDate!: Date;
  public totalAmount!: number;
  public customerId!: number;
  public createdBy!: number;
  public updatedBy?: number;
  public createdAt?: Date;
  public updatedAt?: Date;
  public deletedAt?: Date;

  public static associate() {
    Transactions.belongsTo(Customers, {
      foreignKey: 'customer_id',
      as: 'customer',
    });
  }
}

Transactions.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    transactionDate: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'transaction_date',
    },
    totalAmount: {
      type: DataTypes.FLOAT,
      allowNull: false,
      field: 'total_amount',
    },
    customerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'customer_id',
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
    },
  },
  {
    sequelize,
    tableName: 'transactions',
    timestamps: true,
    underscored: true,
    paranoid: true,
  }
);

export default Transactions;
