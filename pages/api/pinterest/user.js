import fetch from "node-fetch";

export default async function handler(req, res) {
  const { code } = req.query;

  if (!code) {
    return res.status(400).send("Code is missing");
  }

  const encoded = Buffer.from(
    `${process.env.NEXT_PUBLIC_PINTEREST_APP_ID}:${process.env.NEXT_PUBLIC_PINTEREST_APP_SECRET}`
  ).toString("base64");

  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code: code,
    redirect_uri: process.env.NEXT_PUBLIC_PINTEREST_REDIRECT_URI,
  });

  try {
    const tokenResponse = await fetch(
      "https://api.pinterest.com/v5/oauth/token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${encoded}`,
        },
        body: body,
      }
    );

    const tokenBodyText = await tokenResponse.text();

    if (!tokenResponse.ok) {
      return res.status(tokenResponse.status).json({
        error: "Failed to fetch access token",
        details: tokenBodyText,
      });
    }

    const tokenData = JSON.parse(tokenBodyText);
    const expiresAt = Date.now() + 60 * 24 * 60 * 1000;
    res.status(200).json({
      message: "Access token saved to session",
      accessToken: tokenData.access_token,
      expiresAt,
    });
  } catch (error) {
    console.error("Error fetching token:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
