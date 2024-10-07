import { NextResponse } from "next/server";
import { getAuraAccessToken } from "@/lib/auth";

const API_BASE_URL = process.env.API_BASE_URL;

async function fetchInstanceDetails(instanceId: string, accessToken: string) {
  const detailsResponse = await fetch(
    `https://api.neo4j.io/v1/instances/${instanceId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        "Cache-Control": "no-cache",
      },
    }
  );

  if (!detailsResponse.ok) {
    throw new Error(`Failed to fetch details for instance ${instanceId}`);
  }

  return await detailsResponse.json();
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const requestId = searchParams.get('requestId');
  console.log(`GET request received for /api/neo4j-proxy. Request ID: ${requestId}`);
  
  try {
    const accessToken = await getAuraAccessToken();
    console.log("Access token obtained");

    console.log("Fetching instances from:", `${API_BASE_URL}/instances`);

    const apiResponse = await fetch(`${API_BASE_URL}/instances`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        "Cache-Control": "no-cache",
      },
    });

    const responseText = await apiResponse.text();

    if (!apiResponse.ok) {
      throw new Error(
        `Failed to fetch instances: ${apiResponse.status} ${apiResponse.statusText}\n${responseText}`
      );
    }

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error("Error parsing JSON:", parseError);
      throw new Error(`Failed to parse API response: ${responseText}`);
    }

    const instanceDetails = await Promise.all(
      data.data.map(async (instance: any) => {
        const details = await fetchInstanceDetails(instance.id, accessToken);
        return details.data;
      })
    );

    return NextResponse.json({ instances: instanceDetails }, { status: 200 });
  } catch (error) {
    console.error("Detailed error in Neo4j proxy:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
