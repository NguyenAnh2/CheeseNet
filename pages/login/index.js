import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useAuth } from "../../components/auth";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email, password: password }),
      });
      const data = await response.json();
      if (data.status) {
        // Gọi hàm login để lưu userId và token vào Context và localStorage
        login(data.user.uid);
        router.push("/");
      } else {
        alert("Vui lòng kiểm tra lại tài khoản và mật khẩu!");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const refreshUserToken = async () => {
    try {
      const response = await fetch("/refresh-token", {
        method: "POST",
        credentials: "include", // Đảm bảo cookies được gửi kèm
      });

      if (response.ok) {
        console.log("Token đã được làm mới thành công");
      } else {
        console.error("Lỗi khi làm mới token");
      }
    } catch (error) {
      console.error("Lỗi khi gọi API làm mới token:", error);
    }
  };

  useEffect(() => {
    // Làm mới token mỗi 1 giờ
    const tokenRefreshInterval = setInterval(
      () => {
        refreshUserToken();
      },
      60 * 60 * 1000
    ); // 1 giờ

    // Xóa interval khi component bị unmount
    return () => clearInterval(tokenRefreshInterval);
  }, []);

  return (
    <>
      <div className="relative flex flex-col px-6 py-8 -translate-x-2/4 left-2/4 w-11/12 border-2 translate-y-1/4 rounded-lg">
        <h2 className="text-2xl font-bold my-3">Đăng nhập</h2>
        <form className="" onSubmit={handleLogin}>
          <div className="flex my-3 items-center">
            <label className="w-3/12">Nhập Email:</label>
            <input
              type="email"
              value={email}
              className="w-full py-2 px-3 rounded-md border"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="flex my-3 items-center">
            <label className="w-3/12">Nhập mật khẩu:</label>
            <input
              type="password"
              value={password}
              className="w-full py-2 px-3 rounded-md border"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {
            <button
              className="bg-slate-300 px-2 py-3 hover:bg-slate-200 active:bg-yellow-200 font-bold text-xl rounded transition-all"
              type="submit"
            >
              Đăng nhập
            </button>
          }

          {error && <p style={{ color: "red" }}>{error}</p>}
        </form>

        <div className="flex relative right-0 bottom-0 mb-1 mt-3">
          <p className="">Bạn chưa có tài khoản?</p>
          <Link className="text-blue-600 right-0 mx-2" href="/signup">
            Đăng ký
          </Link>
        </div>

        <div className="flex relative right-0 bottom-0 my-1">
          <p className="">Đăng nhập với </p>
          <p
            className="text-blue-600 right-0 mx-2"
            // onClick={() => handleLoginGoogle()}
          >
            Google
          </p>
        </div>
      </div>
    </>
  );
}
