import fetch from "node-fetch";

export default async function handler(req, res) {
  const { code } = req.query;

  if (!code) {
    return res.status(400).send("Code is missing");
  }

  const body = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: process.env.NEXT_PUBLIC_PINTEREST_APP_ID,
    client_secret: process.env.NEXT_PUBLIC_PINTEREST_APP_SECRET,
    code: code,
    redirect_uri: process.env.NEXT_PUBLIC_PINTEREST_REDIRECT_URI,
  });

  const tokenResponse = await fetch(
    "https://api.pinterest.com/v5/oauth/token",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body,
    }
  );
  console.log("Token Response Status:", tokenResponse.status);
  const tokenData = await tokenResponse.json();
  console.log("Token response:", tokenData);

  if (tokenData.access_token) {
    const userResponse = await fetch(
      `https://api.pinterest.com/v5/me/?access_token=${tokenData.access_token}`
    );
    const userData = await userResponse.json();
    res.status(200).json(userData);
  } else {
    res
      .status(500)
      .json({ error: "Failed to fetch access token", tokenResponse });
  }
}
