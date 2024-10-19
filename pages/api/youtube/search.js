export default async function handler(req, res) {
  // const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=shorts&maxResults=10&videoDuration=short&regionCode=VN&key=${process.env.NEXT_PUBLIC_YOUTUBE_API_KEY}`;

  const { index } = req.query; // Nhận index từ query parameters
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=shorts&maxResults=1&videoDuration=short&regionCode=VN&key=${process.env.NEXT_PUBLIC_YOUTUBE_API_KEY}&pageToken=${index || ""}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);

    if (response.ok) {
      res.status(200).json(data);
    } else {
      res
        .status(response.status)
        .json({ message: "Error fetching data from YouTube API" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
}
