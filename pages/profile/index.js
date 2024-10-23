import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCamera,
  faClose,
  faPencil,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import Layout from "../../components/layout";
import Head from "next/head";
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

  const [visibilityMap, setVisibilityMap] = useState({});

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const { userId } = useAuth();

  const fetchUserInfo = async () => {
    try {
      const response = await fetch(`/api/users/get?uid=${userId}`)
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
      const response = await fetch(`/api/posts/get_of_user?userId=${userId}`)
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
  }, [userId, isLoading, isDeleteSuccess]);

  const handleSubmitProfile = async (e) => {
    e.preventDefault();
    const updates = {
      uid: userId,
      username: changeUsername || user.username,
      phonenumber: changePhoneNumber || user.phonenumber,
      diary_password: user.diary_password,
      avatar: user.avatar,
      receivedFriendRequests: user.receivedFriendRequests,
      sentFriendRequests: user.sentFriendRequests,
      friends: user.friends,
      updatedAt: Date.now(),
    };

    if (selectedImage) {
      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ file: selectedImage }),
      });

      const uploadData = await uploadResponse.json();

      if (uploadResponse.ok) {
        updates.avatar = uploadData.imageUrl;
      }
    }

    const response = await fetch("/api/users/post", {
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
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
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
      fetch(`/api/posts/remove?postId=${postId}`, {
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
      const response = await fetch("/api/posts/update", {
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

  const handleChangeVisibility = async (newVisibility, postId) => {
    setVisibilityMap((prevVisibility) => ({
      ...prevVisibility,
      [postId]: newVisibility,
    }));
    try {
      const response = await fetch(`/api/posts/update?postId=${postId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postId, visibility: newVisibility }), // Gửi postId và visibility
      });

      if (!response.ok) {
        throw new Error("Failed to update visibility");
      }

      const result = await response.json();
      console.log("Updated visibility:", result);
    } catch (error) {
      console.error("Error updating visibility:", error);
    }
  };

  return (
    <Layout>
      <Head>
        <title>Trang cá nhân</title>
        <link rel="icon" href="/icon.png" />
      </Head>

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
                  <h1 className="text-3xl font-bold text-pink-300 m-4">
                    Thông tin cá nhân
                  </h1>
                  {(isChangePhoneNumber ||
                    isChangeUsername ||
                    selectedImage ||
                    isUpdateSuccess) && (
                    <button
                      onClick={handleSubmitProfile}
                      className="text-pink-200 bg-blue-600 hover:bg-blue-400 h-fit px-2 py-1 text-xl rounded-md transition-transform"
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
                      <span className="mx-2 font-semibold w-full md:text-lg">
                        {user.username}
                      </span>
                    )}
                  </div>
                  {isChangeUsername ? (
                    <FontAwesomeIcon
                      width={20}
                      height={20}
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
                      width={20}
                      height={20}
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
                        width={20}
                        height={20}
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
                        <FontAwesomeIcon
                          icon={faCamera}
                          className="w-8 h-8"
                          width={20}
                          height={20}
                        />
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
      <div className="pb-10 ">
        {posts && posts.length > 0 ? (
          <div>
            {posts
              .sort((a, b) => b.timestamp - a.timestamp)
              .map((post) => {
                const isLiked = post.likes.some(
                  (like) => like.userId === userId
                );
                return (
                  <div className="card relative w-[40%] left-[50%] translate-x-[-50%] block border bg-white rounded-lg my-5 pb-3 ">
                    <div className="flex justify-between items-center mb-5 border-b px-2 py-3">
                      <div
                        className="flex flex-col w-full"
                        title={user && user.username}
                      >
                        <div className="flex">
                          <Image
                            src={
                              user ? user.avatar : "/images/defaultavatar.jpg"
                            }
                            alt="avatarUser"
                            className="rounded-full mr-3 w-8 h-8 object-cover"
                            width={30}
                            height={30}
                            loading="lazy"
                          />
                          <p className="text-lg font-semibold text-white">
                            {user ? user.username : "Unknown User"}
                          </p>
                        </div>
                        <p className="text-xs mt-3 text-white">
                          {timeAgo(post.timestamp)}
                        </p>
                      </div>
                      <div className="absolute top-9 right-14">
                        <select
                          className="block appearance-none w-full bg-galaxy text-white font-bold py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-blue-300 cursor-pointer"
                          value={visibilityMap[post._id] || post.visibility}
                          onChange={(e) =>
                            handleChangeVisibility(e.target.value, post._id)
                          }
                        >
                          <option
                            className="bg-galaxy-3 py-2 cursor-pointer"
                            value="public"
                          >
                            Công khai
                          </option>
                          <option
                            className="bg-galaxy-3 py-2 cursor-pointer"
                            value="friends"
                          >
                            Bạn bè
                          </option>
                        </select>
                      </div>
                      <div
                        className="cursor-pointer px-2 py-6 hover:-translate-y-1 transition-transform"
                        onClick={() => handleModalDelete(post._id)}
                      >
                        <FontAwesomeIcon
                          icon={faTrash}
                          className="text-red-500"
                          width={20}
                          height={20}
                        />
                      </div>
                    </div>
                    <div
                      className={`border-b mb-2 ${post.image ? "mb-20" : "mb-5"} px-3`}
                    >
                      <div className="mb-5 text-lg font-semibold text-white">
                        {post.content}
                      </div>
                      {post.image && (
                        <Image
                          src={
                            post.image
                              ? post.image
                              : "/images/defaultavatar.jpg"
                          }
                          alt="imageOfPost"
                          className="w-full block cursor-pointer hover:scale-[1.2] bg-white z-[1000000] transition-all"
                          width={100}
                          height={100}
                          loading="lazy"
                        />
                      )}
                    </div>
                    <div
                      id={`like_of_${post._id}`}
                      className={`cursor-pointer w-fit px-2 text-xl ${isLiked ? "text-red-500" : "text-white"}`}
                      onClick={() => handleLike(post._id)}
                    >
                      <FontAwesomeIcon icon={faHeart} width={20} height={20} />
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
        <div class="fixed top-[30%] right-2/4 translate-x-[50%] group select-none w-[250px] flex flex-col p-4 items-center justify-center bg-gray-800 border border-gray-800 shadow-lg rounded-2xl">
          <div class="">
            <div class="text-center p-3 flex-auto justify-center">
              <svg
                fill="currentColor"
                viewBox="0 0 20 20"
                class="group-hover:animate-bounce w-12 h-12 flex items-center text-gray-600 fill-red-500 mx-auto"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  clip-rule="evenodd"
                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                  fill-rule="evenodd"
                ></path>
              </svg>
              <h2 class="text-xl font-bold py-4 text-gray-200">Bạn có chắc?</h2>
              <p class="font-bold text-sm text-gray-500 px-2">
                Bạn có chắc chắn muốn xóa bài viết?
              </p>
            </div>
            <div class="p-2 mt-2 text-center space-x-1 md:block">
              <button
                onClick={() => setIsModalDelete(false)}
                class="mb-2 md:mb-0 bg-gray-700 px-5 py-2 text-sm shadow-sm font-medium tracking-wider border-2 border-gray-600 hover:border-gray-700 text-gray-300 rounded-full hover:shadow-lg hover:bg-gray-800 transition ease-in duration-300"
              >
                Cancel
              </button>
              <button
                onClick={(e) => handleDeletePost(selectedPostId)}
                class="bg-red-500 hover:bg-transparent px-5 ml-4 py-2 text-sm shadow-sm hover:shadow-lg font-medium tracking-wider border-2 border-red-500 hover:border-red-500 text-white hover:text-red-500 rounded-full transition ease-in duration-300"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {isDeleteSuccess && (
        <div class="card_success fixed top-[30%] right-2/4 translate-x-[50%]">
          <svg
            class="wave"
            viewBox="0 0 1440 320"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0,256L11.4,240C22.9,224,46,192,69,192C91.4,192,114,224,137,234.7C160,245,183,235,206,213.3C228.6,192,251,160,274,149.3C297.1,139,320,149,343,181.3C365.7,213,389,267,411,282.7C434.3,299,457,277,480,250.7C502.9,224,526,192,549,181.3C571.4,171,594,181,617,208C640,235,663,277,686,256C708.6,235,731,149,754,122.7C777.1,96,800,128,823,165.3C845.7,203,869,245,891,224C914.3,203,937,117,960,112C982.9,107,1006,181,1029,197.3C1051.4,213,1074,171,1097,144C1120,117,1143,107,1166,133.3C1188.6,160,1211,224,1234,218.7C1257.1,213,1280,139,1303,133.3C1325.7,128,1349,192,1371,192C1394.3,192,1417,128,1429,96L1440,64L1440,320L1428.6,320C1417.1,320,1394,320,1371,320C1348.6,320,1326,320,1303,320C1280,320,1257,320,1234,320C1211.4,320,1189,320,1166,320C1142.9,320,1120,320,1097,320C1074.3,320,1051,320,1029,320C1005.7,320,983,320,960,320C937.1,320,914,320,891,320C868.6,320,846,320,823,320C800,320,777,320,754,320C731.4,320,709,320,686,320C662.9,320,640,320,617,320C594.3,320,571,320,549,320C525.7,320,503,320,480,320C457.1,320,434,320,411,320C388.6,320,366,320,343,320C320,320,297,320,274,320C251.4,320,229,320,206,320C182.9,320,160,320,137,320C114.3,320,91,320,69,320C45.7,320,23,320,11,320L0,320Z"
              fill-opacity="1"
            ></path>
          </svg>

          <div class="icon-container">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              stroke-width="0"
              fill="currentColor"
              stroke="currentColor"
              class="icon"
            >
              <path d="M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-111 111-47-47c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l64 64c9.4 9.4 24.6 9.4 33.9 0L369 209z"></path>
            </svg>
          </div>
          <div class="message-text-container">
            <p class="message-text">Thao tác hoàn thành</p>
            <p class="sub-text">Tất cả đã sẵn sàng</p>
          </div>
          <div onClick={() => setIsDeleteSuccess(!isDeleteSuccess)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 15 15"
              stroke-width="0"
              fill="none"
              stroke="currentColor"
              class="cross-icon"
            >
              <path
                fill="currentColor"
                d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z"
                clip-rule="evenodd"
                fill-rule="evenodd"
              ></path>
            </svg>
          </div>
        </div>
      )}
    </Layout>
  );
}
