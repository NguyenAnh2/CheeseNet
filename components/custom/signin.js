import React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useGlobal } from "../../components/global_context";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../firebase/firebaseConfig";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import RandomImageBackground from "./custom_bg";

const SignIn = () => {
  const router = useRouter();
  const { login } = useGlobal();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [messageFail, setMessageFail] = useState("");
  const [messageSuccess, setMessageSuccess] = useState("");

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
        login(data.user.uid);
        router.push("/");
      } else {
        setMessageFail("Lỗi, vui lòng kiểm tra lại thông tin!");
      }
    } catch (error) {
      setMessageFail("Error:", error);
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
    const tokenRefreshInterval = setInterval(
      () => {
        refreshUserToken();
      },
      60 * 60 * 1000
    );

    return () => clearInterval(tokenRefreshInterval);
  }, []);

  const ToggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleResetPassword = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      setMessageFail("Vui lòng nhập email để lấy lại mật khẩu.");
    } else if (!emailRegex.test(email)) {
      setMessageFail("Vui lòng nhập địa chỉ email hợp lệ.");
    } else {
      try {
        sendPasswordResetEmail(auth, email);
        setMessageSuccess(
          "Email đặt lại mật khẩu đã được gửi. Vui lòng kiểm tra hộp thư của bạn."
        );
      } catch (error) {
        setMessageFail(`Lỗi khi gửi email: ${error.message}`);
      }
    }
  };

  return (
    <div className="flex justify-center items-center mt-16 ">
      <RandomImageBackground />
      <form className="form-sign-up" onSubmit={handleLogin}>
        <p className="title-sign-up">Đăng nhập </p>
        <p className="message-sign-up">Đăng nhập và trải nghiệm ứng dụng</p>

        <label>
          <input
            className="input-sign-up"
            type="email"
            placeholder=""
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="false"
          />
          <span>Email</span>
          {messageFail ? (
            <p className="text-red-500">{messageFail}</p>
          ) : (
            <p className="text-green-500">{messageSuccess}</p>
          )}
        </label>

        <label className="relative flex">
          <input
            className="input-sign-up"
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
              width={18}
              height={18}
              icon={faEye}
              onClick={ToggleShowPassword}
              className=""
            />
          </div>
        </label>
        <button className={`submit-sign-up`}>Đăng nhập</button>
        <div className="flex justify-between">
          <div>
            <p className="signin-sign-up">
              Bạn chưa có tài khoản?{" "}
              <Link className="blue-600 right-0 mr-3 ml-1" href="/signup">
                Đăng ký
              </Link>{" "}
            </p>
          </div>
          <button
            type="button"
            className="text-red-500"
            onClick={handleResetPassword}
          >
            Quên mật khẩu?
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignIn;
