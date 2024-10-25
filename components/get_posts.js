import {
  faClose,
  faPaperPlane,
  faWarning,
} from "@fortawesome/free-solid-svg-icons";
import { faHeart, faCommentDots } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useReplyPost } from "../utils/replyPost";
import Image from "next/image";
import { useGlobal } from "./global_context";
import { useState, useEffect, useRef } from "react";
import LoadingPage from "./custom/loading-page";

export default function GetPosts({}) {
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [modalImage, setModalImage] = useState(null);
  const [activeReplyPostId, setActiveReplyPostId] = useState(null);
  const messageToReplyRef = useRef();
  const { loading, handleReplyPost } = useReplyPost();
  const { userId } = useGlobal();
  const { users } = useGlobal();
  const { postsOfUser } = useGlobal();

  const openModal = (image) => {
    setModalImage(image);
  };

  const closeModal = () => {
    setModalImage(null);
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

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 16000);

    return () => clearInterval(interval);
  }, []);

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

  const toggleReply = (postId) => {
    if (activeReplyPostId === postId) {
      setActiveReplyPostId(null);
    } else {
      setActiveReplyPostId(postId);
    }
  };

  useEffect(() => {
    if (messageToReplyRef.current) {
      messageToReplyRef.current.focus();
    }
  }, [activeReplyPostId]);

  console.log(postsOfUser);

  return (
    <div className="">
      {postsOfUser && Array.isArray(postsOfUser) && postsOfUser.length > 0 ? (
        postsOfUser
          .sort((a, b) => b.timestamp - a.timestamp)
          .map((post) => {
            const user = users.find((user) => user.uid === post.userId);
            const isLiked = post.likes.some((like) => like.userId === userId);
            return (
              <div
                key={post._id}
                className="card flex flex-col border rounded-md my-6 sm:w-full overflow-hidden"
              >
                <div className="flex justify-between mb-5 border-b px-2 py-3">
                  <div className="flex flex-col" title={user && user.username}>
                    <div className="flex">
                      <Image
                        src={user ? user.avatar : "/images/defaultavatar.jpg"}
                        alt="avatarUser"
                        className="rounded-full mr-3 w-8 h-8 object-cover"
                        width={30}
                        height={30}
                        loading="lazy"
                      />
                      <p className="text-xl font-semibold text-[#001F3F]">
                        {user ? user.username : "Unknown User"}
                      </p>{" "}
                      <br />
                    </div>
                    <p className="text-xs mt-3 text-[#001F3F]">
                      {timeAgo(post.timestamp)}
                    </p>
                  </div>
                </div>
                <div className="border-b mb-2 pb-5 px-3">
                  <div className="mb-2 text-lg font-semibold text-[#001F3F]">
                    {post.content}
                  </div>
                  {post.image && (
                    <Image
                      src={
                        post.image ? post.image : "/images/defaultavatar.jpg"
                      }
                      alt="imageOfPost"
                      className="w-full block cursor-pointer transition-transform hover:scale-[1.2]"
                      width={100}
                      height={100}
                      onClick={() => openModal(post.image)}
                      // loading="lazy"
                    />
                  )}
                </div>

                {modalImage && (
                  <div
                    className="fixed inset-x-[-116%] inset-y-custom-modal pt-40 flex items-center justify-center bg-black bg-opacity-30 z-[100] cursor-pointer"
                    onClick={closeModal}
                  >
                    <img
                      src={modalImage}
                      alt="Modal Preview"
                      className="max-[50%] max-h-[50%] rounded"
                      onClick={(e) => e.stopPropagation()}
                      // loading="lazy"
                    />
                    <FontAwesomeIcon
                      width={18}
                      height={18}
                      icon={faClose}
                      className="absolute text-white z-[100] text-2xl top-0 right-3 cursor-pointer"
                    />
                  </div>
                )}

                <div className="flex flex-col">
                  <div className="flex items-center mb-2">
                    <div
                      id={`like_of_${post._id}`}
                      className={`cursor-pointer w-fit px-2 text-xl ${isLiked ? "text-red-500" : "text-[#001F3F]"}`}
                      onClick={() => handleLike(post._id)}
                    >
                      <FontAwesomeIcon icon={faHeart} width={20} height={20} />
                    </div>
                    <div className="text-base text-[#001F3F] font-[400]">
                      {post.likes.length}
                    </div>
                    {userId !== post.userId && (
                      <div
                        className={`cursor-pointer w-fit px-2 text-xl`}
                        onClick={() => toggleReply(post._id)}
                      >
                        <FontAwesomeIcon
                          icon={faCommentDots}
                          width={20}
                          height={20}
                          className="text-[#001F3F]"
                        />
                      </div>
                    )}
                    {activeReplyPostId === post._id && (
                      <form
                        className="relative ml-3 border rounded-full  overflow-hidden"
                        onSubmit={(e) => {
                          e.preventDefault();
                          handleReplyPost({
                            postId: post._id,
                            userIdOwnPost: post.userId,
                            messageToReply: messageToReplyRef.current.value,
                          });
                          toggleReply(post._id);
                          messageToReplyRef.current.value = "";
                        }}
                      >
                        <input
                          type="text"
                          name="replyMessage"
                          className="inputSearch relative outline-none px-2 py-1 w-[80%]"
                          placeholder="Trả lời tin"
                          ref={messageToReplyRef}
                        />
                        <button
                          className="absolute top-2/4 translate-y-[-50%] right-2"
                          type="submit"
                        >
                          <FontAwesomeIcon
                            icon={faPaperPlane}
                            width={18}
                            height={18}
                            className="text-white"
                          />
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              </div>
            );
          })
      ) : userId ? (
        <div className="flex justify-center items-center">
          <LoadingPage />
        </div>
      ) : (
        <div className="fixed flex flex-col items-center left-2/4 translate-x-[-50%] w-full text-2xl text-white font-bold">
          <FontAwesomeIcon
            icon={faWarning}
            width={30}
            height={30}
            className="text-yellow-400 mb-4"
          />
          Vui lòng đăng nhập!
        </div>
      )}

      <div className="mb-16"></div>
    </div>
  );
}
