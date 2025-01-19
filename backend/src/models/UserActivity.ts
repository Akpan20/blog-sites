import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

interface UserActivityAttributes {
  id: number;
  user_id: string;
  post_id: number;
  action: 'VIEW' | 'LIKE' | 'COMMENT';
  created_at: Date;
}

interface UserActivityCreationAttributes extends Optional<UserActivityAttributes, 'id' | 'created_at'> {}

class UserActivity extends Model<UserActivityAttributes, UserActivityCreationAttributes>
  implements UserActivityAttributes {
  public id!: number;
  public user_id!: string;
  public post_id!: number;
  public action!: 'VIEW' | 'LIKE' | 'COMMENT';
  public created_at!: Date;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  static find: any;
}

UserActivity.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    post_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    action: {
      type: DataTypes.ENUM('VIEW', 'LIKE', 'COMMENT'),
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'UserActivity',
    tableName: 'user_activities',
    timestamps: false,
  }
);

export default UserActivity;