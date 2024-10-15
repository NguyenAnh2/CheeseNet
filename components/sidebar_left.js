import Image from "next/image";
import { useState, useEffect } from "react";
import { useAuth } from "./auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faArrowLeft } from "@fortawesome/free-solid-svg-icons";

export default function SideLeft({ users, clickOpenMess }) {
  const [filterUsers, setFilterUsers] = useState([]);
  const [isOpenLeft, setIsOpenLeft] = useState(false);
  const { userId } = useAuth();

  useEffect(() => {
    if (userId) {
      if (users && users.length > 0) {
        const filtered = users.filter((item) => item.uid !== userId);
        setFilterUsers(filtered);
      }
    }
  }, [users]);

  const toggleOpenLeft = () => {
    setIsOpenLeft(!isOpenLeft);
  };

  const liStyles =
    "flex items-center py-3 pl-3 text-sm hover:bg-slate-300 cursor-pointer select-none text-sm";
  return (
    <div className="z-10">
      <div
        className={`sm:fixed sm:flex lg:w-80 md:w-60 sm:w-[190px] sm:z-0 flex-col fixed top-[64px] max-w-[500px] w-[60%] h-[calc(100vh-64px)] overflow-y-auto pl-4 left-0 bottom-0 border-r z-10 bg-white transition-all duration-300 ease-in-out transform ${
          isOpenLeft ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center my-3 border-b pb-2">
          <p>Danh sách bạn bè</p>
        </div>
        <ul>
          {filterUsers &&
            filterUsers.map((user, index) => (
              <li
                key={user.uid}
                className={liStyles}
                onClick={() => clickOpenMess(user.uid)}
              >
                <Image
                  className="mx-2 rounded-full w-8 h-8 object-cover"
                  src={user.avatar}
                  width={30}
                  height={30}
                  alt={`${user.username}`}
                />
                {user.username}
              </li>
            ))}
        </ul>
      </div>
      <div className="fixed left-0 top-[155px] bg-lime-100 hover:bg-lime-300 px-3 py-2 text-xl rounded-e-xl z-[10] cursor-pointer opacity-70">
        {isOpenLeft ? (
          <FontAwesomeIcon icon={faArrowLeft} onClick={toggleOpenLeft} />
        ) : (
          <FontAwesomeIcon icon={faArrowRight} onClick={toggleOpenLeft} />
        )}
      </div>
    </div>
  );
}
