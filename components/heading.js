import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { ref, get, child } from "firebase/database";
import { database } from "../firebase/firebaseConfig";
import { useState, useEffect } from "react";
import { useAuth } from "./auth";
import Image from "next/image";
import Link from "next/link";

export default function Heading() {
  const { userId } = useAuth();
  const { logout } = useAuth();
  const [user, setUser] = useState([]);

  const fetchUser = () => {
    const dbRef = ref(database);
    get(child(dbRef, `users/${userId}`))
      .then((snapshot) => {
        if (snapshot.val()) {
          setUser(snapshot.val());
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    fetchUser();
  }, [userId]);

  const liStylesCenter =
    "text-2xl py-3 px-7 rounded cursor-pointer hover:bg-slate-300 transition-all";

  return (
    <div className="fixed bg-slate-400 w-full h-16 z-50 top-0">
      <div className="flex justify-between items-center h-16">
        <div className="flex items-center">
          <Link href="/">
            <Image
              className="rounded-full mx-4 w-10 h-10"
              src="/images/icon.jpg"
              width={30}
              height={30}
              alt="logoweb"
            />
          </Link>
          <div className="relative">
            <input
              type="text"
              placeholder="Search on CheeseNet..."
              className="py-2 px-4 border-none outline-none text-base rounded-full w-full hidden sm:block"
            />
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              className="absolute sm:right-3 text-red-200 sm:text-slate-500 top-2/4 -translate-y-2/4 cursor-pointer"
            />
          </div>
        </div>

        <ul className="flex">
          {userId ? (
            <div className="flex items-center">
              <Link href="profile" className="flex items-center">
                <li className={``}>
                  <Image
                    className="w-8 h-8 rounded-full overflow-hidden object-cover"
                    src={user.avatar}
                    width={30}
                    height={30}
                    alt={user.username}
                  />
                </li>
                <span className="font-bold mx-3">{user.username}</span>
              </Link>
              <Link href="login" className="mx-3 font-bold" onClick={logout}>
                Đăng xuất
              </Link>
            </div>
          ) : (
            <div>
              <Link className="mx-3 font-bold" href="/login">
                Đăng nhập
              </Link>
              <Link className="mx-3 font-bold" href="/signup">
                Đăng ký
              </Link>
            </div>
          )}
        </ul>
      </div>
      {/* <ul className="flex absolute right-2/4 translate-x-2/4 top-2/4 -translate-y-2/4 h-16 text-center items-center">
        <Link href="/">
          <li className={liStylesCenter}>
            <FontAwesomeIcon icon={faHome} size="lg" />
          </li>
        </Link>
        <Link href="/watch">
          <li className={liStylesCenter}>
            <FontAwesomeIcon icon={faTv} size="lg" />
          </li>
        </Link>
        <Link href="/groups">
          <li className={liStylesCenter}>
            <FontAwesomeIcon icon={faPeopleGroup} size="lg" />
          </li>
        </Link>
        <Link href="/friends">
          <li className={liStylesCenter}>
            <FontAwesomeIcon icon={faUserFriends} size="lg" />
          </li>
        </Link>
      </ul> */}
    </div>
  );
}
