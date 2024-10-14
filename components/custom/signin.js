import React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useAuth } from "../../components/auth";
import styles from "../../pages/signup/SignUp.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";

const SignIn = () => {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

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
        alert("Lỗi, vui lòng kiểm tra lại thông tin!");
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

  const ToggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex justify-center items-center mt-16 ">
      <form className={styles.form} onSubmit={handleLogin}>
        <p className={styles.title}>Đăng nhập </p>
        <p className={styles.message}>Đăng nhập và trải nghiệm ứng dụng</p>

        <label>
          <input
            className={styles.input}
            type="email"
            placeholder=""
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="false"
          />
          <span>Email</span>
        </label>

        <label className="relative flex">
          <input
            className={styles.input}
            type={showPassword ? "text" : "password"}
            placeholder=""
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="false"
          />
          <span>Password</span>
          <div className="absolute top-[0%] right-0 w-12 flex justify-center items-center text-black h-full cursor-pointer select-none">
            <FontAwesomeIcon
              icon={faEye}
              onClick={ToggleShowPassword}
              className=""
            />
          </div>
        </label>
        <button className={styles.submit}>Đăng nhập</button>
        <p className={styles.signin}>
          Bạn chưa có tài khoản?{" "}
          <Link className="blue-600 right-0 mr-3 ml-1" href="/signup">
            Đăng ký
          </Link>{" "}
        </p>
        <div className="flex relative right-0 bottom-0 my-1">
          <p className="">Đăng nhập với </p>
          <p
            className="text-blue-600 right-0 mx-2"
            // onClick={() => handleLoginGoogle()}
          >
            Google
          </p>
        </div>
      </form>
    </div>
  );
};

export default SignIn;
