import Link from "next/link";
import { useRouter } from "next/router";

const Sidebar = () => {
  const router = useRouter();
  return (
    <div className="sidebar sidebar flex justify-center items-center flex-col relative mt-[64px] left-2/4 -translate-x-2/4 sm:w-[40%] w-[90%]">
      <h2 className="text-2xl font-bold my-5">Nguồn tin tức</h2>
      <ul className="flex ">
        <li className="mx-3 font-semibold text-xl">
          <Link
            href="/news/vnexpress"
            className={`px-4 py-2 ${
              router.pathname === "/news/vnexpress"
                ? "border-b-2 border-blue-500 bg-white text-black"
                : "text-black hover:bg-blue-200 hover:text-blue-600"
            }`}
          >
            VN Express
          </Link>
        </li>
        <li className="mx-3 font-semibold text-xl">
          <Link
            href="/news/thenewyorktimes"
            className={`px-4 py-2 ${
              router.pathname === "/news/thenewyorktimes"
                ? "border-b-2 border-red-500 text-black"
                : "text-black hover:bg-blue-200 hover:text-blue-600"
            }`}
          >
            The New York Times
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
