import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';

class Comment extends Model {
  public id!: number;
  public content!: string;
  public userId!: number;
  public postId!: number;
  public status!: string;

  // Define the association (if needed)
  static associate(models: any) {
    // You can define associations here if necessary, e.g.:
    // this.belongsTo(models.User, { foreignKey: 'userId' });
    // this.belongsTo(models.Post, { foreignKey: 'postId' });
  }

  // Static method to get comments by postId
  static async getByPostId(postId: number) {
    return this.findAll({
      where: { postId },
      order: [['createdAt', 'DESC']], // Optionally, order by the most recent comment
    });
  }

  // Static method to find a comment by its ID
  static async findById(id: number) {
    return this.findByPk(id);
  }

  // Static method to delete a comment by its ID
  static async delete(id: number) {
    const comment = await this.findByPk(id);
    if (comment) {
      await comment.destroy();
      return true;
    }
    return false;
  }
}

Comment.init(
  {
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

export default Comment;
