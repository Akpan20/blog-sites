import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import bcrypt from 'bcrypt';
import Reaction from './Reaction';
import UserProfile from './UserProfile';

interface UserAttributes {
  id: number;
  username: string;
  email: string;
  password: string;
  avatar: string;
  created_at: Date;
  updated_at: Date;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'created_at' | 'updated_at'> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public username!: string;
  public email!: string;
  public password!: string;
  public avatar!: string;
  public created_at!: Date;
  public updated_at!: Date;

  // Method to create a new user
  static async createUser({ username, email, password, avatar = 'default-avatar.png' }: { username: string; email: string; password: string; avatar?: string }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return this.create({ username, email, password: hashedPassword, avatar });
  }

  // Method to find a user by ID
  static async findById(id: number) {
    return this.findByPk(id);
  }

  // Method to find a user by email
  static async findByEmail(email: string) {
    return this.findOne({ where: { email } });
  }

  // Method to update a user's password
  static async updatePassword(id: number, newPassword: string) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    return this.update({ password: hashedPassword }, { where: { id } });
  }

  // Method to delete a user
  static async deleteUser(id: number) {
    return this.destroy({ where: { id } });
  }
}

// Initialize the User model
User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
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
    avatar: {
      type: DataTypes.STRING,
      allowNull: true,
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
    modelName: 'User',
    tableName: 'users',
    timestamps: true,
    underscored: true,
  }
);

// Define associations
User.hasOne(UserProfile, { foreignKey: 'userId', as: 'profile' });
User.hasMany(Reaction, { foreignKey: 'userId', as: 'reactions' });

export default User;