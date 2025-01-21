import Search from '../models/Search';

class SearchService {
  // Perform a search and log the results
  async searchPosts(query: string, filters: any = {}) {
    const results = await Search.performSearch(query, filters);

    // Log the search query and results in the database
    await Search.create({
      query,
      results,
    });

    return results;
  }
}

export default new SearchService();