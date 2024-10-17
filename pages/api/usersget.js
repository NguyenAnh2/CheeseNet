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
    const { uid } = req.query;
    try {
      const client = await connectToDatabase();
      const database = client.db("cheese_net");
      const collection = database.collection("users");
      let result;

      if (!uid) {
        result = await collection.find({}).toArray();
      } else {
        result = await collection.findOne({ uid });
      }

      res.status(200).json(result);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "Có lỗi khi lấy thông tin người dùng." });
    }
  }
}
