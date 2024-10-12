import Image from "next/image";
import { useState, useEffect } from "react";
import { useAuth } from "./auth";

export default function SideLeft({ users, clickOpenMess }) {
  const [filterUsers, setFilterUsers] = useState([]);
  const { userId } = useAuth();

  useEffect(() => {
    if (userId) {
      if (users && users.length > 0) {
        const filtered = users.filter((item) => item.uid !== userId);
        setFilterUsers(filtered);
      }
    } else {
      console.error("Không tìm thấy userId");
    }
  }, [users]);

  console.log(filterUsers);
  

  const liStyles =
    "flex items-center py-3 pl-3 text-sm hover:bg-slate-300 cursor-pointer select-none text-sm";
  return (
    <div>
      <div className="sm:fixed sm:flex lg:w-80 md:w-60 sm:w-[190px] flex-col hidden h-[calc(100vh-64px)] overflow-y-auto pl-4 left-0 bottom-0 border-r">
        <div className="flex justify-between items-center my-3 border-b pb-2">
          {filterUsers.length > 0 ? <p>Danh sách bạn bè</p> : <p>Đăng nhập bạn ơi!</p>}
        </div>
        <ul>
          {filterUsers.map((user, index) => (
            <li
              key={user.uid}
              className={liStyles}
              onClick={() => clickOpenMess(user.uid)}
            >
              <Image
                className="mx-2 rounded-full"
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
    </div>
  );
}
