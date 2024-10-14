import React from "react";
import styled from "styled-components";
import { useState } from "react";
import { database } from "../../firebase/firebaseConfig";
import { ref, set } from "firebase/database";
import {
  auth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "../../firebase/firebaseConfig";
import Link from "next/link";
import styles from "../../pages/signup/SignUp.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repassword, setRepassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const buttonStyle =
    "px-3 py-2 bg-blue-400 hover:bg-blue-300 active:bg-yellow-200 font-bold rounded my-3 mx-3";

  const handleRegister = (e) => {
    e.preventDefault();

    // Đăng ký người dùng với email và mật khẩu
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;

        sendEmailVerification(user)
          .then(() => {
            alert("Email xác nhận đã được gửi. Vui lòng kiểm tra hộp thư.");
          })
          .catch((error) => {
            console.error("Error sending email verification:", error);
            setError("Gửi email xác nhận thất bại. Vui lòng thử lại.");
          });

        // Lưu thông tin người dùng vào bảng 'users' trong Firebase Realtime Database
        set(ref(database, "users/" + user.uid), {
          username: username,
          email: email,
          uid: user.uid,
          avatar: "/images/defaultavatar.jpg",
          createdAt: Date.now(),
        })
          .then(() => {
            window.location.href = "/login";
          })
          .catch((error) => {
            console.error("Error saving user info:", error);
            setError(error);
          });
      })
      .catch((error) => {
        console.error("Registration error:", error);
        setError(error);
      });
  };

  const ToggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex justify-center items-center mt-16 ">
      <form className={styles.form} onSubmit={handleRegister}>
        <p className={styles.title}>Đăng ký </p>
        <p className={styles.message}>
          Đăng ký để trải nghiệm toàn bộ ứng dụng
        </p>
        <label>
          <input
            className={styles.input}
            type="text"
            placeholder=""
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="false"
          />
          <span>Nhập tên người dùng</span>
        </label>

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
          <div className="absolute top-[0%] right-0 w-10 flex justify-center items-center text-black h-full cursor-pointer select-none">
            <FontAwesomeIcon
              icon={faEye}
              onClick={ToggleShowPassword}
              className=""
            />
          </div>
        </label>
        <label className="relative flex">
          <input
            className={styles.input}
            type="password"
            placeholder=""
            required
            value={repassword}
            onChange={(e) => setRepassword(e.target.value)}
            autoComplete="false"
          />
          <span>Nhập lại password</span>
          <div className="absolute top-[0%] right-0 w-10 flex justify-center items-center text-black h-full cursor-pointer select-none">
            <FontAwesomeIcon
              icon={faEye}
              onClick={ToggleShowPassword}
              className=""
            />
          </div>
        </label>
        <button className={styles.submit}>Đăng ký</button>
        <p className={styles.signin}>
          Bạn đã có tài khoản?{" "}
          <Link className="blue-600 right-0 mr-3 ml-1" href="/login">
            Đăng nhập
          </Link>{" "}
        </p>
      </form>
    </div>
  );
};

export default SignUp;
