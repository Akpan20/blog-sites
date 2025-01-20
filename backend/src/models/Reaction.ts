import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';
import { Post } from './Post';
import { Comment } from './Comment';
import { User } from './User';

class Reaction extends Model {
  public id!: number;
  public type!: string;
  public userId!: number;
  public postId!: number;
  public commentId!: number;
  public createdAt!: Date;
  public updatedAt!: Date;
}

Reaction.init(
  {
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [['like', 'dislike', 'heart', 'laugh', 'angry']],
      },
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
      allowNull: false,
      references: {
        model: 'posts', 
        key: 'id',
      },
    },
    commentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
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

// Define associations (if needed)
Reaction.belongsTo(Post, { foreignKey: 'postId', as: 'post' });
Reaction.belongsTo(Comment, { foreignKey: 'commentId', as: 'comment' });
Reaction.belongsTo(User, { foreignKey: 'userId', as: 'user' });

export default Reaction;