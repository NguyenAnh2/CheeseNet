import sql from "mssql";

const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  options: {
    trustServerCertificate: true, // Chỉ cần nếu đang sử dụng tự chứng thực
  },
};

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { userId, iv, encryptedData, timestamp } = req.body;
    try {
      // Kết nối tới cơ sở dữ liệu
      const pool = await sql.connect(dbConfig);

      // Thực hiện truy vấn để lưu nhật ký
      const sqlQuery = `
                INSERT INTO diary (userId, iv, encryptedData, timestamp)
                VALUES (@UserId, @Iv, @EncryptedData, @timestamp)
            `;
      await pool
        .request()
        .input("userId", sql.NVarChar, userId)
        .input("iv", sql.NVarChar, iv)
        .input("encryptedData", sql.NVarChar, encryptedData)
        .input("timestamp", sql.BigInt, timestamp)
        .query(sqlQuery);

      res.status(201).json({ message: "Diary entry saved successfully!" });
      
    } catch (error) {
      console.error("SQL error", error);
      res
        .status(500)
        .json({ error: "An error occurred while saving the diary entry." });
    } finally {
      // Đóng kết nối
      await sql.close();
    }
  }
  // Xử lý GET request để lấy dữ liệu
  else if (req.method === "GET") {
    const { userId } = req.query;

    try {
      const pool = await sql.connect(dbConfig);
      const result = await pool
        .request()
        .input("UserId", sql.NVarChar, userId)
        .query("SELECT * FROM diary WHERE userId = @UserId");

      res.status(200).json(result.recordset); // Trả về kết quả cho client
    } catch (error) {
      console.error("SQL error", error);
      res.status(500).json({
        error: "An error occurred while retrieving the diary entries.",
      });
    } finally {
      await sql.close();
    }
  } else {
    res.setHeader("Allow", ["POST", "GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
