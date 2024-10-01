import { NextResponse } from "next/server";
import { getAuraAccessToken } from "@/lib/auth";
const API_BASE_URL = process.env.API_BASE_URL;

async function performInstanceAction(
  instanceId: string,
  action: "resume" | "pause"
) {
  const accessToken = await getAuraAccessToken();
  const response = await fetch(
    `${API_BASE_URL}/instances/${instanceId}/${action}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        "Cache-Control": "no-cache",
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to ${action} instance ${instanceId}`);
  }
  console.log("yum", response);
  return response.json();
}

export async function POST(request: Request) {
  try {
    const { instanceId, action } = await request.json();

    if (!instanceId || !action) {
      return NextResponse.json(
        { error: "Missing instanceId or action" },
        { status: 400 }
      );
    }

    if (action !== "resume" && action !== "pause") {
      return NextResponse.json(
        { error: "Invalid action. Must be 'resume' or 'pause'" },
        { status: 400 }
      );
    }

    const result = await performInstanceAction(instanceId, action);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Error in Neo4j instance action:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
