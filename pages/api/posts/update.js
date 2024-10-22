import { MongoClient, ObjectId } from "mongodb"; // Đảm bảo ObjectId được import

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
  if (req.method === "PUT") {
    const client = await connectToDatabase();
    const database = client.db("cheese_net");
    const collection = database.collection("posts");

    const { postId, userId, visibility } = req.body; // Nhận cả userId và visibility từ body

    try {
      const post = await collection.findOne({ _id: new ObjectId(postId) });

      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }

      let result;

      if (visibility) {
        // Nếu yêu cầu có chứa visibility, cập nhật visibility
        result = await collection.updateOne(
          { _id: new ObjectId(postId) },
          { $set: { visibility: visibility } } // Chỉ cập nhật visibility
        );
      } else {
        // Logic xử lý likes
        const hasLiked = post.likes.some((like) => like.userId === userId);

        let updatedLikes;

        if (hasLiked) {
          // Nếu người dùng đã like, thì xóa "like" của họ
          updatedLikes = post.likes.filter((like) => like.userId !== userId);
        } else {
          // Nếu chưa like, thêm "like" của người dùng
          updatedLikes = [...post.likes, { userId, like_at: Date.now() }];
        }

        // Cập nhật bài viết với danh sách likes mới
        result = await collection.updateOne(
          { _id: new ObjectId(postId) },
          { $set: { likes: updatedLikes } }
        );
      }

      if (result.modifiedCount === 1) {
        res.status(200).json({ message: "Post updated successfully!" });
      } else {
        res.status(400).json({ error: "Failed to update post" });
      }
    } catch (error) {
      console.error("MongoDB error", error);
      res
        .status(500)
        .json({ error: "An error occurred while updating the post." });
    }
  } else {
    res.status(405).json({ error: "Method not allowed." });
  }
}
