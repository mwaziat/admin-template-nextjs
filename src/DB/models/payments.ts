import { Model, DataTypes } from 'sequelize';
import sequelize from './connection';
import Purchases from './purchases';
import Sales from './sales';
import { PaymentAttributes, PaymentCreateAttributes } from '@/types/payments';

class Payments extends Model<PaymentAttributes, PaymentCreateAttributes> implements PaymentAttributes {
  public id!: number;
  public purchaseId?: number;
  public saleId?: number;
  public amount!: number;
  public paymentDate!: Date;
  public paymentMethod!: string;
  public createdBy!: number;
  public updatedBy?: number;
  public createdAt?: Date;
  public updatedAt?: Date;
  public deletedAt?: Date;

  public static associate() {
    Payments.belongsTo(Purchases, {
      foreignKey: 'purchaseId',
      as: 'purchase',
    });
    Payments.belongsTo(Sales, {
      foreignKey: 'saleId',
      as: 'sale',
    });
  }
}

Payments.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    purchaseId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Purchases',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
    saleId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Sales',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    paymentDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    paymentMethod: {
      type: DataTypes.STRING,
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
      allowNull: true,
    },
    deletedAt: {
      field: 'deleted_at',
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: 'payments',
    sequelize,
    timestamps: true,
    underscored: true,
    paranoid: true,
  }
);

export default Payments;
