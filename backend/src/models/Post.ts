import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';
import { PostStatus } from './PostStatus';
import Reaction from './Reaction';

class Post extends Model {
  public id!: number;
  public title!: string;
  public content!: string;
  public userId!: number;
  public status!: string;
  public createdAt!: Date;
  public updatedAt!: Date;

  // Class-level method to find all published posts
  static async findPublishedPosts(): Promise<Post[]> {
    return this.findAll({
      where: {
        status: PostStatus.PUBLISHED,
      },
    });
  }

  // Class-level method to find posts by a specific user
  static async findPostsByUser(userId: number): Promise<Post[]> {
    return this.findAll({
      where: {
        userId,
      },
    });
  }
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

// Define the association with the Reaction model
Post.hasMany(Reaction, { foreignKey: 'postId', as: 'reactions' });

export default Post;