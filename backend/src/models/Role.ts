import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/database';

const RoleValues = {
  ADMIN: 'admin',
  EDITOR: 'editor',
  AUTHOR: 'author',
  USER: 'user'
} as const;

type RoleType = typeof RoleValues[keyof typeof RoleValues];

interface RoleAttributes {
  id: number;
  name: RoleType;
  createdAt: Date;
  updatedAt: Date;
}

interface RoleCreationAttributes extends Optional<RoleAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class Role extends Model<RoleAttributes, RoleCreationAttributes> implements RoleAttributes {
  public id!: number;
  public name!: RoleType;
  public createdAt!: Date;
  public updatedAt!: Date;
}

Role.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.ENUM(...Object.values(RoleValues)),
      allowNull: false,
      unique: true
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  },
  {
    sequelize,
    modelName: 'Role',
    tableName: 'roles',
    timestamps: true
  }
);

export { Role, RoleValues as RoleTypes };