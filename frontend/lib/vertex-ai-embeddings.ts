import { GoogleAuth } from "google-auth-library";
import axios from "axios";

const PROJECT_ID = process.env.GOOGLE_CLOUD_PROJECT_ID;
const CREDENTIALS_PATH = process.env.GOOGLE_APPLICATION_CREDENTIALS;
const LOCATION = "us-central1";
const MODEL = "textembedding-gecko@003";

if (!PROJECT_ID || !CREDENTIALS_PATH) {
  throw new Error("Required Google Cloud environment variables are not set");
}

/*
    service to handle Vertex AI embeddings generation
*/
export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const auth = new GoogleAuth({
      keyFilename: CREDENTIALS_PATH,
      scopes: ["https://www.googleapis.com/auth/cloud-platform"],
    });

    const client = await auth.getClient();
    const token = await client.getAccessToken();

    const apiUrl = `https://${LOCATION}-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/${LOCATION}/publishers/google/models/${MODEL}:predict`;

    // what a request body
    const requestBody = {
      instances: [
        {
          task_type: "CLUSTERING",
          content: text,
        },
      ],
    };

    // sendprediction request
    const response = await axios.post(apiUrl, requestBody, {
      headers: {
        Authorization: `Bearer ${token.token}`,
        "Content-Type": "application/json",
      },
    });

    console.log(">>> response.data", response.data);

    return response.data.predictions[0].embeddings;
  } catch (error) {
    console.error("Error generating embedding:", error);
    throw error;
  }
}

// for kludge testing
const testString = "test embedding";
generateEmbedding(testString)
  .then(embedding => {
    console.log("Successfully generated embedding:", embedding);
  })
  .catch(error => {
    console.error("Failed to generate embedding:", error);
  });
