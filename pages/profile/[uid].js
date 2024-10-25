import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Head from "next/head";
import Layout from "../../components/layout";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-regular-svg-icons";

export default function UserProfile() {
  const router = useRouter();
  const { uid } = router.query;
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserInfo = async () => {
    try {
      const response = await fetch(`/api/users/get?uid=${uid}`)
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
      const response = await fetch(`/api/posts/get_of_user?userId=${uid}`)
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
    fetchPostsOfUser();
  }, [uid, isLoading]);

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

  const handleLike = async (postId) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post._id === postId) {
          const isLiked = post.likes.some((like) => like.userId === uid);
          if (isLiked) {
            return {
              ...post,
              likes: post.likes.filter((like) => like.userId !== uid),
            };
          } else {
            return {
              ...post,
              likes: [...post.likes, { uid, like_at: Date.now() }],
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
          userId: uid,
        }),
      });

      if (!response.ok) {
        console.error("Lỗi khi like/unlike:", await response.json());
      }
    } catch (error) {
      console.error("Lỗi:", error);
    }
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <Layout>
      <Head>
        <title>{user.username}</title>
        <link rel="icon" href="/icon.png" />
      </Head>
      {user ? (
        <div className="relative top-32 w-[40%] left-[100%] translate-x-[-175%] h-fit mb-36 duration-300  text-[#001F3F] group cursor-pointer bg-[#ccdf7b] dark:bg-[#22272B] rounded-3xl p-4 hover:bg-[#e6ff78] hover:dark:bg-[#0C66E4]">
          <div className="w-[100%] flex flex-col justify-center items-center">
            <div>
              <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-[#001F3F] my-4">
                  Thông tin cá nhân của {user.username}
                </h1>
              </div>
              <div className="flex justify-between items-center">
                <div className="py-2">
                  Tên người dùng:{" "}
                  <span className="mx-2 font-semibold w-full">
                    {user.username}
                  </span>
                </div>
              </div>
              <div className="py-2">
                Email: <span className="mx-2 font-semibold">{user.email}</span>
              </div>
              <div className="flex justify-between items-center w-full">
                <div className="py-2">
                  Số điện thoại:
                  <span className="mx-2 font-semibold">{user.phonenumber}</span>
                </div>
              </div>
              <div className="flex flex-col">
                <div className="flex flex-col py-2 relative">
                  <p className="mb-3">Ảnh đại diện</p>
                  <div className="relative w-60 h-60 object-cover cursor-pointer rounded-full overflow-hidden flex justify-center">
                    <img
                      src={user.avatar || "/images/defaultavatar.jpg"}
                      alt="Preview"
                      className=""
                    />
                  </div>
                </div>
              </div>
              <div className="py-2 text-slate-500">
                Tài khoản được tạo vào: {createdTime(user.createdAt)}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p>User not found</p>
      )}

      <div className="pb-10">
        {posts && posts.length > 0 ? (
          <div>
            {posts
              .sort((a, b) => b.timestamp - a.timestamp)
              .map((post) => {
                const isLiked = post.likes.some((like) => like.userId === uid);
                return (
                  <div className="card relative w-[40%] left-[100%] translate-x-[-175%] block border  rounded-lg my-5 pb-3 ">
                    <div className="flex justify-between items-center mb-5 border-b px-2 py-3">
                      <div
                        className="flex flex-col"
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
                          <p className="text-[#001F3F] font-semibold text-base ">{user ? user.username : "Unknown User"}</p>
                        </div>
                        <p className="text-xs mt-3 text-slate-600">
                          {timeAgo(post.timestamp)}
                        </p>
                      </div>
                    </div>
                    <div
                      className={`border-b mb-2 ${post.image ? "mb-20" : "mb-5"} px-3`}
                    >
                      <div className="mb-5 text-[#001F3F] font-semibold text-base ">{post.content}</div>
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
                      className={`cursor-pointer w-fit px-2 text-xl ${isLiked ? "text-red-500" : "text-black"}`}
                      onClick={() => handleLike(post._id)}
                    >
                      <FontAwesomeIcon icon={faHeart} width={18} height={18} />
                    </div>
                  </div>
                );
              })}
          </div>
        ) : (
          <p className="relative mt-40 w-[40%] left-[100%] translate-x-[-175%] block font-bold text-[#001F3F]">
            Bài viết trống
          </p>
        )}
      </div>
    </Layout>
  );
}
