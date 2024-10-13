import axios from "axios";
import cookie from "cookie";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const cookies = req.headers.cookie;
    if (!cookies) {
      return res.status(401).json({ error: "Không tìm thấy refresh token" });
    }

    const parsedCookies = cookie.parse(cookies);
    const refreshToken = parsedCookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ error: "Không tìm thấy refresh token" });
    }

    try {
      const response = await axios.post(
        `https://securetoken.googleapis.com/v1/token?key=AIzaSyAeYHPcJQWjRex1PPbA7sB9ih8E_GWVXVs`,
        {
          grant_type: "refresh_token",
          refresh_token: refreshToken,
        }
      );

      const newIdToken = response.data.id_token;
      const newRefreshToken = response.data.refresh_token;

      // Cập nhật cookie với token mới
      res.setHeader("Set-Cookie", [
        cookie.serialize("userToken", newIdToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 60 * 60, // 1 giờ
          path: "/",
        }),
        cookie.serialize("refreshToken", newRefreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 30 * 24 * 60 * 60, // 30 ngày
          path: "/",
        }),
      ]);

      // Phản hồi thành công với token mới
      res.status(200).json({ message: "Token đã được làm mới thành công" });
    } catch (error) {
      console.error("Lỗi làm mới token:", error);
      res.status(401).json({ error: "Lỗi làm mới token" });
    }
  } else {
    // Phương thức không được hỗ trợ
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
