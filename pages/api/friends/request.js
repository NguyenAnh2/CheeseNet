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

  const { from, to } = req.body;

  if (!from || !to) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Kiểm tra xem người dùng đã gửi yêu cầu kết bạn chưa
    const sender = await usersCollection.findOne({ uid: from });
    const receiver = await usersCollection.findOne({ uid: to });

    const hasSentRequest = sender.sentFriendRequests.some(
      (request) => request.to === to
    );
    const hasReceivedRequest = receiver.receivedFriendRequests.some(
      (request) => request.from === from
    );

    if (hasSentRequest && hasReceivedRequest) {
      // Nếu đã gửi yêu cầu, sẽ hủy yêu cầu kết bạn
      await usersCollection.updateOne(
        { uid: from },
        { $pull: { sentFriendRequests: { to } } }
      );
      await usersCollection.updateOne(
        { uid: to },
        { $pull: { receivedFriendRequests: { from } } }
      );

      return res.status(200).json({ message: "Friend request cancelled" });
    } else {
      // Nếu chưa gửi yêu cầu, sẽ gửi yêu cầu kết bạn
      await usersCollection.updateOne(
        { uid: from },
        {
          $push: {
            sentFriendRequests: {
              to,
              status: "pending",
              createdAt: new Date().getTime(),
            },
          },
        }
      );

      await usersCollection.updateOne(
        { uid: to },
        {
          $push: {
            receivedFriendRequests: {
              from,
              status: "pending",
              createdAt: new Date().getTime(),
            },
          },
        }
      );

      return res.status(200).json({ message: "Friend request sent" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Failed to toggle friend request" });
  }
}
