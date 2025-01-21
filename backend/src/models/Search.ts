import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/database';

// Define the attributes for the Search model
interface SearchAttributes {
  id: number;
  query: string;
  results: any[]; // Array of search results (can be customized based on your needs)
  createdAt: Date;
  updatedAt: Date;
}

// Define optional attributes for creation (e.g., `id` is auto-generated)
interface SearchCreationAttributes extends Optional<SearchAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

// Define the Search model class
class Search extends Model<SearchAttributes, SearchCreationAttributes> implements SearchAttributes {
  public id!: number;
  public query!: string;
  public results!: any[];
  public createdAt!: Date;
  public updatedAt!: Date;

  // Static method to perform a search
  static async performSearch(query: string, filters: any = {}): Promise<any[]> {
    // Replace this with your actual search logic
    const { q, category, tag, startDate, endDate, page = 1, limit = 10 } = filters;

    const offset = (page - 1) * limit;

    const searchQuery = {
      query: `
        SELECT p.*, u.username,
          COUNT(*) OVER() as total_count
        FROM posts p
        LEFT JOIN users u ON p.user_id = u.id
        LEFT JOIN post_tags pt ON pt.post_id = p.id
        WHERE 
          ($1::text IS NULL OR p.title ILIKE $1 OR p.content ILIKE $1)
          AND ($2::text IS NULL OR p.category = $2)
          AND ($3::text IS NULL OR pt.tag = $3)
          AND ($4::timestamp IS NULL OR p.created_at >= $4)
          AND ($5::timestamp IS NULL OR p.created_at <= $5)
        GROUP BY p.id, u.username
        ORDER BY p.created_at DESC
        LIMIT $6 OFFSET $7
      `,
      values: [
        q ? `%${q}%` : null,
        category,
        tag,
        startDate,
        endDate,
        limit,
        offset,
      ],
    };

    const [rows] = await sequelize.query(searchQuery);
    return rows;
  }
}

// Initialize the Search model
Search.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    query: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    results: {
      type: DataTypes.JSONB, // Store search results as JSON
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
    modelName: 'Search',
    tableName: 'searches',
    timestamps: true,
  }
);

export default Search;