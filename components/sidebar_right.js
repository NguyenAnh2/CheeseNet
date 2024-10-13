import { useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPaperPlane,
  faArrowRight,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";

export default function SideRight() {
  const inputRef = useRef();
  const [chatHistory, setChatHistory] = useState([]);
  const [isOpenRight, setIsOpenRight] = useState(false);
  const styleSendMessage =
    "relative w-3/4 inline-block break-words -right-9 border bg-slate-100 rounded-lg px-3 mx-3 my-1";
  const styleResponMessage =
    "w-3/4 right-0 border bg-red-100 rounded-lg px-3 mx-1 my-2";

  const handleSubmitChat = async (e) => {
    e.preventDefault();
    const message = inputRef.current.value.trim();
    inputRef.current.value = "";
    if (inputRef.current) {
      if (!message) return;

      setChatHistory((prev) => [...prev, { type: "user", text: message }]);

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message }),
        });
        const data = await response.json();
        setChatHistory((prev) => [
          ...prev,
          { type: "bot", text: data["text"] },
        ]);
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  const toggleOpenRight = () => {
    setIsOpenRight(!isOpenRight);
  };

  return (
    <div>
      {isOpenRight && (
        <div className="sm:fixed sm:flex sm:right-0 md:w-60 lg:w-80 sm:w-[190px] flex-col h-[calc(100vh-64px)] overflow-y-auto w-[60%] fixed top-[64px] right-0  bottom-0 border-slate-600 shadow-xl bg-white">
          <div className="my-3 border-b pb-2 pl-4 ">
            <p>Chatbox AI</p>
          </div>
          <ul className="mb-20">
            {chatHistory.map((chat, index) => (
              <li
                key={index}
                className={
                  chat.type === "user"
                    ? styleSendMessage
                    : `${styleResponMessage}`
                }
              >
                {chat.type === "user"
                  ? chat.text.split("\n").map((line, i) => (
                      <p key={i} className="">
                        {line}
                      </p>
                    ))
                  : chat.text
                      .split("\n")
                      .map((line, i) => <p key={i}>{line}</p>)}
              </li>
            ))}
          </ul>
          <form
            onSubmit={handleSubmitChat}
            className="fixed bottom-0 w-full rounded-xl h-12 bg-slate-200"
          >
            <textarea
              ref={inputRef}
              className="absolute w-[90%] h-12 rounded-xl px-3 pt-3 bg-slate-200 overflow-hidden text-left outline-none resize-none"
              placeholder="Tin nhắn tới Chatbox"
              rows="1"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmitChat(e);
                }
              }}
            />
            <button
              className="absolute bottom-2/4 translate-y-2/4 right-6"
              type="submit"
            >
              <FontAwesomeIcon icon={faPaperPlane} />
            </button>
          </form>
        </div>
      )}
      <div className="fixed right-[0] top-[155px] bg-lime-300 px-3 py-2 text-xl rounded-s-xl z-[10] cursor-pointer opacity-70">
        {isOpenRight ? (
          <FontAwesomeIcon icon={faArrowRight} onClick={toggleOpenRight} />
        ) : (
          <FontAwesomeIcon icon={faArrowLeft} onClick={toggleOpenRight} />
        )}
      </div>
    </div>
  );
}
