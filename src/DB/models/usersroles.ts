import { Model, DataTypes } from 'sequelize';
import sequelize from './connection';
import Users from './users';
import Roles from './roles';
import { UsersRoleAttributes, UsersRoleCreateAttributes } from '@/types/usersroles';

class UsersRoles extends Model<UsersRoleAttributes, UsersRoleCreateAttributes> implements UsersRoleAttributes {
  public id!: number;
  public userId!: number;
  public roleId!: number;
  public created_at?: Date;
  public updated_at?: Date;

  public static associate() {
    UsersRoles.belongsTo(Users, {
      foreignKey: 'user_id',
      as: 'user',
    });
    UsersRoles.belongsTo(Roles, {
      foreignKey: 'role_id',
      as: 'role',
    });
  }
}
UsersRoles.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      field: 'user_id',
      type: DataTypes.INTEGER
    },
    roleId: {
      field: 'role_id',
      type: DataTypes.INTEGER
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
  },
  {
    tableName: 'UsersRoles',
    sequelize,
    timestamps: true,
    underscored: true
  }
);

export default UsersRoles;
