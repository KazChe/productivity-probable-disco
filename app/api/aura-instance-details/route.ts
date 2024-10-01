import { NextRequest, NextResponse } from "next/server";
import { getAuraAccessToken } from "@/lib/auth"; // Implement this to get your Aura API token

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const instanceId = searchParams.get("instanceId");

  if (!instanceId) {
    return NextResponse.json(
      { message: "Invalid instanceId" },
      { status: 400 }
    );
  }

  try {
    const token = await getAuraAccessToken(); // Implement this function to get your Aura API token
    const auraApiUrl = `https://api.neo4j.io/v1/instances/${instanceId}`;

    const response = await fetch(auraApiUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Cache-Control": "no-cache",
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Aura API responded with status: ${response.status}`);
    }

    const instanceDetails = await response.json();
    return NextResponse.json(instanceDetails);
  } catch (error) {
    console.error("Error fetching instance details:", error);
    return NextResponse.json(
      { message: "Error fetching instance details" },
      { status: 500 }
    );
  }
}
