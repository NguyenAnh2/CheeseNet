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
  if (req.method === "POST") {
    const client = await connectToDatabase();
    const database = client.db("cheese_net");
    const collection = database.collection("posts");

    const { userId, content, image, likes, visibility, timestamp } = req.body;

    try {
      const result = await collection.insertOne({
        userId,
        content,
        image,
        likes,
        visibility,
        timestamp,
      });

      return res.status(201).json({
        message: "Potst entry saved successfully!",
        id: result.insertedId,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: "Method not allowed." });
  }
}
