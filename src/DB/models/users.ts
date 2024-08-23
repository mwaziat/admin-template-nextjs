import { Model, DataTypes } from 'sequelize';
import sequelize from './connection';
import Roles from './roles';
import UsersRoles from './usersroles';
import { UserAttributes, UserCreateAttributes } from '@/types/users';
import { RoleAttributes } from '@/types/roles';

class Users extends Model<UserAttributes, UserCreateAttributes> implements UserAttributes {
  public id!: number;
  public firstName!: string;
  public lastName!: string;
  public name!: string;
  public username!: string;
  public email!: string;
  public password!: string;
  public phone!: string;
  public address!: string;
  public isActive!: boolean;
  public createdBy!: number;
  public updatedBy?: number;
  public createdAt?: Date;
  public updatedAt?: Date;
  public deletedAt?: Date;
  public roles?: RoleAttributes[];

  public static associate() {
    Users.belongsToMany(Roles, {
      through: UsersRoles,
      foreignKey: 'user_id',
      otherKey: 'role_id',
      as: 'roles',
    });
  }
}
Users.init(
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
    name: {
      type: DataTypes.STRING,
      field: 'name',
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      field: 'last_name'
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: DataTypes.STRING,
    address: DataTypes.STRING,
    isActive: {
      type: DataTypes.BOOLEAN,
      field: 'is_active',
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
    tableName: 'Users',
    sequelize,
    timestamps: true,
    underscored: true
  }
);

export default Users;
