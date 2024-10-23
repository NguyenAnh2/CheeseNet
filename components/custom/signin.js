import React from "react";
import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useAuth } from "../../components/auth";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../firebase/firebaseConfig";
import styles from "../../pages/signup/SignUp.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";

const SignIn = () => {
  const router = useRouter();
  const { login } = useAuth();
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
          {messageFail ? (
            <p className="text-red-500">{messageFail}</p>
          ) : (
            <p className="text-green-500">{messageSuccess}</p>
          )}
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
              width={18}
              height={18}
              icon={faEye}
              onClick={ToggleShowPassword}
              className=""
            />
          </div>
        </label>
        <button className={`${styles.submit} py-3`}>Đăng nhập</button>
        <div className="flex justify-between">
          <div>
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
