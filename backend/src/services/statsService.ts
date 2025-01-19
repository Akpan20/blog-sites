import { Model } from 'sequelize';
import Post from '../models/Post';
import Comment from '../models/Comment';
import Reaction from '../models/Reaction';

/**
 * Fetch user statistics (e.g., number of posts, comments, likes)
 * @param userId - The ID of the user
 * @returns An object containing the user's statistics
 */
export const getUserStats = async (userId: string) => {
  try {
    // Use Model.count() with type assertion
    const postCount = await (Post as any).count({ 
      where: { userId } 
    });

    const commentCount = await (Comment as any).count({ 
      where: { userId } 
    });

    // Fetch the number of likes received by the user's posts
    const posts = await Post.findAll({ 
      where: { userId }, 
      attributes: ['id'] 
    });
    const postIds = posts.map(post => post.id);

    const likeCount = await (Reaction as any).count({
      where: { 
        postId: postIds, 
        type: 'like' 
      }
    });

    return {
      postCount,
      commentCount,
      likeCount,
    };
  } catch (error) {
    console.error('Error fetching user statistics:', error);
    throw new Error('Failed to fetch user statistics');
  }
};