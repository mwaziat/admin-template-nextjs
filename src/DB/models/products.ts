import { Model, DataTypes } from 'sequelize';
import sequelize from './connection';
import { ProductAttributes, ProductCreateAttributes } from '@/types/products';
import Categories from './categories ';
import Suppliers from './suppliers';

class Products extends Model<ProductAttributes, ProductCreateAttributes> implements ProductAttributes {
  public id!: number;
  public name!: string;
  public sku!: string;
  public description!: string;
  public price!: number;
  public stock!: number;
  public categoryId!: number;
  public supplierId!: number;
  public createdBy!: number;
  public updatedBy?: number;
  public createdAt?: Date;
  public updatedAt?: Date;
  public deletedAt?: Date;

  public static associate() {
    Products.belongsTo(Categories, {
      foreignKey: 'category_id',
      as: 'category',
    });
    Products.belongsTo(Suppliers, { foreignKey: 'supplier_id', as: 'supplier' });
  }
}

Products.init(
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
    sku: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.STRING,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    categoryId: {
      type: DataTypes.INTEGER,
      field: 'category_id',
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
    },
  },
  {
    tableName: 'products',
    sequelize,
    timestamps: true,
    underscored: true,
    paranoid: true,
  }
);

export default Products;
