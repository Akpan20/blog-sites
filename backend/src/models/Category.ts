import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/database';

interface CategoryAttributes {
  id: number;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

interface CategoryCreationAttributes extends Optional<CategoryAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class Category extends Model<CategoryAttributes, CategoryCreationAttributes> implements CategoryAttributes {
  public id!: number;
  public name!: string;
  public description!: string;
  public createdAt!: Date;
  public updatedAt!: Date;
  static create: any;
  static findAll: any;
  static findByPk: any;
  static update: any;
  static destroy: any;
  static init: any;

  // Static method to create a category
  static async createCategory(name: string, description: string): Promise<Category> {
    return await this.create({ name, description });
  }

  // Static method to get all categories
  static async getAllCategories(): Promise<Category[]> {
    return await this.findAll();
  }

  // Static method to get a category by ID
  static async getCategoryById(id: number): Promise<Category | null> {
    return await this.findByPk(id);
  }

  // Static method to update a category
  static async updateCategory(id: number, name: string, description: string): Promise<[number, Category[]]> {
    return await this.update({ name, description }, { where: { id }, returning: true });
  }

  // Static method to delete a category
  static async deleteCategory(id: number): Promise<boolean> {
    const deletedRows = await this.destroy({ where: { id } });
    return deletedRows > 0;
  }
}

Category.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'Category',
    tableName: 'categories',
    timestamps: true,
  }
);

export default Category;