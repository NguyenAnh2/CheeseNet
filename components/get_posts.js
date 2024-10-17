import { faClose, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { faHeart, faCommentDots } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useReplyPost } from "../utils/replyPost";
import Image from "next/image";
import { useAuth } from "./auth";
import { useState, useEffect, useRef } from "react";

export default function GetPosts({}) {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
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

  const getUser = async () => {
    try {
      const response = await fetch(`/api/users`, {
        method: "GET",
      });

      if (response.ok) {
        const entries = await response.json();
        setUsers(entries);
      } else {
        const errorData = await response.json();
        setError(errorData.error);
      }
      setIsLoading(false);
    } catch (error) {
      setError("Failed to fetch posts entries.");
      console.error("Error fetching posts:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getUser();
  }, [userId]);

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

  const { loading, handleReplyPost } = useReplyPost();

  const [activeReplyPostId, setActiveReplyPostId] = useState(null);
  const messageToReplyRef = useRef();

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

  return (
    <div className="bg-white">
      {posts
        .sort((a, b) => b.timestamp - a.timestamp)
        .map((post) => {
          const user = users.find((user) => user.uid === post.userId);
          const isLiked = post.likes.some((like) => like.userId === userId);
          return (
            <div
              key={post._id}
              className="flex flex-col border rounded-md my-6 sm:w-full"
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
                    />
                    <p>{user ? user.username : "Unknown User"}</p> <br />
                  </div>
                  <p className="text-xs mt-3 text-slate-600">
                    {timeAgo(post.timestamp)}
                  </p>
                </div>
              </div>
              <div className="border-b mb-2 pb-5 px-3">
                <div className="mb-2">{post.content}</div>
                {post.image && (
                  <Image
                    src={post.image ? post.image : '/images/defaultavatar.jpg'}
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
                  className="fixed inset-x-[-116%] inset-y-custom-modal pt-40 flex items-center justify-center bg-black bg-opacity-30 z-[100] cursor-pointer"
                  onClick={closeModal}
                >
                  <img
                    src={modalImage}
                    alt="Modal Preview"
                    className="max-[50%] max-h-[50%] rounded"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <FontAwesomeIcon
                    icon={faClose}
                    className="absolute text-white z-[100] text-2xl top-0 right-3 cursor-pointer"
                  />
                </div>
              )}

              <div className="flex flex-col">
                <div className="flex items-center mb-2">
                  <div
                    id={`like_of_${post._id}`}
                    className={`cursor-pointer w-fit px-2 text-xl ${isLiked ? "text-red-500" : "text-black"}`}
                    onClick={() => handleLike(post._id)}
                  >
                    <FontAwesomeIcon icon={faHeart} />
                  </div>
                  <div className="text-sm text-slate-800">{post.likes.length}</div>
                  {userId !== post.userId && (
                    <div
                      className={`cursor-pointer w-fit px-2 text-xl`}
                      onClick={() => toggleReply(post._id)}
                    >
                      <FontAwesomeIcon icon={faCommentDots} />
                    </div>
                  )}
                  {activeReplyPostId === post._id && (
                    <form
                      className="relative ml-3 border rounded-lg"
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
                        className="relative outline-none px-2 py-1 w-[80%]"
                        placeholder="Trả lời tin"
                        ref={messageToReplyRef}
                      />
                      <button
                        className="absolute top-2/4 translate-y-[-50%] right-2"
                        type="submit"
                      >
                        <FontAwesomeIcon icon={faPaperPlane} />
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
}
