import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';
import User from './User';

class UserProfile extends Model {
  public id!: string;
  public userId!: string;
  public bio!: string;
  public avatar!: string;
  public website!: string;
  public location!: string;
  public createdAt!: Date;
  public updatedAt!: Date;
}

UserProfile.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'user',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    website: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'UserProfile',
    tableName: 'user_profiles',
    timestamps: true, // Enable automatic handling of createdAt and updatedAt
    underscored: true, // Use snake_case for column names
  }
);

// Define the association with the User model
UserProfile.belongsTo(User, { foreignKey: 'userId', as: 'user' });

export default UserProfile;