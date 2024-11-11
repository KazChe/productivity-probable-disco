export const CONTENT_QUERIES = {
  saveContent: `
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
  `
}; 