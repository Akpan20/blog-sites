import { Client } from '@elastic/elasticsearch';
import { SearchHit, SearchResponse } from '@elastic/elasticsearch/lib/api/types';

const elasticClient = new Client({ node: process.env.ELASTICSEARCH_URL });

interface Post {
  id: string;
  title: string;
  content: string;
  author: {
    username: string;
  };
  tags: string[];
  category: string;
  created_at: Date;
}

interface Hit extends SearchHit<unknown> {
  _source?: any;
  _score?: number | null;
  highlight?: any;
}

class SearchService {
  static async indexPost(post: Post) {
    await elasticClient.index({
      index: 'posts',
      id: post.id,
      document: {
        title: post.title,
        content: post.content,
        author: post.author.username,
        tags: post.tags,
        category: post.category,
        created_at: post.created_at,
      },
    });
  }

  static async search(query: string) {
    const result: SearchResponse = await elasticClient.search({
      index: 'posts',
      body: {
        query: {
          multi_match: {
            query,
            fields: ['title^2', 'content', 'tags^1.5'],
            fuzziness: 'AUTO',
          },
        },
        highlight: {
          fields: {
            title: {},
            content: {},
          },
        },
      },
    });

    return result.hits.hits.map((hit: Hit) => ({
      ...hit._source,
      score: hit._score ?? 0, // Handle null or undefined _score
      highlights: hit.highlight ?? {}, // Handle null or undefined highlight
    }));
  }
}

export default SearchService;