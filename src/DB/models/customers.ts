import { Model, DataTypes } from 'sequelize';
import sequelize from './connection';
import { CustomerAttributes, CustomerCreateAttributes } from '@/types/customers';

class Customers extends Model<CustomerAttributes, CustomerCreateAttributes> implements CustomerAttributes {
  public id!: number;
  public firstName!: string;
  public lastName!: string;
  public phone!: string;
  public email!: string;
  public address!: string;
  public createdBy!: number;
  public updatedBy?: number;
  public createdAt?: Date;
  public updatedAt?: Date;
  public deletedAt?: Date;

  public static associate() {
    // Define associations here if needed
  }
}

Customers.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    firstName: {
      type: DataTypes.STRING,
      field: 'first_name',
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      field: 'last_name',
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
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
    },
  },
  {
    sequelize,
    tableName: 'customers',
    timestamps: true,
    underscored: true,
    paranoid: true,  // This enables soft deletes (deletedAt)
  }
);

export default Customers;
