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

const GetChat = ({ user1Id, user2Id, flagSend }) => {
  const [messages, setMessages] = useState([]);
  const [editingMessage, setEditingMessage] = useState(null);
  const [newContent, setNewContent] = useState("");
  const [isDeletePopupVisible, setDeletePopupVisible] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState(null);
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
      if (snapshot.exists()) {
        const data = snapshot.val();
        const messagesArray = Object.keys(data).map((key) => ({
          uid: key,
          ...data[key],
        }));
        setMessages(messagesArray);
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
                  className="mx-1 text-slate-400"
                  onClick={() => handleSaveMessage(message.uid)}
                >
                  <FontAwesomeIcon icon={faCheck} />
                </button>
                <button
                  className="mx-1 text-slate-400"
                  onClick={() => setEditingMessage(null)}
                >
                  <FontAwesomeIcon icon={faClose} />
                </button>
              </div>
            </div>
          ) : (
            <div className="relative px-3 py-1">
              {message.content}
              {message.senderId === user1Id && (
                <div className="flex absolute left-[-23%] top-[50%] -translate-y-2/4">
                  <button
                    className="mx-1 text-slate-400"
                    onClick={() =>
                      handleEditMessage(message.uid, message.content)
                    }
                  >
                    <FontAwesomeIcon icon={faPencil} />
                  </button>
                  <button
                    className="mx-1 text-slate-400"
                    onClick={() => handleDeleteClick(message.uid)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              )}
            </div>
          )}
        </li>
      ))}
      <div ref={messagesEndRef} />
      {isDeletePopupVisible && (
        <div className="popup-overlay">
          <div className="popup-content">
            <p>Bạn có chắc chắn muốn xóa tin nhắn này không?</p>
            <button className="" onClick={confirmDelete}>
              Xác nhận
            </button>
            <button onClick={() => setDeletePopupVisible(false)}>Hủy</button>
          </div>
        </div>
      )}
    </ul>
  );
};

export default GetChat;
