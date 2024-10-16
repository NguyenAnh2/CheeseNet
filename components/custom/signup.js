import React from "react";
import { useState, useEffect } from "react";
import { database } from "../../firebase/firebaseConfig";
import { ref, set, get, update, child, remove } from "firebase/database";
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
  const [isRegistered, setIsRegistered] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== repassword) {
      setError("Mật khẩu không khớp. Vui lòng thử lại.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      sendEmailVerification(user);
      alert("Email xác nhận đã được gửi. Vui lòng kiểm tra hộp thư.");

      const intervalId = setInterval(async () => {
        await user.reload();
        if (user.emailVerified) {
          clearInterval(intervalId);
          alert("Xác thực thành công!");
          setIsRegistered(true);

          set(ref(database, "users/" + user.uid), {
            username: username,
            email: email,
            uid: user.uid,
            avatar: "/images/defaultavatar.jpg",
            diary_password: null,
            phonenumber: null,
            createdAt: Date.now(),
          });
        }
      }, 10000);
    } catch (error) {
      console.error("Registration error:", error);
      setError(error.message);
    }
  };

  useEffect(() => {
    const checkEmailVerification = async () => {
      const user = auth.currentUser;

      if (user) {
        try {
          const response = await fetch("/api/users/post", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              uid: user.uid,
              username: username,
              email: email,
              avatar: "/images/defaultavatar.jpg",
              diary_password: null,
              phonenumber: null,
              createdAt: Date.now(),
            }),
          });

          if (response.ok) {
            window.location.href = "/login";
          } else {
            const errorData = await response.json();
            setError(errorData.error);
          }
        } catch (error) {
          console.error("Error calling API:", error);
          setError("Có lỗi khi lưu thông tin vào MSSQL.");
        }
      }
    };

    checkEmailVerification();
  }, [isRegistered]);

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
