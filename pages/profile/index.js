import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCamera,
  faClose,
  faPencil,
  faEllipsis,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import Layout from "../../components/layout";
import Heading from "../../components/heading";
import Head from "next/head";
import ParentOpenMessage from "../../components/parent_open_message";
import SideRight from "../../components/sidebar_right";
import { useAuth } from "../../components/auth";
import { useState, useEffect, useMemo } from "react";
import { ref, get, update, child, remove } from "firebase/database";
import { database } from "../../firebase/firebaseConfig";
import Image from "next/image";
import TabBar from "../../components/custom/tabbar";

export default function Profile() {
  const [user, setUser] = useState([]);
  const [posts, setPosts] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isChangeUsername, setIsChangeUsername] = useState(false);
  const [changeUsername, setChangeUsername] = useState();
  const [isChangePhoneNumber, setIsChangePhoneNumber] = useState(false);
  const [changePhoneNumber, setChangePhoneNumber] = useState();
  const [isModalDelete, setIsModalDelete] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [isDeleteSuccess, setIsDeleteSuccess] = useState(false);
  const [error, setError] = useState("");
  const { userId } = useAuth();

  const fetchUserInfo = async () => {
    if (userId) {
      try {
        const response = await fetch(`/api/users?uid=${userId}`, {
          method: "GET",
        });

        if (response.ok) {
          const entries = await response.json();
          setUser(entries);
        } else {
          const errorData = await response.json();
          setError(errorData.error);
        }
      } catch (error) {
        setError("Failed to fetch posts entries.");
        console.error("Error fetching posts:", error);
      }
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, [userId]);

  const fetchPostsOfUser = async () => {
    if (userId) {
      try {
        const response = await fetch(`/api/posts?userId=${userId}`, {
          method: "GET",
        });

        if (response.ok) {
          const entries = await response.json();
          setPosts(entries);
        } else {
          const errorData = await response.json();
          setError(errorData.error);
        }
      } catch (error) {
        setError("Failed to fetch posts entries.");
        console.error("Error fetching posts:", error);
      }
    }
  };

  useEffect(() => {
    fetchPostsOfUser();
  }, [userId]);

  const sortedPosts = useMemo(() => {
    return posts.sort((a, b) => b.timestamp - a.timestamp);
  }, [posts]);

  const handleSubmitProfile = (e) => {
    e.preventDefault();
    const updates = {
      username: changeUsername || user['0']["username"],
      phonenumber: changePhoneNumber || user['0']["phonenumber"],
      avatar: selectedImage || user['0']["avatar"],
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

  const createdTime = () => {
    if (user['0']['createdAt']) {
      let date = new Date(user["createdAt"]);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const hours = date.getHours();
      const minutes = date.getMinutes();
      return `${hours}:${minutes} ngày ${day}/${month}/${year}`;
    }
    return "";
  }

  const timeAgo = (timestamp) => {
    const now = Date.now(); // Lấy thời gian hiện tại
    const secondsPast = (now - timestamp) / 1000;

    if (secondsPast < 60) {
      return `${Math.floor(secondsPast)} giây trước`;
    } else if (secondsPast < 3600) {
      return `${Math.floor(secondsPast / 60)} phút trước`;
    } else if (secondsPast < 86400) {
      return `${Math.floor(secondsPast / 3600)} giờ trước`;
    } else {
      return `${Math.floor(secondsPast / 86400)} ngày trước`;
    }
  };

  const handleModalDelete = (postId) => {
    setSelectedPostId(postId);
    setIsModalDelete(!isModalDelete);
  };

  const handleDeletePost = (postId) => {
    const postRef = ref(database, `posts/${userId}/post/${postId}`);
    remove(postRef)
      .then(() => {
        setIsDeleteSuccess(true);
        setIsModalDelete(!isModalDelete);
      })
      .catch((error) => {
        console.error("Lỗi khi xóa post:", error);
      });
  };

  return (
    <Layout>
      <Head>
        <title>Profile</title>
      </Head>
      <Heading />
      <ParentOpenMessage />

      <TabBar />

      <div className="relative top-32 w-[40%] left-[100%] translate-x-[-175%] h-fit mb-36 duration-300  text-white group cursor-pointer bg-[#DCDFE4] dark:bg-[#22272B] rounded-3xl p-4 hover:bg-blue-200 hover:dark:bg-[#0C66E4]">
        <div className="w-[100%] flex flex-col justify-center items-center">
          <div>
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-pink-300 my-4">
                Thông tin cá nhân
              </h1>
              {(isChangePhoneNumber || isChangeUsername || selectedImage) && (
                <button
                  onClick={handleSubmitProfile}
                  className="text-pink-200 bg-blue-600 hover:bg-blue-400 h-fit px-2 py-1 text-xl rounded-md transition-all"
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
                    defaultValue={user['0']['username']}
                    className="border border-slate-300 p-2 rounded text-black"
                    name="changeUsername"
                    onChange={(e) => setChangeUsername(e.target.value)}
                  />
                ) : (
                  <span className="mx-2 font-semibold">{user['0']["username"]}</span>
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
              Email: <span className="mx-2 font-semibold">{user['0']["email"]}</span>
            </div>
            <div className="flex justify-between items-center w-full">
              <div className="py-2">
                Số điện thoại:
                {isChangePhoneNumber ? (
                  <input
                    type="text"
                    defaultValue={user['0']['phonenumber']}
                    className="border border-slate-300 p-2 rounded text-black"
                    name="changePhoneNumber"
                    onChange={(e) => setChangePhoneNumber(e.target.value)}
                  />
                ) : (
                  <span className="mx-2 font-semibold">
                    {user['0']["phonenumber"]}
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
                    src={selectedImage || user['0']["avatar"]}
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

      {sortedPosts.length > 0 ? (
        <div>
          {sortedPosts.map((post) => (
            <div className="relative w-[40%] left-[100%] translate-x-[-175%] block">
              <div className="flex justify-between items-center mb-5 border-b px-2 py-3">
                <div className="flex flex-col" title={user && user.username}>
                  <div className="flex">
                    <Image
                      src={user ? user.avatar : "/images/icon.jpg"}
                      alt="avatarUser"
                      className="rounded-full mr-3 w-8 h-8 object-cover"
                      width={30}
                      height={30}
                    />
                    <p>{user ? user.username : "Unknown User"}</p>
                  </div>
                  <p className="text-xs mt-3 text-slate-600">
                    {timeAgo(post.timestamp)}
                  </p>
                </div>
                <div
                  className="cursor-pointer px-2 py-6"
                  onClick={() => handleModalDelete(post.postId)}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </div>
              </div>
              <div
                className={`border-b mb-2 ${post.image ? "mb-20" : "mb-5"} px-3`}
              >
                <div className="mb-5">{post.content}</div>
                {post.image && (
                  <Image
                    src={post.image}
                    alt="imageOfPost"
                    className="w-full block cursor-pointer hover:scale-[1.2] bg-white z-[1000000] transition-all"
                    width={100}
                    height={100}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="relative w-[40%] left-[100%] translate-x-[-175%] block">
          Bạn chưa đăng bài viết nào, hãy thử đăng nhé!
        </p>
      )}

      {isModalDelete && (
        <div className="fixed top-[30%] right-2/4 translate-x-[50%] bg-white border shadow-xl rounded-lg px-8 pb-10 pt-6">
          <p className="mb-10">
            <strong>Bạn có chắc chắn muốn xóa bài biết này không?</strong>
          </p>
          <div className="absolute right-2 bottom-2">
            <button
              className="red-btn px-2 py-1 font-semibold rounded mx-1"
              onClick={() => setIsModalDelete(false)}
            >
              Hủy
            </button>
            <button
              className="green-btn px-2 py-1 font-semibold rounded mx-1"
              onClick={(e) => handleDeletePost(selectedPostId)}
            >
              Xóa
            </button>
          </div>
        </div>
      )}

      {isDeleteSuccess && (
        <div className="fixed top-[30%] right-2/4 translate-x-[50%] bg-white border shadow-xl rounded-lg px-8 pb-10 pt-6">
          <p className="mb-10">
            <strong>Vừa xóa bài thành công rồi!</strong>
          </p>
          <div className="absolute right-2 bottom-2">
            <button
              className="green-btn px-2 py-1 font-semibold rounded mx-1"
              onClick={() => setIsDeleteSuccess(!isDeleteSuccess)}
            >
              Ok boi
            </button>
          </div>
        </div>
      )}
      <SideRight />
    </Layout>
  );
}
