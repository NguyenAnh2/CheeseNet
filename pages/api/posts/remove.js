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
  if (req.method === "DELETE") {
    const client = await connectToDatabase();
    const database = client.db("cheese_net");
    const collection = database.collection("posts");

    const { postId } = req.query;

    if (!postId) {
      return res.status(400).json({ error: "Post ID is required ", postId });
    }

    try {
      const result = await collection.deleteOne({ _id: new ObjectId(postId) });

      if (result.deletedCount === 1) {
        res.status(200).json({ message: "Post deleted successfully!" });
      } else {
        res.status(404).json({ error: "Post not found" });
      }
    } catch (error) {
      console.error("MongoDB error", error);
      res.status(500).json({
        error: "An error occurred while deleting the post entry.",
        _id,
      });
    }
  }
}
