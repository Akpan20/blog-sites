import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/database';

interface TagAttributes {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

interface TagCreationAttributes extends Optional<TagAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class Tag extends Model<TagAttributes, TagCreationAttributes> implements TagAttributes {
  public id!: number;
  public name!: string;
  public createdAt!: Date;
  public updatedAt!: Date;

  static async createTag({ name }: { name: string }): Promise<Tag> {
    return await Tag.create({ name });
  }

  static async findById(id: number): Promise<Tag | null> {
    return await Tag.findByPk(id);
  }

  static async findByName(name: string): Promise<Tag | null> {
    return await Tag.findOne({ where: { name } });
  }

  static async updateTag(id: number, { name }: { name: string }): Promise<[number, Tag[]]> {
    return await Tag.update({ name }, { where: { id }, returning: true });
  }

  static async findAllTags({ limit = 10, offset = 0 }: { limit: number; offset: number } & { order?: any[] }): Promise<Tag[]> {
    return await Tag.findAll({
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    });
  }
}

Tag.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  },
  {
    sequelize,
    modelName: 'Tag',
    tableName: 'tags',
    timestamps: true
  }
);

export default Tag;