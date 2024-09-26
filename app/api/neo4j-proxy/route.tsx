import { NextResponse } from "next/server";

async function fetchInstanceDetails(instanceId: string, accessToken: string) {
  const detailsResponse = await fetch(`https://api.neo4j.io/v1/instances/${instanceId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!detailsResponse.ok) {
    throw new Error(`Failed to fetch details for instance ${instanceId}`);
  }

  return await detailsResponse.json();
}

export async function GET(request: Request) {
  try {
    // Obtain the access token
    const tokenResponse = await fetch("https://api.neo4j.io/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(
          `${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`
        ).toString("base64")}`,
      },
      body: "grant_type=client_credentials",
    });

    if (!tokenResponse.ok) {
      throw new Error("Failed to obtain access token");
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Fetch the list of instances
    const apiResponse = await fetch("https://api.neo4j.io/v1/instances", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!apiResponse.ok) {
      throw new Error("Failed to fetch instances");
    }

    const data = await apiResponse.json();

    // Fetch details for each instance
    const instanceDetails = await Promise.all(
      data.data.map(async (instance: any) => {
        const details = await fetchInstanceDetails(instance.id, accessToken);
        console.log(details);
        return details.data;
      })
    );

    return NextResponse.json({ instances: instanceDetails }, { status: 200 });
  } catch (error) {
    console.error("Error in Neo4j proxy:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
