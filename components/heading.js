import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookOpen,
  faHome,
  faMagnifyingGlass,
  faPencil,
  faUserFriends,
} from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "./auth";
import Image from "next/image";
import { useRouter } from "next/router";
import Link from "next/link";
import Input from "./custom/input";

export default function Heading() {
  const router = useRouter();
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
  
  const [isSearch, setIsSearch] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const handleIsSearch = () => {
    setIsSearch(!isSearch);
  };

  const handleSubmitSearch = async (e) => {
    e.preventDefault();
    try {
      router.push(`/search?query=${searchValue}`);
    } catch (error) {
      setError("Failed to fetch posts entries.");
      console.error("Error fetching posts:", error);
    }
  };

  return (
    <div className="fixed bg-galaxy-2 w-full h-16 z-50 top-0">
      <div className="flex justify-between items-center h-16">
        <div className="flex items-center">
          <Link href="/">
            <Image
              className="rounded-full mx-2 w-8 h-8"
              src="/icon.png"
              width={30}
              height={30}
              alt="logoweb"
              loading="lazy"
            />
          </Link>
          <div className="relative">
            <form className="flex justify-between items-center" onSubmit={(e) => handleSubmitSearch(e)}>
              {isSearch && (
                <input
                  type="text"
                  placeholder="Search on CheeseNet"
                  className="inputSearch "
                  onChange={(e) => setSearchValue(e.target.value)}
                />
              )}
              {searchValue ? (
                <button type="submit">
                  <FontAwesomeIcon
                    width={20}
                    height={20}
                    icon={faMagnifyingGlass}
                    className={`absolute ${isSearch ? "right-3" : "right-[-3]"} text-red-200 md:text-white top-2/4 -translate-y-2/4 cursor-pointer`}
                  />
                </button>
              ) : (
                <FontAwesomeIcon
                  width={20}
                  height={20}
                  icon={faMagnifyingGlass}
                  onClick={handleIsSearch}
                  className={`absolute ${isSearch ? "right-3" : "right-[-3]"} text-red-200 md:text-slate-500 top-2/4 -translate-y-2/4 cursor-pointer`}
                />
              )}
            </form>
          </div>
        </div>
        <div className="absolute left-2/4 translate-x-[-50%] flex justify-center items-center lg:w-[40%] w-[28%]">
          <Link
            href="/"
            className="flex flex-col justify-center items-center w-[20%] cursor-pointer text-xl md:py-[22px] md:px-3 lg:py-2 py-[22px] hover:bg-blue-400 text-red-200 transition-all"
          >
            <FontAwesomeIcon
              className=""
              icon={faHome}
              width={20}
              height={20}
            />
            <p className="hidden lg:block lg:text-lg md:text-base">Trang chủ</p>
          </Link>
          {/* <Link
            href="/shorts"
            className="flex flex-col justify-center items-center w-[20%] cursor-pointer text-xl md:py-[22px] md:px-3 lg:py-2 py-[22px] hover:bg-blue-400 text-red-200"
          >
            <FontAwesomeIcon
              className=""
              icon={faVideo}
              width={20}
              height={20}
            />
            <p className="hidden lg:block lg:text-lg md:text-base">Shorts</p>
          </Link> */}
          <Link
            href="/diary"
            className="flex flex-col justify-center items-center w-[20%] cursor-pointer text-xl md:py-[22px] md:px-3 lg:py-2 py-[22px] hover:bg-blue-400 text-red-200 transition-all"
            title="Thêm nhật ký"
          >
            <FontAwesomeIcon
              className=""
              icon={faPencil}
              width={20}
              height={20}
            />
            <p className="hidden lg:block lg:text-lg md:text-base">Nhật ký</p>
          </Link>
          <Link
            href="/news"
            className="flex flex-col justify-center items-center w-[20%] cursor-pointer text-xl md:py-[22px] md:px-3 lg:py-2 py-[22px] hover:bg-blue-400 text-red-200 transition-all"
          >
            <FontAwesomeIcon
              className=""
              icon={faBookOpen}
              width={20}
              height={20}
            />
            <p className="hidden lg:block lg:text-lg md:text-base">Tin Tức</p>
          </Link>
          <Link
            href="/friends"
            className="flex flex-col justify-center items-center w-[20%] cursor-pointer text-xl md:py-[22px] md:px-3 lg:py-2 py-[22px] hover:bg-blue-400 text-red-200 transition-all"
          >
            <FontAwesomeIcon
              className=""
              icon={faUserFriends}
              width={20}
              height={20}
            />
            <p className="hidden lg:block lg:text-lg md:text-base">Bạn bè</p>
          </Link>
        </div>

        <ul className="flex">
          {user && !isLoading ? (
            <div className="flex items-center">
              <Link href="profile" className="flex items-center">
                <li className={``}>
                  <Image
                    className="w-8 h-8 rounded-full overflow-hidden object-cover"
                    src={
                      user.avatar ? user.avatar : "/images/defaultavatar.jpg"
                    }
                    width={30}
                    height={30}
                    alt={user.username ? user.name : "ccccccccc"}
                    loading="lazy"
                  />
                </li>
                <span className="hidden md:block font-semibold mx-3 text-white">
                  {user.username}
                </span>
              </Link>
              <Link href="login" className="mx-3 font-semibold text-white" onClick={logout}>
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
