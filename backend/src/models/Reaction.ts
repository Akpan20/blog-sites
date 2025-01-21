import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';
import { Post } from './Post';
import { Comment } from './Comment';
import { User } from './User';

class Reaction extends Model {
  public id!: number;
  public type!: 'like' | 'dislike' | 'heart' | 'laugh' | 'angry';
  public userId!: number;
  public postId?: number;
  public commentId?: number;
  public createdAt!: Date;
  public updatedAt!: Date;
}

Reaction.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    type: {
      type: DataTypes.ENUM('like', 'dislike', 'heart', 'laugh', 'angry'),
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    postId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'posts',
        key: 'id',
      },
    },
    commentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'comments',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    modelName: 'Reaction',
    tableName: 'reactions',
    timestamps: true,
  }
);

// Define associations
Reaction.belongsTo(Post, { foreignKey: 'postId', as: 'post' });
Reaction.belongsTo(Comment, { foreignKey: 'commentId', as: 'comment' });
Reaction.belongsTo(User, { foreignKey: 'userId', as: 'user' });

export default Reaction;
