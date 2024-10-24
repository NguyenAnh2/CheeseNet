import { ref, get, remove, update } from "firebase/database";
import { useEffect, useState, useRef } from "react";
import { database } from "../firebase/firebaseConfig";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPencil,
  faTrash,
  faCheck,
  faClose,
} from "@fortawesome/free-solid-svg-icons";
import { fetchPost } from "../utils/fetchPost";
import Image from "next/image";

const GetChat = ({ user1Id, user2Id, flagSend }) => {
  const [messages, setMessages] = useState([]);
  const [editingMessage, setEditingMessage] = useState(null);
  const [userSend, setUserSend] = useState([]);
  const [userReceiver, setUserReceiver] = useState([]);
  const [selectedPost, setSelectedPost] = useState([]);
  const [isModalOpenSelectedPost, setIsModalOpenSelectedPost] = useState(false);
  const [newContent, setNewContent] = useState("");
  const [isDeletePopupVisible, setDeletePopupVisible] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState(null);
  const [snapShot, setSnapShot] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef(null);

  const styleSendMessage =
    "relative w-3/4 inline-block break-words -right-9 border bg-slate-100 rounded-lg mx-3 mb-1";
  const styleResponMessage =
    "w-3/4 right-0 inline-block break-words border bg-red-100 rounded-lg mx-1 mb-2";
  const chatId =
    user1Id > user2Id ? `${user1Id}_${user2Id}` : `${user2Id}_${user1Id}`;

  const fetchMessages = async () => {
    const messagesRef = ref(database, `chats/${chatId}/messages`);
    try {
      const snapshot = await get(messagesRef);
      setSnapShot(snapshot);
      if (snapshot.exists()) {
        const data = snapshot.val();
        const messagesArray = Object.keys(data).map((key) => ({
          uid: key,
          ...data[key],
        }));
        setMessages(messagesArray);
        console.log("redenr");
      } else {
        setMessages([]);
      }
    } catch (error) {
      console.error("Error fetching messages: ", error);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [chatId, flagSend, newContent, isDeletePopupVisible]);

  const handleGetUserReceived = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/users/get?uid=${user2Id}`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      if (response.ok) {
        const userData = await response.json();
        setUserReceiver(userData);
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      return error;
    }
  };

  const handleGetUserSend = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/users/get?uid=${user1Id}`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      if (response.ok) {
        const userData = await response.json();
        setIsLoading(false);
        setUserSend(userData);
      }
    } catch (error) {
      setIsLoading(false);
      return error;
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        await Promise.all([handleGetUserReceived(), handleGetUserSend()]);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [user1Id, user2Id]);

  const handleOpenModalSelectedPost = async (postId) => {
    if (postId) {
      try {
        const postData = await fetchPost(postId);
        setSelectedPost(postData);
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    }
    setIsModalOpenSelectedPost(true);
  };

  const handleCloseModalSelectedPost = () => {
    setIsModalOpenSelectedPost(false);
    setSelectedPost(null);
  };

  const handleEditMessage = (messageId, currentContent) => {
    setEditingMessage(messageId);
    setNewContent(currentContent);
  };

  const handleSaveMessage = (messageId) => {
    const messageRef = ref(database, `chats/${chatId}/messages/${messageId}`);

    update(messageRef, { content: newContent })
      .then(() => {
        console.log("Message updated successfully!");
        setEditingMessage(null);
        setNewContent("");
      })
      .catch((error) => {
        console.error("Error updating message: ", error);
      });
  };

  const handleDeleteClick = (messageId) => {
    setMessageToDelete(messageId);
    setDeletePopupVisible(true);
  };

  const handleDeleteMessage = (messageId) => {
    const messageRef = ref(database, `chats/${chatId}/messages/${messageId}`);

    remove(messageRef)
      .then(() => {
        console.log("Message deleted successfully!");
      })
      .catch((error) => {
        console.error("Error deleting message: ", error);
      });
  };

  const confirmDelete = () => {
    handleDeleteMessage(messageToDelete);
    setDeletePopupVisible(false);
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView();
    }
  }, [messages]);

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

  return (
    <ul className="">
      {messages.map((message) => (
        <li
          key={message.uid}
          className={
            message.senderId === user1Id ? styleSendMessage : styleResponMessage
          }
        >
          {editingMessage === message.uid ? (
            <div className="relative">
              <form>
                <textarea
                  id={message.uid}
                  type="text"
                  className="px-3 rounded-lg inline-block break-words overflow-hidden text-left resize-none w-full bg-slate-100"
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                />
              </form>
              <div className="flex absolute left-[-23%] top-[50%] -translate-y-2/4">
                <button
                  className="mx-1 text-[#001F3F]"
                  onClick={() => handleSaveMessage(message.uid)}
                >
                  <FontAwesomeIcon icon={faCheck} width={16} height={16} />
                </button>
                <button
                  className="mx-1 text-[#001F3F]"
                  onClick={() => setEditingMessage(null)}
                >
                  <FontAwesomeIcon icon={faClose} width={14} height={14} />
                </button>
              </div>
            </div>
          ) : (
            <div className="relative px-3 py-1 text-left">
              {message.isReply ? (
                <div
                  className="cursor-pointer font-sans"
                  onClick={() => handleOpenModalSelectedPost(message.postId)}
                >
                  {message.senderId === user1Id && userSend && userReceiver ? (
                    <span className="text-xs text-slate-400">{`${userSend.username} đã trả lời`}</span>
                  ) : (
                    <span className="text-xs text-slate-400">{`${userSend.username} đã trả lời`}</span>
                  )}
                  <div className="text-xs text-slate-400">(xem chi tiết): </div>
                  <div>{message.content}</div>
                </div>
              ) : (
                <div>{message.content}</div>
              )}
              {message.senderId === user1Id && (
                <div className="flex absolute left-[-23%] top-[50%] -translate-y-2/4">
                  <button
                    className="mx-1 text-[#001F3F]"
                    onClick={() =>
                      handleEditMessage(message.uid, message.content)
                    }
                  >
                    <FontAwesomeIcon icon={faPencil} width={14} height={14} />
                  </button>
                  <button
                    className="mx-1 text-[#001F3F]"
                    onClick={() => handleDeleteClick(message.uid)}
                  >
                    <FontAwesomeIcon icon={faTrash} width={14} height={14} />
                  </button>
                </div>
              )}
            </div>
          )}
        </li>
      ))}
      <div ref={messagesEndRef} />
      {isDeletePopupVisible && (
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
                onClick={() => setDeletePopupVisible(false)}
                class="mb-2 md:mb-0 bg-gray-700 px-5 py-2 text-sm shadow-sm font-medium tracking-wider border-2 border-gray-600 hover:border-gray-700 text-gray-300 rounded-full hover:shadow-lg hover:bg-gray-800 transition ease-in duration-300"
              >
                Hủy
              </button>
              <button
                onClick={confirmDelete}
                class="bg-red-500 hover:bg-transparent px-5 ml-4 py-2 text-sm shadow-sm hover:shadow-lg font-medium tracking-wider border-2 border-red-500 hover:border-red-500 text-white hover:text-red-500 rounded-full transition ease-in duration-300"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}

      {isModalOpenSelectedPost && (
        <div className="fixed z-[1000] inset-0 flex items-center justify-center bg-black bg-opacity-50 mt-14 py-8">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <button
              onClick={handleCloseModalSelectedPost}
              className="text-red-500 float-right"
            >
              Đóng
            </button>
            {selectedPost ? (
              <div className="transition-transform">
                <p className="text-sm text-slate-700 mb-2">
                  {timeAgo(selectedPost[0].timestamp)}
                </p>
                <h2 className="text-xl">{selectedPost[0].content}</h2>
                {selectedPost[0].image && (
                  <Image
                    src={
                      selectedPost[0].image
                        ? selectedPost[0].image
                        : "/images/defaultavatar.jpg"
                    }
                    width={30}
                    height={30}
                    className="w-full h-full object-cover hover:scale-[1.2] transition-transform"
                    alt="ccccc"
                    loading="lazy"
                  />
                )}
              </div>
            ) : (
              <p>Loading post...</p>
            )}
          </div>
        </div>
      )}
    </ul>
  );
};

export default GetChat;
