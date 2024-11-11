import { Neo4jClient } from './neo4j-client';
import { generateEmbedding } from './vertex-ai-embeddings';
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
        tx.run(`
          MERGE (cat:Category {name: $category})
          WITH cat
          MERGE (subcat:SubCategory {name: $subcategory})
          MERGE (subcat)-[:CHILD_OF]->(cat)
          WITH cat, subcat
          CREATE (c:Content {
              id: randomUUID(),
              text: $text,
              textEmbedding: $embedding,
              createdAt: datetime(),
              updatedAt: datetime()
          })
          MERGE (c)-[:BELONGS_TO]->(cat)
          MERGE (c)-[:SUBCATEGORIZED_AS]->(subcat)
          WITH c
          UNWIND $tags as tagName
          MERGE (t:Tag {name: tagName})
          MERGE (c)-[:TAGGED_WITH]->(t)
          
          RETURN c.id as contentId
        `, {
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