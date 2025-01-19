import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';
import { PostStatus } from './PostStatus';

class Post extends Model {
  public id!: number;
  public title!: string;
  public content!: string;
  public userId!: number;
  public status!: string;
  public createdAt!: Date;
  public updatedAt!: Date;

  // Class-level methods or static methods can be defined here if necessary
}

Post.init(
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users', // Adjust the model name if necessary
        key: 'id',
      },
    },
    status: {
      type: DataTypes.ENUM(PostStatus.DRAFT, PostStatus.PUBLISHED, PostStatus.ARCHIVED, PostStatus.DELETED),
      allowNull: false,
      defaultValue: PostStatus.PUBLISHED,
    },
  },
  {
    sequelize,
    modelName: 'Post',
    tableName: 'posts',
    timestamps: true,
  }
);

export default Post;
