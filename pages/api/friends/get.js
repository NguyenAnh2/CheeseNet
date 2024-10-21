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
  const client = await connectToDatabase();
  const database = client.db("cheese_net");
  const usersCollection = database.collection("users");

  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: "Missing userId" });
  }

  try {
    // Lấy danh sách yêu cầu kết bạn và danh sách bạn bè
    const user = await usersCollection.findOne({ uid: userId });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const { receivedFriendRequests, sentFriendRequests, friends } = user;

    return res.status(200).json({
      receivedFriendRequests,
      sentFriendRequests,
      friends,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Failed to fetch friends or requests" });
  }
}
