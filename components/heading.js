import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import { useAuth } from "./auth";
import Image from "next/image";
import Link from "next/link";

export default function Heading() {
  const { userId } = useAuth();
  const { logout } = useAuth();
  const [user, setUser] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const getUser = async () => {
    try {
      const response = await fetch(`/api/users/get?uid=${userId}`)
        .then((res) => res.json())
        .then((data) => {
          setUser(data);
          setIsLoading(false);
        })
        .catch(() => {
          const errorData = response.json();
          setError(errorData.error);
          setIsLoading(true);
        });
    } catch (error) {
      setError("Failed to fetch posts entries.");
      console.error("Error fetching posts:", error);
    }
  };

  useEffect(() => {
    getUser();
  }, [isLoading]);



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
              width={10}
              height={10}
              icon={faMagnifyingGlass}
              className="absolute sm:right-3 text-red-200 sm:text-slate-500 top-2/4 -translate-y-2/4 cursor-pointer"
            />
          </div>
        </div>

        <ul className="flex">
          {user && !isLoading ? (
            <div className="flex items-center">
              <Link href="profile" className="flex items-center">
                <li className={``}>
                  <Image
                    className="w-8 h-8 rounded-full overflow-hidden object-cover"
                    src={user.avatar ? user.avatar : '/images/defaultavatar.jpg'}
                    width={30}
                    height={30}
                    alt={user.username ? user.name : "cc"}
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
    </div>
  );
}
