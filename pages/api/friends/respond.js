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
  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const client = await connectToDatabase();
  const database = client.db("cheese_net");
  const usersCollection = database.collection("users");

  const { from, to, action } = req.body; // action là 'accept' hoặc 'decline'

  if (!from || !to || !action) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    if (action === "accept") {
      // Kiểm tra nếu hai người đã là bạn bè
      const fromUser = await usersCollection.findOne({ uid: from });
      const toUser = await usersCollection.findOne({ uid: to });

      if (!fromUser || !toUser) {
        return res.status(404).json({ error: "User not found" });
      }

      if (fromUser.friends.includes(to) || toUser.friends.includes(from)) {
        return res.status(400).json({ error: "Users are already friends" });
      }

      // Chấp nhận yêu cầu kết bạn, cập nhật bạn bè cho cả hai người
      await usersCollection.updateOne(
        { uid: from },
        {
          $push: { friends: to },
          $pull: { sentFriendRequests: { to } }, // Xóa yêu cầu đã gửi
        }
      );
      await usersCollection.updateOne(
        { uid: to },
        {
          $push: { friends: from },
          $pull: { receivedFriendRequests: { from } }, // Xóa yêu cầu nhận
        }
      );
    } else if (action === "decline") {
      // Từ chối yêu cầu kết bạn, chỉ xóa yêu cầu
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
    console.error(`Error processing friend request: ${error}`);
    return res
      .status(500)
      .json({ error: `Failed to ${action} friend request` });
  }
}
