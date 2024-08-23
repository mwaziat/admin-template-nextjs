import { Model, DataTypes } from 'sequelize';
import sequelize from './connection';
import Users from './users';
import UsersRoles from './usersroles';
import { RoleAttributes, RoleCreateAttributes } from '@/types/roles';

class Roles extends Model<RoleAttributes, RoleCreateAttributes> implements RoleAttributes {
  public id!: number;
  public name!: string;
  public description!: string;
  public createdBy!: number;
  public updatedBy?: number;
  public createdAt?: Date;
  public updatedAt?: Date;
  public deletedAt?: Date;

  public static associate() {
    Roles.belongsToMany(Users, {
      through: UsersRoles,
      foreignKey: 'role_id',
      otherKey: 'user_id',
      as: 'users',
    });
  }
}
Roles.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      field: 'name',
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      field: 'description'
    },
    createdBy: {
      field: 'created_by',
      type: DataTypes.INTEGER,
      allowNull: true,
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
    tableName: 'Roles',
    sequelize,
    timestamps: true,
    underscored: true,
    // paranoid: true,
  }
);


export default Roles;
