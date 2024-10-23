import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
let client;

async function connectToDatabase() {
  if (!client) {
    client = new MongoClient(uri);
    await client.connect();
    console.log("Connected to MongoDB");
  }
  return client;
}

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const { userId, postId } = req.query;
      const client = await connectToDatabase();
      const database = client.db("cheese_net");
      const collection = database.collection("posts");
      let query = {};

      if (userId) {
        query.userId = userId;
      }

      if (postId) {
        query._id = new ObjectId(postId);
      }

      const result = await collection.find(query).toArray();

      res.status(200).json(result);
    } catch (error) {
      console.error("Error fetching Posts:", error);
      res.status(500).json({ error: "Có lỗi khi lấy thông tin bài viết." });
    }
  } else {
    res.status(405).json({ error: "Method not allowed." });
  }
}
