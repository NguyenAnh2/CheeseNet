import {
  faClose,
  faEllipsis,
  faReply,
} from "@fortawesome/free-solid-svg-icons";
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
  const [error, setError] = useState('')
  const [modalImage, setModalImage] = useState(null);
  const { userId } = useAuth();

  const fetchPosts = async () => {
    try {
      const response = await fetch(`/api/posts`, {
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
      setCurrentTime(Date.now());
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white">
      {posts
        .sort((a, b) => b.timestamp - a.timestamp)
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
                {/* {user.uid === userId && (
                  <FontAwesomeIcon icon={faEllipsis} />
                )} */}
              </div>
              <div className="border-b mb-2 pb-5 px-3">
                <div className="mb-2">{post.content}</div>
                {post.image && (
                  <Image
                    src={post.image}
                    alt="imageOfPost"
                    className="w-full block cursor-pointer transition-transform hover:scale-[1.2]"
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
