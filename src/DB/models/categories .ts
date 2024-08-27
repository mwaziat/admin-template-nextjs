import { Model, DataTypes } from 'sequelize';
import sequelize from './connection';
import { CategoryAttributes, CategoryCreateAttributes } from '@/types/categories';
import Products from './products';
import { ProductAttributes } from '@/types/products';

class Categories extends Model<CategoryAttributes, CategoryCreateAttributes> implements CategoryAttributes {
  public id!: number;
  public name!: string;
  public description!: string;
  public createdBy!: number;
  public updatedBy?: number;
  public createdAt?: Date;
  public updatedAt?: Date;
  public deletedAt?: Date;
  public products?: ProductAttributes[] | undefined;

  public static associate() {
    Categories.hasMany(Products, {
      foreignKey: 'category_id',
      as: 'products',
    });
  }
}

Categories.init(
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
    description: {
      type: DataTypes.STRING,
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
    tableName: 'categories',
    sequelize,
    timestamps: true,
    underscored: true,
    paranoid: true,
  }
);

export default Categories;
