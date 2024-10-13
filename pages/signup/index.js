import { useState } from "react";
import { database } from "../../firebase/firebaseConfig";
import { ref, set } from "firebase/database";
import {
  auth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "../../firebase/firebaseConfig";
import Link from "next/link";

const RegisterForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repassword, setRepassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

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
            alert(
              "Tạo tài khoản thành công. Chúc bạn có trải nghiệm tốt với CheeseNet"
            );
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

  return (
    <>
      {/* <Link href="/">
        <FontAwesomeIcon icon={faArrowLeft} className="mt-5 ml-5 text-2xl" />
      </Link> */}
      <form
        className="relative flex flex-col px-6 py-8 -translate-x-2/4 left-2/4 w-11/12 border-2 translate-y-1/4 rounded-lg"
        onSubmit={handleRegister}
      >
        <div className="flex my-3 items-center">
          <label className="w-3/12" for="inputUsername">
            Nhập tên người dùng
          </label>
          <input
            id="inputUsername"
            type="text"
            className="w-full py-2 px-3 rounded-md border"
            placeholder="Tên người dùng"
            autoComplete="false"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="flex my-3 items-center">
          <label className="w-3/12" for="inputUsername">
            Nhập email
          </label>
          <input
            type="email"
            placeholder="Email"
            className="w-full py-2 px-3 rounded-md border"
            autoComplete="false"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="flex my-3 items-center">
          <label className="w-3/12" for="inputUsername">
            Nhập mật khẩu
          </label>
          <input
            type="password"
            placeholder="Mật khẩu"
            className="w-full py-2 px-3 rounded-md border"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="flex my-3 items-center">
          <label className="w-3/12" for="inputUsername">
            Nhập lại mật khẩu
          </label>
          <input
            type="password"
            placeholder="Nhập lại mật khẩu"
            className="w-full py-2 px-3 rounded-md border"
            autoComplete="new-password"
            value={repassword}
            onChange={(e) => setRepassword(e.target.value)}
          />
        </div>
        <div className="">
          {password !== repassword ? (
            <div className="left-0 text-red-500 my-3">
              Mật khẩu chưa trùng khớp
            </div>
          ) : (
            <button className={buttonStyle} type="submit">
              Đăng ký
            </button>
          )}
        </div>
        <div className="flex absolute right-0 bottom-0 mb-3">
          <p className="">Bạn đã có tài khoản?</p>
          <Link className="text-blue-600 right-0 mr-3 ml-1" href="/login">
            Đăng nhập
          </Link>
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </>
  );
};

export default RegisterForm;
