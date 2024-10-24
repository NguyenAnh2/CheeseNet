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
    try {
      const { userId } = req.query;

      if (!userId) {
        return res.status(400).json({ error: "User ID is required." });
      } else {
        const client = await connectToDatabase();
        const database = client.db("cheese_net");

        // Lấy thông tin người dùng hiện tại từ bảng users
        const usersCollection = database.collection("users");
        const currentUser = await usersCollection.findOne({ uid: userId });

        if (!currentUser) {
          return res.status(404).json({ error: "User not found." });
        }

        const friendsList = currentUser.friends || []; // Lấy danh sách bạn bè

        // Tạo query để lọc bài viết dựa trên visibility
        const postsCollection = database.collection("posts");
        const query = {
          $or: [
            { visibility: "public" }, // Bài viết public
            {
              visibility: "friends", // Bài viết của bạn bè
              userId: { $in: friendsList },
            },
            { userId: userId }, // Bài viết của chính người dùng
          ],
        };

        // Tìm và trả về các bài viết phù hợp
        const posts = await postsCollection.find(query).toArray();

        res.status(200).json(posts);
      }
    } catch (error) {
      console.error("Error fetching Posts:", error);
      res.status(500).json({ error: "Có lỗi khi lấy thông tin bài viết." });
    }
  } else {
    res.status(405).json({ error: "Method not allowed." });
  }
}
