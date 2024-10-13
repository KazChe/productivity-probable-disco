import type { NextApiRequest, NextApiResponse } from "next";
import { Neo4jClient } from "@/lib/neo4j-client"; // You'll need to create this client

type RequestData = {
  text: string;
  category: string;
  subcategory: string;
  tags: string[];
};

type ResponseData = {
  success: boolean;
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, message: "Method Not Allowed" });
  }

  try {
    const { text, category, subcategory, tags } = req.body as RequestData;

    // initialize Neo4j client
    const neo4jClient = new Neo4jClient();

    const result = await neo4jClient.createNode({
      text,
      category,
      subcategory,
      tags,
    });

    await neo4jClient.close();

    res.status(200).json({ success: true, message: "Data saved successfully" });
  } catch (error) {
    console.error("Error saving to Vector DB:", error);
    res.status(500).json({ success: false, message: "Error saving data" });
  }
}