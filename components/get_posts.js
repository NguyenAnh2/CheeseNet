import { faClose, faReply } from "@fortawesome/free-solid-svg-icons";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { useAuth } from "./auth";
import { useState, useRef, useEffect } from "react";
import Checkbox from "./custom/checkbox";
import { ref, get, remove, update, child } from "firebase/database";
import { database } from "../firebase/firebaseConfig";

export default function GetPosts() {
  const [isLike, setIsLike] = useState(false);
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [modalImage, setModalImage] = useState(null);
  const { userId } = useAuth();

  const toggleLikePost = () => {
    const postIdToLike = document.getElementById("icon_like_id");
    // Thêm class animate-jump
    postIdToLike.classList.add("animate-like");

    // Sau 0.5 giây loại bỏ class
    setTimeout(() => {
      postIdToLike.classList.remove("animate-like");
    }, 500);
    setIsLike(!isLike);
  };

  const fetchPosts = async () => {
    const postsRef = ref(database, `posts/`);
    try {
      const snapshot = await get(postsRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        const allPosts = [];
        Object.keys(data).forEach((userId) => {
          if (data[userId].post) {
            allPosts.push(...Object.values(data[userId].post));
          }
        });
        setPosts(allPosts);
      } else {
        setPosts([]);
      }
    } catch (error) {
      console.error("Error fetching messages: ", error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [userId]);

  useEffect(() => {
    const dbRef = ref(database);
    get(child(dbRef, `users`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          // Chuyển đổi object từ snapshot.val() thành mảng
          const usersArray = Object.keys(snapshot.val()).map((key) => ({
            uid: key, // Lưu lại key làm id cho từng bản ghi
            ...snapshot.val()[key], // Thêm các giá trị khác từ object
          }));
          setUsers(usersArray);
        } else {
          console.log("No data available");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const openModal = (image) => {
    setModalImage(image); // Cập nhật ảnh được chọn cho modal
  };

  const closeModal = () => {
    setModalImage(null); // Đóng modal
  };

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

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now()); // Cập nhật thời gian hiện tại mỗi giây
    }, 6000);

    // Clear interval khi component bị unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white">
      {posts
        .sort((a, b) => b.timestamp - a.timestamp) // Sắp xếp theo timestamp (mới nhất lên đầu)
        .map((post) => {
          const user = users.find((user) => user.uid === post.userId);
          return (
            <div className="flex flex-col border rounded-md my-6 sm:w-full">
              <div className="flex justify-between mb-5 border-b px-2 py-3">
                <div className="flex flex-col" title={user && user.username}>
                  <div className="flex">
                    <Image
                      src={user ? user.avatar : "/images/icon.jpg"}
                      alt="avatarUser"
                      className="rounded-full mr-3 w-8 h-8 "
                      width={30}
                      height={30}
                    />
                    <p>{user ? user.username : "Unknown User"}</p>
                  </div>
                  <p className="text-xs mt-3 text-slate-600">{timeAgo(post.timestamp)}</p>
                </div>
                <div></div>
              </div>
              <div className="border-b mb-2 pb-5 px-3">
                <div>{post.content}</div>
                {post.image && (
                  <Image
                    src={post.image}
                    alt="imageOfPost"
                    className="w-full block cursor-pointer"
                    width={100}
                    height={100}
                    onClick={() => openModal(post.image)}
                  />
                )}
              </div>

              {modalImage && (
                <div
                  //
                  className="fixed inset-x-[-116%] inset-y-custom-modal pt-40 flex items-center justify-center bg-black bg-opacity-30 z-[100] cursor-pointer"
                  onClick={closeModal} // Đóng modal khi nhấp bên ngoài
                >
                  <img
                    src={modalImage}
                    alt="Modal Preview"
                    className="max-[50%] max-h-[50%] rounded"
                    onClick={(e) => e.stopPropagation()} // Ngăn chặn sự kiện click từ ảnh
                  />
                  <FontAwesomeIcon
                    icon={faClose}
                    className="absolute text-white z-[100] text-2xl top-0 right-3 cursor-pointer"
                  />
                </div>
              )}

              <div className="flex px-3 items-center mb-1">
                <Checkbox />
                <FontAwesomeIcon
                  icon={faReply}
                  className="mx-2 text-blue-400"
                />
              </div>
            </div>
          );
        })}
    </div>
  );
}
