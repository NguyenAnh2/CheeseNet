import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faChevronUp,
  faClose,
  faPaperPlane,
} from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "./auth";
import { database } from "../firebase/firebaseConfig";
import { ref, child, set, push } from "firebase/database";
import GetChat from "./get_chat";

function Message({
  key,
  user,
  removeElementById,
  miniMessage,
  toggleMiniState,
}) {
  const messRef = useRef();
  const { userId } = useAuth();
  const chatId =
    userId > user.uid ? `${userId}_${user.uid}` : `${user.uid}_${userId}`;
  const [flagSend, setFlagSend] = useState(false);

  const handleSubmitMessage = (e) => {
    e.preventDefault();

    const messagesRef = child(ref(database), `chats/${chatId}/messages`);

    // Tạo một ID tự động cho tin nhắn
    const newMessageRef = push(messagesRef);

    if (messRef.current.value) {
      const newMessage = {
        senderId: userId,
        receiverId: user.uid,
        content: messRef.current.value,
        timestamp: Date.now(),
      };

      set(newMessageRef, newMessage)
        .then(() => {
          messRef.current.value = "";
          console.log("Sent message");
          setFlagSend(!flagSend);
        })
        .catch((error) => {
          console.error("Error sending message: ", error);
        });
    }
    messRef.current.value = "";
  };

  return (
    <div
      id={user.uid}
      className="sm:relative  sm:max-w-[315px] sm:w-full md:max-w-[278px] max-w-full rounded border shadow-xl transition-all w-full z-[10]"
    >
      <div className=" flex p-2 bg-slate-200">
        <div className="flex items-center">
          <Image
            className="mx-2 rounded-full h-8 w-8 object-cover"
            src={user.avatar}
            width={30}
            height={30}
            alt="alt"
          />
          <p className="mr-4">{user.username}</p>
        </div>
        <div className="absolute right-0">
          {toggleMiniState ? (
            <button onClick={() => miniMessage(user.uid)}>
              <FontAwesomeIcon
                icon={faChevronDown}
                className="mx-1"
                color="blue"
              />
            </button>
          ) : (
            <button onClick={() => miniMessage(user.uid)}>
              <FontAwesomeIcon
                icon={faChevronUp}
                className="mx-1"
                color="blue"
              />
            </button>
          )}
          <button onClick={() => removeElementById(user.uid)}>
            <FontAwesomeIcon icon={faClose} className="mx-2" color="blue" />
          </button>
        </div>
      </div>

      <div
        id={`inner_message_${user.uid}`}
        className={`relative bg-slate-50 transition-all duration-300 overflow-y-scroll pt-4 pb-14 ${
          toggleMiniState[user.uid] !== undefined && toggleMiniState[user.uid]
            ? "hidden"
            : "h-[312px]"
        }`}
      >
        <GetChat user1Id={userId} user2Id={user.uid} flagSend={flagSend} />
      </div>

      <div className="fixed bottom-1 w-[300px]">
        <form
          onSubmit={(e) => handleSubmitMessage(e)}
          id="form-send-message"
          className="fixed bottom-0 flex bg-slate-200 items-center sm:max-w-[300px] sm:w-full md:max-w-[278px] max-w-[300px] w-full md:w-full transition-all delay-150"
        >
          <textarea
            ref={messRef}
            id={`mess_from_${user.uid}`}
            className="w-[90%] h-10 rounded-xl px-3 pt-2 bg-slate-200 overflow-hidden text-left outline-none resize-none"
            placeholder="Tin nhắn tới "
            rows="1"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmitMessage(e);
              }
            }}
          />
          <button className="" type="submit">
            <FontAwesomeIcon icon={faPaperPlane} />
          </button>
        </form>
      </div>
    </div>
  );
}

export default Message;
