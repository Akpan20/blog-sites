import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';
import { PostStatus } from './PostStatus';
import Reaction from './Reaction';

class Post extends Model {
  public categoryId!: number;
  public id!: string;
  public title!: string;
  public content!: string;
  public author!: string;
  public created_at!: string;
  public likes_count!: number;
  public comments_count!: number;
  public liked!: boolean;
  public featured_image?: string;
  public versions?: Array<{ id: string; content: string; updatedAt: string }>;
  public status!: typeof PostStatus;
}

Post.init(
  {
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    likes_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    comments_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    liked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    featured_image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    versions: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM(...Object.values(PostStatus)),
      allowNull: false,
      defaultValue: PostStatus.DRAFT,  // Default status as 'draft'
    },
  },
  {
    sequelize,
    modelName: 'Post',
    tableName: 'posts',
    timestamps: false,
    underscored: true,
  }
);

// Define the association with the Reaction model
Post.hasMany(Reaction, { foreignKey: 'postId', as: 'reactions' });

export default Post;
