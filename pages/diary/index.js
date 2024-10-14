import Layout from "../../components/layout";
import Heading from "../../components/heading";
import ParentOpenMessage from "../../components/parent_open_message";
import SideRight from "../../components/sidebar_right";
import TabBar from "../../components/custom/tabbar";
import Head from "next/head";
import { ref, get, update, child, remove } from "firebase/database";
import { database } from "../../firebase/firebaseConfig";
import { useAuth } from "../../components/auth";
import { useState, useEffect, useRef } from "react";

export default function Diary() {
  const [user, setUser] = useState([]);
  const [isMatchPassword, setIsMatchPassword] = useState(false);
  const { userId } = useAuth();

  useEffect(() => {
    const dbRef = ref(database);
    get(child(dbRef, `users/${userId}`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          setUser(data);
        } else {
          setUser([]);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, [userId]);

  useEffect(() => {
    setUser(user);
  }, [user]);

  const inputRefs1 = useRef([]);
  const inputRefs2 = useRef([]);
  const [isMatch, setIsMatch] = useState(null);

  const handleInputChange = (e, index, group) => {
    const { value } = e.target;
    const inputRefs = group === 1 ? inputRefs1.current : inputRefs2.current;

    if (value.length === 1 && index < inputRefs.length - 1) {
      inputRefs[index + 1].focus(); // Chuyển focus sang ô tiếp theo
    }
  };

  const handleKeyDown = (e, index, group) => {
    const inputRefs = group === 1 ? inputRefs1.current : inputRefs2.current;

    if (e.key === "Backspace" && index > 0 && e.target.value === "") {
      inputRefs[index - 1].focus(); // Quay lại ô trước
      inputRefs[index - 1].value = ""; // Xóa giá trị của ô trước
    }
  };

  const handleComparePasswords = () => {
    const password1 = inputRefs1.current.map((input) => input.value).join("");
    const password2 = inputRefs2.current.map((input) => input.value).join("");
    if (password1 && password2) {
      if (password1 === password2) {
        setIsMatch(true); // Mật khẩu khớp
        const updates = {
          diary_password: password1,
        };

        const userRef = ref(database, `users/${userId}`);

        update(userRef, updates)
          .then(() => {
            alert("Update thành công!");
            window.location.reload();
          })
          .catch((error) => {
            console.error("Lỗi khi cập nhật dữ liệu: ", error);
          });
      } else {
        setIsMatch(false); // Mật khẩu không khớp, reset input
        inputRefs1.current.forEach((input) => (input.value = ""));
        inputRefs2.current.forEach((input) => (input.value = ""));
        inputRefs1.current[0].focus(); // Chuyển focus về ô đầu tiên
      }
    }
  };

  const handleGetPasswords = () => {
    if (user.diary_password) {
      const password = inputRefs1.current.map((input) => input.value).join("");
      const passwordDiaryOfUser = user.diary_password;
      if (password === passwordDiaryOfUser) {
        setIsMatchPassword(true);
      }
    }
  };

  return (
    <Layout>
      <Head>
        <title>Diary</title>
      </Head>
      <Heading />
      <ParentOpenMessage />

      <TabBar />
      {!isMatchPassword && (
        <div>
          {user.diary_password ? (
            <div className="absolute top-[-100%] right-0 bottom-0 left-0 bg-slate-800 opacity-65">
              <div className="fixed top-[20%] left-2/4 translate-x-[-50%] flex justify-center items-center flex-col">
                <p className="text-black font-bold text-3xl mb-3">
                  Nhập password:
                </p>
                <div className="flex">
                  {[...Array(6)].map((_, index) => (
                    <input
                      key={`password1-${index}`}
                      type="password"
                      maxLength={1}
                      className="w-16 h-16 border-r-4 px-1 text-2xl custom-input"
                      ref={(el) => (inputRefs1.current[index] = el)}
                      onInput={(e) => handleInputChange(e, index, 1)}
                      onKeyDown={(e) => handleKeyDown(e, index, 1)}
                    />
                  ))}
                </div>
                <button
                  className="mt-5 px-4 py-2 bg-blue-500 text-white rounded"
                  onClick={handleGetPasswords}
                >
                  Xác nhận
                </button>
              </div>
            </div>
          ) : (
            <div className="absolute top-[-100%] right-0 bottom-0 left-0 bg-slate-800 opacity-65">
              <div className="fixed top-[20%] left-2/4 translate-x-[-50%] flex justify-center items-center flex-col">
                <p className="text-black font-bold text-3xl mb-3">
                  Tạo password:
                </p>
                <div className="flex">
                  {[...Array(6)].map((_, index) => (
                    <input
                      key={`password1-${index}`}
                      type="password"
                      maxLength={1}
                      className="w-16 h-16 border-r-4 px-1 text-2xl custom-input"
                      ref={(el) => (inputRefs1.current[index] = el)}
                      onInput={(e) => handleInputChange(e, index, 1)}
                      onKeyDown={(e) => handleKeyDown(e, index, 1)}
                    />
                  ))}
                </div>
                <p className="text-black font-bold text-3xl mb-3 mt-5">
                  Nhập lại password:
                </p>
                <div className="flex">
                  {[...Array(6)].map((_, index) => (
                    <input
                      key={`password2-${index}`}
                      type="password"
                      maxLength={1}
                      className="w-16 h-16 border-r-4 px-1 text-2xl custom-input"
                      ref={(el) => (inputRefs2.current[index] = el)}
                      onInput={(e) => handleInputChange(e, index, 2)}
                      onKeyDown={(e) => handleKeyDown(e, index, 2)}
                    />
                  ))}
                </div>
                <button
                  className="mt-5 px-4 py-2 bg-blue-500 text-white rounded"
                  onClick={handleComparePasswords}
                >
                  Xác nhận
                </button>
                {isMatch === true && (
                  <p className="text-green-500 mt-3">Mật khẩu khớp!</p>
                )}
                {isMatch === false && (
                  <p className="text-red-500 mt-3">
                    Mật khẩu không khớp. Vui lòng thử lại.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      )}
      {isMatchPassword && (
        <div className="relative top-7 w-[40%] left-[100%] translate-x-[-175%] h-fit mb-28 duration-300  text-white group cursor-pointer bg-[#DCDFE4] dark:bg-[#22272B] rounded-3xl p-4 hover:bg-blue-200 hover:dark:bg-[#0C66E4]"></div>
      )}
      <SideRight />
    </Layout>
  );
}
