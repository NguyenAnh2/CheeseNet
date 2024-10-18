import fetch from "node-fetch";

export default async function handler(req, res) {
  const { searchPinterest } = req.query;

  if (!searchPinterest) {
    return res.status(400).json({ error: "Search term is missing" });
  }
//   ?.split(" ")[1]
  const accessToken = req.headers.authorization;

  if (!accessToken) {
    return res.status(401).json({ error: "Access token is missing" });
  }
//   https://www.pinterest.com/search/pins/?q=Sky&rs=typed
  try {
    const response = await fetch(
      `https://api.pinterest.com/v5/search/pins/?query=${encodeURIComponent(searchPinterest)}&access_token=${accessToken}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch search results");
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching search results:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
