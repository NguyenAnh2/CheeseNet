import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCamera,
  faClose,
  faPencil,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import Layout from "../../components/layout";
import Heading from "../../components/heading";
import Head from "next/head";
import ParentOpenMessage from "../../components/parent_open_message";
import SideRight from "../../components/sidebar_right";
import { useAuth } from "../../components/auth";
import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import TabBar from "../../components/custom/tabbar";
import Loader from "../../components/custom/loading";

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
  const [isUpdateSuccess, setIsUpdateSeccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const { userId } = useAuth();

  const fetchUserInfo = async () => {
    try {
      const response = await fetch(`/api/users?uid=${userId}`)
        .then((res) => res.json())
        .then((data) => {
          setUser(data);
          setIsLoading(false);
        })
        .catch(() => {
          const errorData = response.json();
          setError(errorData.error);
          setIsLoading(true);
        });
    } catch (error) {
      setError("Failed to fetch posts entries.");
      console.error("Error fetching posts:", error);
    }
  };

  const fetchPostsOfUser = async () => {
    try {
      const response = await fetch(`/api/posts?userId=${userId}`)
        .then((res) => res.json())
        .then((data) => {
          setPosts(data);
          setIsLoading(false);
        })
        .catch(() => {
          const errorData = response.json();
          setError(errorData.error);
          setIsLoading(true);
        });
    } catch (error) {
      setError("Failed to fetch posts entries.");
      console.error("Error fetching posts:", error);
    }
  };
  useEffect(() => {
    fetchUserInfo();
  }, [userId, isLoading, isUpdateSuccess]);

  useEffect(() => {
    fetchPostsOfUser();
  }, [userId, isLoading]);

  const handleSubmitProfile = async (e) => {
    e.preventDefault();
    const updates = {
      uid: userId,
      username: changeUsername || user.username,
      phonenumber: changePhoneNumber || user.phonenumber,
      avatar: selectedImage || user.avatar,
      updatedAt: Date.now(),
    };

    const response = await fetch("/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
    });

    const data = await response.json();
    if (response.ok) {
      setIsChangeUsername(false);
      setIsChangePhoneNumber(false);
      setIsUpdateSeccess(true);
      console.log("Update thành công: ", updates);
    } else {
      console.log(data.error);
    }
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

  const createdTime = (timestamp) => {
    let date = new Date(timestamp);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${day}/${month}/${year}`;
  };

  const timeAgo = (timestamp) => {
    const now = Date.now();
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
    try {
      fetch(`/api/posts?postId=${postId}`, {
        method: "DELETE",
      })
        .then((res) => {
          console.log(res);
          setIsDeleteSuccess(true);
          setIsModalDelete(!isModalDelete);
        })
        .catch((error) => {
          setError(error);
          console.log("Error: ", error);
        })
        .finally(() => {
          console.log("Kết thúc xóa!");
        });
    } catch {
      console.log("Xóa thất bại: ", error);
    }
  };

  const handleCloseModalSuccessUpdate = () => {
    setIsUpdateSeccess(false);
  };

  const handleLike = async (postId) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post._id === postId) {
          const isLiked = post.likes.some((like) => like.userId === userId);
          if (isLiked) {
            return {
              ...post,
              likes: post.likes.filter((like) => like.userId !== userId),
            };
          } else {
            return {
              ...post,
              likes: [...post.likes, { userId, like_at: Date.now() }],
            };
          }
        }
        return post;
      })
    );

    try {
      const response = await fetch("/api/posts", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId: postId,
          userId: userId,
        }),
      });

      if (!response.ok) {
        console.error("Lỗi khi like/unlike:", await response.json());
      }
    } catch (error) {
      console.error("Lỗi:", error);
    }
  };

  return (
    <Layout>
      <Head>
        <title>Profile</title>
      </Head>
      <Heading />
      <ParentOpenMessage />

      <TabBar />

      {isLoading ? (
        <div className="relative top-32 w-[40%] left-[100%] translate-x-[-175%] h-fit mb-36 duration-300  text-white group cursor-pointer bg-[#DCDFE4] dark:bg-[#22272B] rounded-3xl p-4 hover:bg-blue-200 hover:dark:bg-[#0C66E4]">
          <Loader />
        </div>
      ) : (
        user && (
          <div className="relative top-32 w-[40%] left-[100%] translate-x-[-175%] h-fit mb-36 duration-300  text-white group cursor-pointer bg-[#DCDFE4] dark:bg-[#22272B] rounded-3xl p-4 hover:bg-blue-200 hover:dark:bg-[#0C66E4]">
            <div className="w-[100%] flex flex-col justify-center items-center">
              <div>
                <div className="flex justify-between items-center">
                  <h1 className="text-3xl font-bold text-pink-300 my-4">
                    Thông tin cá nhân
                  </h1>
                  {(isChangePhoneNumber ||
                    isChangeUsername ||
                    selectedImage) && (
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
                        defaultValue={user.username}
                        className="border border-slate-300 p-2 mx-2 rounded text-black"
                        name="changeUsername"
                        onChange={(e) =>
                          e.target.value !== user.username &&
                          setChangeUsername(e.target.value)
                        }
                      />
                    ) : (
                      <span className="mx-2 font-semibold w-full">
                        {user.username}
                      </span>
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
                      width={20}
                      height={20}
                      icon={faPencil}
                      className="cursor-pointer"
                      onClick={handleIsChangeUsername}
                    />
                  )}
                </div>
                <div className="py-2">
                  Email:{" "}
                  <span className="mx-2 font-semibold">{user.email}</span>
                </div>
                <div className="flex justify-between items-center w-full">
                  <div className="py-2">
                    Số điện thoại:
                    {isChangePhoneNumber ? (
                      <input
                        type="text"
                        defaultValue={user.phonenumber}
                        className="border border-slate-300 p-2 mx-2 rounded text-black"
                        name="changePhoneNumber"
                        onChange={(e) =>
                          e.target.value !== user.phonenumber &&
                          setChangePhoneNumber(e.target.value)
                        }
                      />
                    ) : (
                      <span className="mx-2 font-semibold">
                        {user.phonenumber}
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
                      width={20}
                      height={20}
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
                        src={selectedImage || user.avatar}
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
                  Tài khoản được tạo vào: {createdTime(user.createdAt)}
                </div>
              </div>
            </div>
          </div>
        )
      )}
      <div className="pb-10">
        {posts && posts.length > 0 ? (
          <div>
            {posts.map((post) => {
              const isLiked = post.likes.some((like) => like.userId === userId);
              return (
                <div className="relative w-[40%] left-[100%] translate-x-[-175%] block border bg-white rounded-lg my-5 pb-3 ">
                  <div className="flex justify-between items-center mb-5 border-b px-2 py-3">
                    <div
                      className="flex flex-col"
                      title={user && user.username}
                    >
                      <div className="flex">
                        <Image
                          src={user ? user.avatar : "/images/defaultavatar.jpg"}
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
                      onClick={() => handleModalDelete(post._id)}
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
                        src={
                          post.image ? post.image : "/images/defaultavatar.jpg"
                        }
                        alt="imageOfPost"
                        className="w-full block cursor-pointer hover:scale-[1.2] bg-white z-[1000000] transition-all"
                        width={100}
                        height={100}
                      />
                    )}
                  </div>
                  <div
                    id={`like_of_${post._id}`}
                    className={`cursor-pointer w-fit px-2 text-xl ${isLiked ? "text-red-500" : "text-black"}`}
                    onClick={() => handleLike(post._id)}
                  >
                    <FontAwesomeIcon icon={faHeart} />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="relative mt-40 w-[40%] left-[100%] translate-x-[-175%] block">
            Bạn chưa đăng bài viết nào, hãy thử đăng nhé!
          </p>
        )}
      </div>

      {isUpdateSuccess && (
        <div className="fixed top-[30%] left-[50%] translate-x-[-50%] w-56 h-32 px-3 py-5 rounded-md shadow-md border border-slate-600 bg-white">
          Thành công rực rỡ!!
          <button
            type="button"
            className="absolute right-2 bottom-2 px-2 py-1 border rounded bg-blue-300 hover:bg-blue-200"
            onClick={handleCloseModalSuccessUpdate}
          >
            Hay lắm
          </button>
        </div>
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
