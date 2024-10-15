import sql from "mssql";

// Cấu hình kết nối tới MSSQL
const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  options: {
    encrypt: true, // Sử dụng nếu bạn kết nối qua giao thức an toàn
    trustServerCertificate: true, // Bật lên nếu máy chủ có chứng chỉ tự tạo
  },
};

let poolPromise;

async function connectToDatabase() {
  if (!poolPromise) {
    poolPromise = sql
      .connect(dbConfig)
      .then((pool) => {
        console.log("Connected to MSSQL");
        return pool;
      })
      .catch((err) => {
        console.error("Database Connection Failed", err);
        poolPromise = null; // Reset pool nếu lỗi
        throw err;
      });
  }
  return poolPromise;
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
};

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { userId, content, image } = req.body;
    const timestamp = Date.now();

    if (!userId || !content) {
      return res.status(400).json({ error: "Thiếu userId hoặc content." });
    }

    try {
      const pool = await connectToDatabase();

      await pool
        .request()
        .input("userId", sql.NVarChar, userId)
        .input("content", sql.NText, content)
        .input("image", sql.NVarChar, image || null)
        .input("timestamp", sql.BigInt, timestamp)
        .query(
          `INSERT INTO Posts (userId, content, image, timestamp) 
           VALUES (@userId, @content, @image, @timestamp)`
        );

      res.status(201).json({ message: "Bài viết đã được lưu thành công" });
    } catch (error) {
      console.error("Error saving post:", error);
      res.status(500).json({ error: "Có lỗi khi lưu bài viết." });
    }
  } else if (req.method === "GET") {
    const { userId } = req.query;
    try {
      const pool = await connectToDatabase();
      let result;
      if (userId) {
        result = await pool
          .request()
          .input("userId", sql.NVarChar, userId)
          .query(
            `SELECT * FROM Posts WHERE userId = @userId ORDER BY timestamp DESC`
          );
      } else {
        result = await pool
          .request()
          .query(`SELECT * FROM Posts ORDER BY timestamp DESC`);
      }
      res.status(200).json(result.recordset);
    } catch (error) {
      console.error("Error fetching posts:", error);
      res.status(500).json({ error: "Có lỗi khi lấy bài viết." });
    }
  } else {
    res.status(405).json({ error: "Method not allowed." });
  }
}
