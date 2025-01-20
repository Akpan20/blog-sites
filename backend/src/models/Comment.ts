import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import Reaction from './Reaction';

interface CommentAttributes {
  id: number;
  content: string;
  userId: number;
  postId: number;
  status: string;
}

interface CommentCreationAttributes extends Optional<CommentAttributes, 'id' | 'status'> {}

class Comment extends Model<CommentAttributes, CommentCreationAttributes> implements CommentAttributes {
  public id!: number;
  public content!: string;
  public userId!: number;
  public postId!: number;
  public status!: string;

  static async getByPostId(postId: number): Promise<Comment[]> {
    return this.findAll({ where: { postId } });
  }

  static async delete(id: number): Promise<boolean> {
    const rowsDeleted = await this.destroy({ where: { id } });
    return rowsDeleted > 0;
  }
}

Comment.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    postId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected', 'spam'),
      defaultValue: 'pending',
    },
  },
  {
    sequelize,
    modelName: 'Comment',
    tableName: 'comments',
    timestamps: true,
  }
);

// Define the association with the Reaction model
Comment.hasMany(Reaction, { foreignKey: 'commentId', as: 'reactions' });

export default Comment;