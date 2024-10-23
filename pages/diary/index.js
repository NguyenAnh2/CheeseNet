import Layout from "../../components/layout";
import TabBar from "../../components/custom/tabbar";
import Head from "next/head";
import Confetti from "react-confetti";
import { useAuth } from "../../components/auth";
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import CryptoJS from "crypto-js";
import crypto from "crypto";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWarning } from "@fortawesome/free-solid-svg-icons";
import Button from "../../components/custom/button";

export default function Diary() {
  const [user, setUser] = useState([]);
  const [isMatchPassword, setIsMatchPassword] = useState(false);
  const [isDiarySuccess, setIsDiarySuccess] = useState(false);
  const [diaryEntries, setDiaryEntries] = useState([]);
  const inputRefs1 = useRef([]);
  const inputRefs2 = useRef([]);
  const [isMatch, setIsMatch] = useState(null);
  const algorithm = "aes-256-cbc";
  const [secretKey, setSecretKey] = useState();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const contentDiaryRef = useRef();
  const { userId } = useAuth();

  const getUser = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/users/get?uid=${userId}`);
      const data = await res.json();
      setUser(data);
    } catch (error) {
      setError("Failed to fetch user data.");
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) getUser();
  }, [userId, getUser]);

  function hashPassword(password) {
    return CryptoJS.SHA256(password).toString();
  }

  const handleInputChange = (e, index, group) => {
    const { value } = e.target;
    const inputRefs = group === 1 ? inputRefs1.current : inputRefs2.current;

    if (value.length === 1 && index < inputRefs.length - 1) {
      inputRefs[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index, group) => {
    const inputRefs = group === 1 ? inputRefs1.current : inputRefs2.current;

    if (e.key === "Backspace" && index > 0 && e.target.value === "") {
      inputRefs[index - 1].focus();
      inputRefs[index - 1].value = "";
    }
  };

  const handleComparePasswords = async () => {
    const password1 = inputRefs1.current.map((input) => input.value).join("");
    const password2 = inputRefs2.current.map((input) => input.value).join("");

    if (password1 && password2) {
      if (password1 === password2) {
        setIsMatch(true);

        const response = await fetch("/api/users/post", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            uid: userId,
            diary_password: hashPassword(password1),
          }),
        });

        const data = await response.json();
        if (response.ok) {
          alert(data.message);
        } else {
          alert(data.error);
        }

        window.location.reload();

        setSecretKey(password1);
      } else {
        setIsMatch(false);
        inputRefs1.current.forEach((input) => (input.value = ""));
        inputRefs2.current.forEach((input) => (input.value = ""));
        inputRefs1.current[0].focus();
      }
    }
  };

  const handleGetPasswords = () => {
    if (user.diary_password) {
      const password = inputRefs1.current.map((input) => input.value).join("");
      const passwordHash = hashPassword(password);
      const passwordDiaryOfUser = user.diary_password;
      if (passwordHash === passwordDiaryOfUser) {
        setIsMatchPassword(true);
        setSecretKey(passwordHash);
      }
    }
  };

  function encrypt(text) {
    const iv = crypto.randomBytes(16);

    const cipher = crypto.createCipheriv(
      algorithm,
      Buffer.from(secretKey, "hex"),
      iv
    );

    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");

    return { iv: iv.toString("hex"), encryptedData: encrypted };
  }

  function decrypt(iv, encryptedData) {
    if (Buffer.from(iv, "hex").length !== 16) {
      throw new Error("Invalid IV length. IV must be 16 bytes for AES.");
    }

    const decipher = crypto.createDecipheriv(
      algorithm,
      Buffer.from(secretKey, "hex"),
      Buffer.from(iv, "hex")
    );

    let decrypted = decipher.update(encryptedData, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  }

  const handleSubmitDiary = async (e) => {
    e.preventDefault();
    const content = encrypt(contentDiaryRef.current.value);
    const iv = content["iv"];
    const encryptedData = content["encryptedData"];

    if (contentDiaryRef.current.value) {
      const newDiary = {
        userId: userId,
        iv: iv,
        encryptedData: encryptedData,
        timestamp: Date.now(),
      };

      try {
        const response = await fetch("/api/diary", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newDiary),
        });

        if (response.ok) {
          setIsDiarySuccess(true);
          contentDiaryRef.current.value = "";
          console.log("Update diary thành công");
        } else {
          console.error("Error sending post:", await response.json());
        }
      } catch (error) {
        console.error("Error sending post:", error);
      }
    }
  };

  const fetchDiaryEntries = useCallback(async () => {
    try {
      const response = await fetch(`/api/diary?userId=${userId}`);
      if (response.ok) {
        const entries = await response.json();
        setDiaryEntries(entries);
      } else {
        const errorData = await response.json();
        setError(errorData.error);
      }
    } catch (error) {
      setError("Failed to fetch diary entries.");
    }
  }, [userId]);

  useEffect(() => {
    if (secretKey) fetchDiaryEntries();
  }, [secretKey, fetchDiaryEntries]);

  const createdTime = (timestamp) => {
    let date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${day}/${month}/${year}`;
  };

  const diariesFinaly = useMemo(() => {
    return diaryEntries
      .map(({ _id, iv, encryptedData, timestamp }) => {
        const contentDecrypt = secretKey ? decrypt(iv, encryptedData) : "";
        return { _id, contentDecrypt, timestamp: createdTime(timestamp) };
      })
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }, [diaryEntries, secretKey]);

  const handleDiaryModalSuccess = () => {
    setIsDiarySuccess(false);
    window.location.reload();
  };

  diariesFinaly.map((diary) => {
    console.log(diary);
  });

  return (
    <Layout>
      <Head>
        <title>Nhập ký</title>
        <link rel="icon" href="/icon.png" />
      </Head>

      <TabBar />

      {isMatchPassword && (
        <div className="relative top-[50%] w-full flex flex-col justify-center items-center">
          <div className="relative bg-galaxy-2 top-[120px] flex flex-col w-[80%] justify-between border rounded-md sm:m-5 mt-32 pr-2 sm:pr-6 pb-8 pt-6 bg-white">
            <form className="bg-galaxy-2" onSubmit={(e) => handleSubmitDiary(e)}>
              <textarea
                ref={contentDiaryRef}
                rows="2"
                className="bg-galaxy-2 w-full overflow-auto text-left p-2 outline-none text-white text-lg font-medium resize-none"
                placeholder="Cùng lưu lại một chút câu chuyện! Yên tâm là không ai có thể đọc chúng. &#x1F609;"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.ctrlKey) {
                    e.preventDefault();
                    handleSubmitDiary(e);
                  }
                }}
              />
              <div className="absolute right-2 bottom-2" onSubmit={handleSubmitDiary}>
                <Button text={'Gửi'}/>
              </div>
            </form>
          </div>

          <div className="relative top-[120px] w-[80%]">
            {diariesFinaly.map((diary) => (
              <div className="relative w-fit h-fit mb-7 duration-300  text-black font-semibold group cursor-pointer bg-[#DCDFE4] dark:bg-[#22272B] rounded-3xl p-4 hover:bg-blue-200 hover:dark:bg-[#0C66E4]">
                <div className="">{diary.timestamp}</div>
                <div>{diary.contentDecrypt}</div>
              </div>
            ))}
          </div>

          {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
      )}

      {!userId && (
        <div className="fixed flex-col top-[64px] bottom-0 left-0 right-0 bg-slate-800 opacity-95 z-[1000] flex justify-center items-center">
          <FontAwesomeIcon
            icon={faWarning}
            className="relative text-yellow-300 "
            width={30}
            height={30}
          />
          <div className="text-2xl font-bold text-red-500">
            Vui lòng đăng nhập để viết nhật ký
          </div>
        </div>
      )}

      {!isMatchPassword && user && (
        <div className="absolute top-[-100%] right-0 bottom-0 left-0 bg-black opacity-80">
          {!isLoading && !user.diary_password ? (
            <div className="">
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
                      autoComplete="off"
                      className="w-16 h-16 border px-1 text-2xl custom-input"
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
                      autoComplete="off"
                      className="w-16 h-16 border px-1 text-2xl custom-input"
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
          ) : (
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
                      autoComplete="off"
                      className="w-16 h-16 border px-1 text-2xl custom-input"
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
          )}
        </div>
      )}

      {isDiarySuccess && <Confetti />}

      {isDiarySuccess && (
        <div className="fixed top-[25%] left-[50%] translate-x-[-50%] w-[370px] h-[140px] border shadow-md bg-white rounded-lg px-3 py-3 z-[10000]">
          <p className="font-bold text-xl">Sẽ là bí mật của riêng bạn! ❤️</p>
          <button
            onClick={handleDiaryModalSuccess}
            className="border px-3 py-2 rounded text-blue-500 bg-slate-600 absolute right-2 bottom-2 font-semibold"
          >
            Nhớ đó!
          </button>
        </div>
      )}
    </Layout>
  );
}
