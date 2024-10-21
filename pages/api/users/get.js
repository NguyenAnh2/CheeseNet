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
    const { uid, search } = req.query;
    try {
      const client = await connectToDatabase();
      const database = client.db("cheese_net");
      const collection = database.collection("users");
      let result;

      if (!uid && !search) {
        result = await collection.find({}).toArray();
      } else if (uid) {
        result = await collection.findOne({ uid });
      } else if (search) {
        result = await collection.findOne({
          $or: [
            { username: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
            { phonenumber: { $regex: search, $options: "i" } },
          ],
        });
      }

      res.status(200).json(result);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "Có lỗi khi lấy thông tin người dùng." });
    }
  } else {
    res.status(405).json({ error: "Method not allowed." });
  }
}
