import { useRef, useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPaperPlane,
  faArrowRight,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";

export default function SideRight() {
  const inputRef = useRef();
  const sideRightRef = useRef(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [isOpenRight, setIsOpenRight] = useState(false);
  const styleSendMessage =
    "relative w-3/4 font-medium text-base text-[#001F3F] inline-block break-words -right-9 border bg-slate-100 rounded-lg px-3 mx-3 my-1";
  const styleResponMessage =
    "w-3/4 font-medium text-base text-[#001F3F] right-0 border bg-red-100 rounded-lg px-3 mx-1 my-2";

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
    setIsOpenRight(false);
  };

  const toggleCloseRight = () => {
    setIsOpenRight(true);
  };

  // Sự kiện đóng khi click bên ngoài SideRight
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Kiểm tra nếu bấm ra ngoài SideRight và SideRight đang mở
      if (
        sideRightRef.current &&
        !sideRightRef.current.contains(event.target) &&
        isOpenRight
      ) {
        setIsOpenRight(false);
      }
    };

    // Thêm event listener khi click vào tài liệu
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      // Loại bỏ sự kiện khi component unmount
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpenRight]);

  return (
    <div ref={sideRightRef}>
      <div
        className={`bg-galaxy-3 sm:fixed sm:flex sm:right-0 md:w-60 lg:w-80 sm:w-[190px] flex-col h-[calc(100vh-64px)] overflow-y-auto w-[60%] fixed top-[64px] right-0  bottom-0 border-slate-600 shadow-xl bg-white transition-transform duration-300 ease-in-out z-[10] transform ${
          isOpenRight ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="my-3 border-b pb-2 pl-4 ">
          <p className="text-base text-black font-medium">Chatbox AI</p>
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
                : chat.text.split("\n").map((line, i) => <p key={i}>{line}</p>)}
            </li>
          ))}
        </ul>
      </div>
      <form
        onSubmit={handleSubmitChat}
        className={`fixed right-0 bottom-0 md:w-60 lg:w-80 sm:w-[190px] rounded-xl h-12 overflow-y-auto w-[60%] bg-slate-200 transform z-[1000] ${
          isOpenRight ? "translate-x-0" : "translate-x-full delay-100"
        } `}
      >
        <textarea
          ref={inputRef}
          className="w-[90%] h-12 rounded-xl px-3 pt-3 bg-slate-200 overflow-hidden text-left outline-none resize-none"
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
          <FontAwesomeIcon icon={faPaperPlane} width={18} height={18} />
        </button>
      </form>
      <div className="fixed right-[0] top-[155px] bg-blue-200 hover:bg-blue-400 px-3 py-2 text-xl rounded-s-xl z-[10] cursor-pointer opacity-70">
        {isOpenRight ? (
          <FontAwesomeIcon
            icon={faArrowRight}
            onClick={toggleOpenRight}
            width={18}
            height={18}
          />
        ) : (
          <FontAwesomeIcon
            icon={faArrowLeft}
            onClick={toggleCloseRight}
            width={18}
            height={18}
          />
        )}
      </div>
    </div>
  );
}
