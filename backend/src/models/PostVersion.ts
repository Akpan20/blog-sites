import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import User from './User';
import Post from './Post';

interface PostVersionAttributes {
  id: number;
  postId: number;
  content: string;
  userId: number;
  createdAt: Date;
}

interface PostVersionCreationAttributes extends Optional<PostVersionAttributes, 'id' | 'createdAt'> {}

class PostVersion extends Model<PostVersionAttributes, PostVersionCreationAttributes> implements PostVersionAttributes {
  public id!: number;
  public postId!: number;
  public content!: string;
  public userId!: number;
  public createdAt!: Date;

  static async createVersion({ postId, content, userId }: Omit<PostVersionCreationAttributes, 'id'>): Promise<PostVersion> {
    return await this.create({ postId, content, userId });
  }

  static async getVersionHistory(postId: number): Promise<PostVersion[]> {
    return await this.findAll({
      where: { postId },
      include: [{
        model: User,
        attributes: ['username']
      }],
      order: [['createdAt', 'DESC']]
    });
  }
}

PostVersion.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    postId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'posts',
        key: 'id'
      }
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  },
  {
    sequelize,
    modelName: 'PostVersion',
    tableName: 'post_versions',
    timestamps: true,
    updatedAt: false
  }
);

// Define associations
PostVersion.belongsTo(User, { foreignKey: 'userId' });
Post.hasMany(PostVersion, { foreignKey: 'postId' });
PostVersion.belongsTo(Post, { foreignKey: 'postId' });

export default PostVersion;