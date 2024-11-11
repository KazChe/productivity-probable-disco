import neo4j, { Driver } from "neo4j-driver";

export class Neo4jClient {
  private driver: Driver;

  constructor() {
    this.driver = neo4j.driver(
      process.env.NEO4J_URI!,
      neo4j.auth.basic(process.env.NEO4J_USER!, process.env.NEO4J_PASSWORD!)
    );
  }

  getSession() {
    return this.driver.session();
  }

  async createNode(data: Record<string, unknown>) {
    const session = this.getSession();
    try {
      const result = await session.run(
        "CREATE (n:Node) SET n = $data RETURN n",
        { data }
      );
      return result.records[0].get("n");
    } finally {
      await session.close();
    }
  }

  async close() {
    await this.driver.close();
  }
}
