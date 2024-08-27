import { Model, DataTypes } from 'sequelize';
import sequelize from './connection';
import Users from './users';
import { SalesAttributes, SalesCreateAttributes } from '@/types/sales';

class Sales extends Model<SalesAttributes, SalesCreateAttributes> implements SalesAttributes {
  public id!: number;
  public userId!: number;
  public totalAmount!: number;
  public saleDate!: Date;
  public createdBy!: number;
  public updatedBy?: number;
  public createdAt?: Date;
  public updatedAt?: Date;
  public deletedAt?: Date;

  public static associate() {
    Sales.belongsTo(Users, {
      foreignKey: 'userId',
      as: 'user',
    });
  }
}

Sales.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    saleDate: {
      type: DataTypes.DATE,
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
    tableName: 'sales',
    sequelize,
    timestamps: true,
    underscored: true,
    paranoid: true,
  }
);

export default Sales;
