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

  const { from, to, action } = req.body; // action là 'accept' hoặc 'decline'

  if (!from || !to || !action) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    if (action === "accept") {
      // Thêm bạn bè vào danh sách của cả hai người dùng
      await usersCollection.updateOne(
        { uid: from },
        {
          $push: { friends: to },
          $pull: { sentFriendRequests: { to } },
        }
      );
      await usersCollection.updateOne(
        { uid: to },
        {
          $push: { friends: from },
          $pull: { receivedFriendRequests: { from } },
        }
      );
    } else if (action === "decline") {
      // Xóa yêu cầu kết bạn khỏi cả hai người dùng
      await usersCollection.updateOne(
        { uid: from },
        { $pull: { sentFriendRequests: { to } } }
      );
      await usersCollection.updateOne(
        { uid: to },
        { $pull: { receivedFriendRequests: { from } } }
      );
    }

    return res
      .status(200)
      .json({ message: `Friend request ${action}ed successfully` });
  } catch (error) {
    return res
      .status(500)
      .json({ error: `Failed to ${action} friend request` });
  }
}
