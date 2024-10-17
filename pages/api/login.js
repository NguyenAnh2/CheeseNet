import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/firebaseConfig";
import cookie from "cookie";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { email, password } = req.body;

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      if (!user.emailVerified) {
        return res.status(403).json({
          error:
            "Email chưa được xác thực. Vui lòng kiểm tra email và xác nhận tài khoản của bạn.",
        });
      }

      const idToken = await user.getIdToken();
      const refreshToken = user.refreshToken;

      // Thiết lập cookie httpOnly cho idToken và refreshToken
      res.setHeader("Set-Cookie", [
        cookie.serialize("userToken", idToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 60 * 60,
          path: "/",
        }),
        cookie.serialize("refreshToken", refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 30 * 24 * 60 * 60, 
          path: "/",
        }),
      ]);

      res
        .status(200)
        .json({ message: "Đăng nhập thành công!", user: user, status: true });
    } catch (error) {
      res.status(401).json({ error: "Email hoặc mật khẩu không chính xác" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
