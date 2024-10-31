import axios from "axios";

export default async function handler(req, res) {
  const { query } = req;
  const { page = 1, per_page = 10 } = query; 

  try {
    const response = await axios.get(`https://api.unsplash.com/search/photos`, {
      params: {
        query: query.keyword,
        client_id: process.env.UNSPLASH_ACCESS_KEY,
        per_page: per_page,
        page: page,
      },
    });

    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Có lỗi xảy ra khi gọi API Unsplash" });
  }
}
