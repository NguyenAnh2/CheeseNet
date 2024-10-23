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

async function saveUserToMongoDB(
  uid,
  username,
  email,
  avatar,
  phonenumber,
  diary_password,
  receivedFriendRequests,
  sentFriendRequests,
  friends,
) {
  const client = await connectToDatabase();
  const database = client.db("cheese_net");
  const collection = database.collection("users");

  const result = await collection.insertOne({
    uid,
    username,
    email,
    avatar,
    phonenumber,
    diary_password,
    receivedFriendRequests,
    sentFriendRequests,
    friends,
    createdAt: Date.now(),
  });

  return result;
}

async function updateUserDiaryPassword(uid, diary_password) {
  const client = await connectToDatabase();
  const database = client.db("cheese_net");
  const collection = database.collection("users");

  const result = await collection.updateOne(
    { uid },
    { $set: { diary_password } }
  );

  return result;
}

async function updateUserDiaryInfo(
  uid,
  username,
  avatar,
  phonenumber,
  receivedFriendRequests,
  sentFriendRequests,
  friends,
  updatedAt
) {
  const client = await connectToDatabase();
  const database = client.db("cheese_net");
  const collection = database.collection("users");

  const result = await collection.updateOne(
    { uid },
    {
      $set: {
        username,
        avatar,
        phonenumber,
        receivedFriendRequests,
        sentFriendRequests,
        friends,
        updatedAt,
      },
    }
  );

  return result;
}

export default async function handler(req, res) {
  if (req.method === "POST") {
    const {
      uid,
      username,
      email,
      avatar,
      diary_password,
      phonenumber,
      receivedFriendRequests,
      sentFriendRequests,
      friends,
      updatedAt,
    } = req.body;

    try {
      if (username && email) {
        await saveUserToMongoDB(
          uid,
          username,
          email,
          avatar,
          phonenumber,
          diary_password,
          receivedFriendRequests,
          sentFriendRequests,
          friends,
          updatedAt
        );
        return res
          .status(201)
          .json({ message: "Người dùng mới đã được lưu thành công" });
      }

      if (!username && !email && !avatar && !phonenumber) {
        const result = await updateUserDiaryPassword(uid, diary_password);
        if (result.modifiedCount === 0) {
          return res.status(404).json({ error: "Cập nhật thất bại." });
        }
        return res
          .status(200)
          .json({ message: "Cập nhật password thành công." });
      }

      const result = await updateUserDiaryPassword(uid, diary_password);
      const resultInfo = await updateUserDiaryInfo(
        uid,
        username,
        avatar,
        phonenumber,
        receivedFriendRequests,
        sentFriendRequests,
        friends,
        updatedAt
      );

      if (result.modifiedCount === 0 && resultInfo.modifiedCount === 0) {
        return res.status(404).json({ error: "Cập nhật thất bại." });
      }

      return res
        .status(200)
        .json({ message: "Cập nhật thông tin thành công." });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: "Method not allowed." });
  }
}
