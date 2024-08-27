import { Model, DataTypes } from 'sequelize';
import sequelize from './connection';
import { SupplierAttributes, SupplierCreateAttributes } from '@/types/suppliers';
import Products from './products';

class Suppliers extends Model<SupplierAttributes, SupplierCreateAttributes> implements SupplierAttributes {
  public id!: number;
  public name!: string;
  public phone!: string;
  public email!: string;
  public address!: string;
  public createdBy!: number;
  public updatedBy?: number;
  public createdAt?: Date;
  public updatedAt?: Date;
  public deletedAt?: Date;

  public static associate() {
    Suppliers.hasMany(Products, { foreignKey: 'supplier_id', as: 'products' });
  }
}

Suppliers.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
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
    tableName: 'suppliers',
    sequelize,
    timestamps: true,
    underscored: true,
    paranoid: true, // Enables soft delete
  }
);

export default Suppliers;
