import sql from "mssql";

const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  options: {
    encrypt: true,
    trustServerCertificate: true,
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

async function saveUserToMSSQL(uid, username, email) {
  const pool = await connectToDatabase();
  await pool
    .request()
    .input("uid", sql.NVarChar, uid)
    .input("username", sql.NVarChar, username)
    .input("email", sql.NVarChar, email)
    .input("createdAt", sql.BigInt, Date.now())
    .query(
      `INSERT INTO Users (uid, username, email, createdAt) 
           VALUES (@uid, @username, @email, @createdAt)`
    );
}

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { uid, username, email } = req.body;

    if (!uid || !username || !email) {
      return res.status(400).json({ error: "Thiếu thông tin." });
    }

    try {
      await saveUserToMSSQL(uid, username, email);
      res.status(201).json({ message: "Người dùng đã được lưu thành công" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else if (req.method === "GET") {
    const { uid } = req.query;
    try {
      const pool = await connectToDatabase();
      let result;
      if (!uid) {
        result = await pool.request().query(`SELECT * FROM Users`);
      } else {
        result = await pool
          .request()
          .input("uid", sql.NVarChar, uid)
          .query(`SELECT * FROM Users WHERE uid = @uid`);
      }
      res.status(200).json(result.recordset);
    } catch (error) {
      console.error("Error fetching posts:", error);
      res.status(500).json({ error: "Có lỗi khi lấy thông tin người dùng." });
    }
  } else {
    res.status(405).json({ error: "Method not allowed." });
  }
}
