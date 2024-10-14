import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera, faClose, faPencil } from "@fortawesome/free-solid-svg-icons";
import Layout from "../../components/layout";
import Heading from "../../components/heading";
import Head from "next/head";
import ParentOpenMessage from "../../components/parent_open_message";
import SideRight from "../../components/sidebar_right";
import { useAuth } from "../../components/auth";
import { useState, useEffect } from "react";
import { ref, get, update, child } from "firebase/database";
import { database } from "../../firebase/firebaseConfig";

export default function Profile() {
  const [user, setUser] = useState([]);
  const [createdTime, setCreatedTime] = useState("");

  const [selectedImage, setSelectedImage] = useState(null);
  const [isChangeUsername, setIsChangeUsername] = useState(false);
  const [changeUsername, setChangeUsername] = useState();
  const [isChangePhoneNumber, setIsChangePhoneNumber] = useState(false);
  const [changePhoneNumber, setChangePhoneNumber] = useState();
  const { userId } = useAuth();

  useEffect(() => {
    if (userId) {
      const dbRef = ref(database);
      get(child(dbRef, `users/${userId}`))
        .then((snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val();
            setUser(data);
          } else {
            console.log("No data available");
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [userId]);

  const getDateTime = () => {
    let date = new Date(user["createdAt"]);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    setCreatedTime(`${hours}:${minutes} ngày ${day}/${month}/${year}`);
  };

  useEffect(() => {
    setUser(user);
    getDateTime();
    console.log(user);
  }, [user]);

  const handleSubmitProfile = (e) => {
    e.preventDefault();
    const updates = {
      username: changeUsername || user["username"],
      phonenumber: changePhoneNumber || user["phonenumber"],
      avatar: selectedImage || user["avatar"],
      updatedAt: Date.now(),
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
  };

  const handleAddImage = () => {
    document.getElementById("imageToChange").click();
  };

  const handleChangeFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result); // Lưu URL ảnh để preview
      };
      reader.readAsDataURL(file); // Đọc nội dung của file ảnh
    }
  };

  const cancelChangeAvatar = () => {
    setSelectedImage(null);
  };

  const handleIsChangeUsername = () => {
    setIsChangeUsername(!isChangeUsername);
  };

  const handleIsChangePhoneNumber = () => {
    setIsChangePhoneNumber(!isChangePhoneNumber);
  };

  return (
    <Layout>
      <Head>
        <title>Profile</title>
      </Head>
      <Heading />
      <ParentOpenMessage />
      <div className="relative top-20 w-[40%] left-[100%] translate-x-[-175%] duration-300 font-mono text-white group cursor-pointer  overflow-hidden bg-[#DCDFE4] dark:bg-[#22272B] rounded-3xl p-4  hover:bg-blue-200 hover:dark:bg-[#0C66E4]">
        <div className="w-[100%] flex flex-col justify-center items-center">
          <div>
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-pink-300 my-4">
                Thông tin cá nhân
              </h1>
              {(isChangePhoneNumber || isChangeUsername || selectedImage) && (
                <button
                  onClick={handleSubmitProfile}
                  className="text-pink-200 bg-blue-600 hover:bg-blue-400 h-fit px-2 py-1 text-xl rounded-md"
                >
                  Lưu
                </button>
              )}
            </div>
            <div className="flex justify-between items-center">
              <div className="py-2">
                Tên người dùng:{" "}
                {isChangeUsername ? (
                  <input
                    type="text"
                    defaultValue={user.username}
                    className="border border-slate-300 p-2 rounded"
                    name="changeUsername"
                    onChange={(e) => setChangeUsername(e.target.value)}
                  />
                ) : (
                  <span className="mx-2 font-semibold">{user["username"]}</span>
                )}
              </div>
              {isChangeUsername ? (
                <FontAwesomeIcon
                  icon={faClose}
                  className="cursor-pointer"
                  onClick={handleIsChangeUsername}
                />
              ) : (
                <FontAwesomeIcon
                  icon={faPencil}
                  className="cursor-pointer"
                  onClick={handleIsChangeUsername}
                />
              )}
            </div>
            <div className="py-2">
              Email: <span className="mx-2 font-semibold">{user["email"]}</span>
            </div>
            <div className="flex justify-between items-center w-full">
              <div className="py-2">
                Số điện thoại:
                {isChangePhoneNumber ? (
                  <input
                    type="text"
                    defaultValue={user.phonenumber}
                    className="border border-slate-300 p-2 rounded"
                    name="changePhoneNumber"
                    onChange={(e) => setChangePhoneNumber(e.target.value)}
                  />
                ) : (
                  <span className="mx-2 font-semibold">
                    {user["phonenumber"]}
                  </span>
                )}
              </div>
              {isChangePhoneNumber ? (
                <FontAwesomeIcon
                  icon={faClose}
                  className="cursor-pointer"
                  onClick={handleIsChangePhoneNumber}
                />
              ) : (
                <FontAwesomeIcon
                  icon={faPencil}
                  className="cursor-pointer"
                  onClick={handleIsChangePhoneNumber}
                />
              )}
            </div>
            <div className="flex flex-col">
              <div className="flex flex-col py-2 relative">
                <p className="mb-3">Ảnh đại diện</p>
                {selectedImage && (
                  <FontAwesomeIcon
                    icon={faClose}
                    className="absolute right-[95px] top-[40px] text-xl cursor-pointer"
                    onClick={cancelChangeAvatar}
                  />
                )}
                <div className="relative w-60 h-60 object-cover cursor-pointer rounded-full overflow-hidden">
                  <img
                    src={selectedImage || user["avatar"]}
                    alt="Preview"
                    className=""
                  />
                  <div
                    className="absolute rounded-full top-0 right-0 bottom-0 left-0 hover:bg-slate-200 opacity-40 hover:flex justify-center items-center"
                    onClick={handleAddImage}
                  >
                    <input
                      id="imageToChange"
                      name="imageToChange"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleChangeFile(e)}
                      multiple
                    />
                    <FontAwesomeIcon icon={faCamera} className="w-8 h-8" />
                  </div>
                </div>
              </div>
            </div>
            <div className="py-2 text-slate-500">
              Tài khoản được tạo vào: {createdTime}
            </div>
          </div>
        </div>
      </div>
      <SideRight />
    </Layout>
  );
}
