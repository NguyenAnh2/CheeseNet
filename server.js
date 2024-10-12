const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const axios = require("axios");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { initializeApp } = require("firebase/app");
const { getAuth, signInWithEmailAndPassword } = require("firebase/auth");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json());

const secretKey = process.env.SECERET_KEY;
const apiKeyGenimi = process.env.API_KEY_GEMINI;


const firebaseConfig = {
  apiKey: "AIzaSyAeYHPcJQWjRex1PPbA7sB9ih8E_GWVXVs",
  authDomain: "cheesenet-593a4.firebaseapp.com",
  databaseURL:
    "https://cheesenet-593a4-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "cheesenet-593a4",
  storageBucket: "cheesenet-593a4.appspot.com",
  messagingSenderId: "807603139428",
  appId: "1:807603139428:web:3c96424b49c504541a4071",
  measurementId: "G-LS36XNH6HG",
};

const auth = getAuth(initializeApp(firebaseConfig));

const genAI = new GoogleGenerativeAI(apiKeyGenimi); // Thay thế bằng API key của bạn

app.get("/api/chat", async (req, res) => {
  const test = req.body;
  res.json(test.message);
});

app.post("/api/chat", async (req, res) => {
  const prompt = req.body;
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  try {
    const result = await model.generateContent(prompt.message);
    const response = result.response;
    const text = response.text();

    res.json({ text });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: `Đã xảy ra lỗi khi xử lý yêu cầu. ${error}` });
  }
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;

      // Lấy ID token và refresh token
      user.getIdToken().then((idToken) => {
        const refreshToken = userCredential.user.refreshToken;

        // Thiết lập cookie httpOnly cho idToken và refreshToken
        res.cookie("userToken", idToken, {
          httpOnly: true, // Chỉ server mới truy cập được
          secure: true, // Chỉ truyền qua HTTPS
          maxAge: 60 * 60 * 1000, // Thời hạn 1 giờ
        });

        res.cookie("refreshToken", refreshToken, {
          httpOnly: true, // Chỉ server mới truy cập được
          secure: true, // Chỉ truyền qua HTTPS
          maxAge: 30 * 24 * 60 * 60 * 1000, // Thời hạn 30 ngày cho refresh token
        });

        // Phản hồi thành công
        res
          .status(200)
          .send({ message: "Đăng nhập thành công!", user: user, status: true});
      });
    })
    .catch((error) => {
      res.status(401).send({ error: "Email hoặc mật khẩu không chính xác" });
    });
});

app.post("/refresh-token", (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).send({ error: "Không tìm thấy refresh token" });
  }

  // Gửi yêu cầu làm mới token tới Firebase
  axios
    .post(
      `https://securetoken.googleapis.com/v1/token?key=AIzaSyAeYHPcJQWjRex1PPbA7sB9ih8E_GWVXVs`,
      {
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      }
    )
    .then((response) => {
      const newIdToken = response.data.id_token;
      const newRefreshToken = response.data.refresh_token; // Firebase có thể trả lại refresh token mới

      // Cập nhật cookie với token mới
      res.cookie("userToken", newIdToken, {
        httpOnly: true,
        secure: true,
        maxAge: 60 * 60 * 1000, // 1 giờ
      });

      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: true,
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 ngày
      });

      // Phản hồi thành công với token mới
      res.status(200).send({ message: "Token đã được làm mới thành công" });
    })
    .catch((error) => {
      console.error("Lỗi làm mới token:", error);
      res.status(401).send({ error: "Lỗi làm mới token" });
    });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
