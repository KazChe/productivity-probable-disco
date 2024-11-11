import { Neo4jClient } from './neo4j-client';
import { generateEmbedding } from './vertex-ai-embeddings';
import { CONTENT_QUERIES } from './queries/content-queries';
/*
    service to handles calling our embedding service and save 
    (content, category, subcategory, tags) to neo4j
*/
interface SaveContentParams {
  text: string;
  category: string;
  subcategory: string;
  tags: string[];
}

export class Neo4jService {
  private client: Neo4jClient;

  constructor() {
    this.client = new Neo4jClient();
  }
  async saveContent({ text, category, subcategory, tags }: SaveContentParams) {
    const session = this.client.getSession();
    try {
      // call embedding service
      const embedding = await generateEmbedding(text);
      const result = await session.executeWrite(tx =>
        tx.run(CONTENT_QUERIES.saveContent, {
          text,
          category,
          subcategory,
          tags,
          embedding
        })
      );

      return result.records[0].get('contentId');
    } finally {
      await session.close();
    }
  }
} 