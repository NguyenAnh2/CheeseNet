import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faArrowLeft } from "@fortawesome/free-solid-svg-icons";

export default function SideLeft({ users, user, clickOpenMess }) {
  const [filterUsers, setFilterUsers] = useState([]);
  const [isOpenLeft, setIsOpenLeft] = useState(false);

  useEffect(() => {
    if (user && user.friends && Array.isArray(user.friends)) {
      const filteredFriends = users.filter((u) => user.friends.includes(u.uid));
      setFilterUsers(filteredFriends);
    }
  }, [user, users]);

  const toggleOpenLeft = () => {
    setIsOpenLeft(!isOpenLeft);
  };

  const sideLefttRef = useRef(null);

  // Sự kiện đóng khi click bên ngoài SideRight
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Kiểm tra nếu bấm ra ngoài SideRight và SideRight đang mở
      if (
        sideLefttRef.current &&
        !sideLefttRef.current.contains(event.target) &&
        isOpenLeft
      ) {
        setIsOpenLeft(false);
      }
    };

    // Thêm event listener khi click vào tài liệu
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      // Loại bỏ sự kiện khi component unmount
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpenLeft]);

  const liStyles =
    "flex items-center py-3 pl-3 text-sm hover:bg-blue-400 cursor-pointer select-none text-sm rounded";
  return (
    <div className="relative z-10" ref={sideLefttRef}>
      <div
        className={` bg-galaxy-2 sm:fixed sm:flex lg:w-80 md:w-60 sm:w-[190px] sm:z-0 flex-col fixed top-[64px] max-w-[500px] w-[60%] h-[calc(100vh-64px)] overflow-y-auto pl-4 left-0 bottom-0 border-r bg-white transition-all duration-300 ease-in-out transform ${
          isOpenLeft ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center my-3 border-b pb-2">
          <p className="text-lg font-semibold text-[#001F3F]">
            Danh sách bạn bè
          </p>
        </div>
        <ul>
          {filterUsers &&
            filterUsers
              .sort((a, b) => a.createdAt - b.createdAt)
              .map((user, index) => (
                <li
                  key={user.uid}
                  className={liStyles}
                  onClick={() => clickOpenMess(user.uid)}
                >
                  <Image
                    className="mx-2 rounded-full w-8 h-8 object-cover"
                    src={
                      user.avatar ? user.avatar : "/images/defaultavatar.jpg"
                    }
                    width={30}
                    height={30}
                    alt={user.username ? user.name : "ccc"}
                    loading="lazy"
                  />
                  <p className="text-base text-[#001F3F] font-medium">
                    {user.username}
                  </p>
                </li>
              ))}
        </ul>
      </div>
      <div className="fixed left-0 top-[155px] bg-lime-100 hover:bg-lime-300 px-3 py-2 text-xl rounded-e-xl z-[10] cursor-pointer opacity-70">
        {isOpenLeft ? (
          <FontAwesomeIcon
            icon={faArrowLeft}
            onClick={toggleOpenLeft}
            width={18}
            height={18}
          />
        ) : (
          <FontAwesomeIcon
            icon={faArrowRight}
            onClick={toggleOpenLeft}
            width={18}
            height={18}
          />
        )}
      </div>
    </div>
  );
}
