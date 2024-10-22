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

  if (req.method === "DELETE") {
    const { uid, friendId } = req.body;

    if (!uid || !friendId) {
      return res
        .status(400)
        .json({ message: "User ID and Friend ID are required." });
    }

    try {
      // Xóa bạn bè khỏi cả hai tài khoản
      await usersCollection.updateOne(
        { uid },
        {
          $pull: { friends: friendId },
        }
      );

      await usersCollection.updateOne(
        { uid: friendId },
        {
          $pull: { friends: uid },
        }
      );

      return res.status(200).json({ message: "Friend removed successfully." });
    } catch (error) {
      console.error("Error removing friend:", error);
      return res.status(500).json({
        message: "Có lỗi khi xóa bạn bè.",
        error,
      });
    }
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
}
