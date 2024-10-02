const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const API_BASE_URL = process.env.API_BASE_URL;
const AURA_AUTH_URL = process.env.AURA_AUTH_URL;

if (!CLIENT_ID || !CLIENT_SECRET || !API_BASE_URL || !AURA_AUTH_URL) {
  throw new Error("Required environment variables are not set");
}

export async function getAuraAccessToken(): Promise<string> {
  const response = await fetch(AURA_AUTH_URL!, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: CLIENT_ID!,
      client_secret: CLIENT_SECRET!,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to obtain Aura access token");
  }

  const data = await response.json();
//   console.log("yum", data);
  return data.access_token;
}
