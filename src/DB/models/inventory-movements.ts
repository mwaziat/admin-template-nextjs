import { Model, DataTypes } from 'sequelize';
import sequelize from './connection';
import Products from './products';
import { InventoryMovementAttributes, InventoryMovementCreateAttributes } from '@/types/inventory-movements';

class InventoryMovements extends Model<InventoryMovementAttributes, InventoryMovementCreateAttributes> implements InventoryMovementAttributes {
  public id!: number;
  public productId!: number;
  public quantity!: number;
  public movementType!: 'in' | 'out';
  public movementDate!: Date;
  public reference!: string;
  public createdBy!: number;
  public updatedBy?: number;
  public createdAt?: Date;
  public updatedAt?: Date;
  public deletedAt?: Date;

  public static associate() {
    InventoryMovements.belongsTo(Products, {
      foreignKey: 'productId',
      as: 'product',
    });
  }
}

InventoryMovements.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Products',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    movementType: {
      type: DataTypes.ENUM('in', 'out'),
      allowNull: false,
    },
    movementDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    reference: {
      type: DataTypes.STRING,
      allowNull: true,
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
    tableName: 'inventor_movements',
    sequelize,
    timestamps: true,
    underscored: true,
    paranoid: true,
  }
);

export default InventoryMovements;
