// import { MongoClient, ObjectId } from "mongodb";

// let client;
// let clientPromise;

// async function connectToDatabase() {
//   if (!clientPromise) {
//     client = new MongoClient(process.env.MONGODB_URI);
//     clientPromise = client.connect();
//   }
//   return clientPromise;
// }

// export default async function handler(req, res) {
//   if (req.method === "POST") {
//     const client = await connectToDatabase();
//     const database = client.db("cheese_net");
//     const collection = database.collection("posts");

//     const { userId, content, image, likes, timestamp } = req.body;

//     try {
//       const result = await collection.insertOne({
//         userId,
//         content,
//         image,
//         likes,
//         timestamp,
//       });

//       res.status(201).json({
//         message: "Potst entry saved successfully!",
//         id: result.insertedId,
//       });
//     } catch (error) {
//       console.error("MongoDB error", error);
//       res
//         .status(500)
//         .json({ error: "An error occurred while saving the posts entry." });
//     } finally {
//       await client.close();
//     }
//   } else if (req.method === "GET") {
//     const client = await connectToDatabase();
//     const database = client.db("cheese_net");
//     const collection = database.collection("posts");

//     const { userId, postId } = req.query;

//     try {
//       let query = {};

//       if (userId) {
//         query.userId = userId;
//       }

//       if (postId) {
//         query._id = new ObjectId(postId);
//       }

//       const postsEntry = await collection.find(query).toArray();

//       res.status(200).json(postsEntry);
//     } catch (error) {
//       console.error("MongoDB error", error);
//       res.status(500).json({
//         error: "An error occurred while retrieving the posts entries.",
//       });
//     } finally {
//       await client.close();
//     }
//   } else if (req.method === "DELETE") {
//     const client = await connectToDatabase();
//     const database = client.db("cheese_net");
//     const collection = database.collection("posts");

//     const { postId } = req.query;

//     if (!postId) {
//       return res.status(400).json({ error: "Post ID is required ", postId });
//     }

//     try {
//       const result = await collection.deleteOne({ _id: new ObjectId(postId) });

//       if (result.deletedCount === 1) {
//         res.status(200).json({ message: "Post deleted successfully!" });
//       } else {
//         res.status(404).json({ error: "Post not found" });
//       }
//     } catch (error) {
//       console.error("MongoDB error", error);
//       res.status(500).json({
//         error: "An error occurred while deleting the post entry.",
//         _id,
//       });
//     }
//   } else if (req.method === "PUT") {
//     const client = await connectToDatabase();
//     const database = client.db("cheese_net");
//     const collection = database.collection("posts");

//     const { postId, userId } = req.body;

//     try {
//       // Tìm bài viết theo postId và kiểm tra xem người dùng đã like chưa
//       const post = await collection.findOne({ _id: new ObjectId(postId) });

//       if (!post) {
//         return res.status(404).json({ error: "Post not found" });
//       }

//       // Kiểm tra xem người dùng đã like hay chưa
//       const hasLiked = post.likes.some((like) => like.userId === userId);

//       let updatedLikes;

//       if (hasLiked) {
//         // Nếu người dùng đã like, thì xóa "like" của họ
//         updatedLikes = post.likes.filter((like) => like.userId !== userId);
//       } else {
//         // Nếu chưa like, thêm "like" của người dùng
//         updatedLikes = [...post.likes, { userId, like_at: Date.now() }];
//       }

//       // Cập nhật bài viết với danh sách likes mới
//       const result = await collection.updateOne(
//         { _id: new ObjectId(postId) },
//         { $set: { likes: updatedLikes } }
//       );

//       if (result.modifiedCount === 1) {
//         res.status(200).json({ message: "Post updated successfully!" });
//       } else {
//         res.status(400).json({ error: "Failed to update post" });
//       }
//     } catch (error) {
//       console.error("MongoDB error", error);
//       res
//         .status(500)
//         .json({ error: "An error occurred while updating the post." });
//     } finally {
//       await client.close();
//     }
//   } else {
//     res.setHeader("Allow", ["POST", "GET"]);
//     res.status(405).end(`Method ${req.method} Not Allowed`);
//   }
// }
