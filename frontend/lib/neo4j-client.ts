import neo4j, { Driver } from "neo4j-driver";

export class Neo4jClient {
  private driver: Driver;

  //TODO: add env variables
  // TODO: add error handling
  // TODO: add logging
  // TODO: add neo4j Configs

  constructor() {
    this.driver = neo4j.driver(
      process.env.NEO4J_URI || "bolt://localhost:7687",
      neo4j.auth.basic(
        process.env.NEO4J_USER || "neo4j",
        process.env.NEO4J_PASSWORD || "password"
      )
    );
  }

  async createNode(data: Record<string, any>) {
    const session = this.driver.session();
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
