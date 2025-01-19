import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';

interface UserTrustAttributes {
  id: number;
  userId: number;
  trustScore: number;
  lastCalculated: Date;
  created_at: Date;
  updated_at: Date;
}

interface UserTrustCreationAttributes extends Omit<UserTrustAttributes, 'id' | 'created_at' | 'updated_at'> {}

class UserTrust extends Model<UserTrustAttributes, UserTrustCreationAttributes> implements UserTrustAttributes {
  public id!: number;
  public userId!: number;
  public trustScore!: number;
  public lastCalculated!: Date;
  public created_at!: Date;
  public updated_at!: Date;

  // Static method to get trust score
  static async getScore(userId: number): Promise<number> {
    const trustRecord = await this.findOne({
      where: { userId },
      order: [['lastCalculated', 'DESC']],
    });

    return trustRecord?.trustScore || 0.5; // Default trust score if not found
  }

  // Method to update trust score
  static async updateScore(userId: number, newScore: number): Promise<UserTrust> {
    const [trustRecord, created] = await this.findOrCreate({
      where: { userId },
      defaults: {
        userId, // Add userId to defaults
        trustScore: newScore,
        lastCalculated: new Date(),
      },
    });

    if (!created) {
      await trustRecord.update({
        trustScore: newScore,
        lastCalculated: new Date(),
      });
    }

    return trustRecord;
  }
}

// Initialize the UserTrust model
UserTrust.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    trustScore: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0.5,
      validate: {
        min: 0,
        max: 1,
      },
    },
    lastCalculated: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'UserTrust',
    tableName: 'user_trust',
    timestamps: true,
    underscored: true,
  },
);

export default UserTrust;