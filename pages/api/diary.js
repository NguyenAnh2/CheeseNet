import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { userId, iv, encryptedData, timestamp } = req.body;

    try {
      await client.connect();
      const database = client.db("cheese_net");
      const collection = database.collection("diaries");

      const result = await collection.insertOne({
        userId,
        iv,
        encryptedData,
        timestamp,
      });

      res
        .status(201)
        .json({
          message: "Diary entry saved successfully!",
          id: result.insertedId,
        });
    } catch (error) {
      console.error("MongoDB error", error);
      res
        .status(500)
        .json({ error: "An error occurred while saving the diaries entry." });
    } finally {
      await client.close();
    }
  } else if (req.method === "GET") {
    const { userId } = req.query;

    try {
      await client.connect();
      const database = client.db("cheese_net");
      const collection = database.collection("diaries");

      const diaryEntries = await collection.find({ userId }).toArray();

      res.status(200).json(diaryEntries);
    } catch (error) {
      console.error("MongoDB error", error);
      res
        .status(500)
        .json({
          error: "An error occurred while retrieving the diaries entries.",
        });
    } finally {
      await client.close();
    }
  } else {
    res.setHeader("Allow", ["POST", "GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
