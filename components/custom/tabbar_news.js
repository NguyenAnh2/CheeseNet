import Link from "next/link";
import Button from "./button";

const Sidebar = () => {
  return (
    <div className="sidebar sidebar flex justify-center items-center flex-col relative mt-[64px] left-2/4 -translate-x-2/4 sm:w-[40%] w-[90%]">
      <h2 className="text-2xl font-bold my-5">Nguồn tin tức</h2>
      <ul className="flex ">
        <li className="mx-3 font-semibold text-xl">
          <Link href="/news/vnexpress" className={`px-4 py-2`}>
            <Button text={"VN Express"}></Button>
          </Link>
        </li>
        <li className="mx-3 font-semibold text-xl">
          <Link href="/news/thenewyorktimes" className={`px-4 py-2`}>
            <Button text={"The New York Times"}></Button>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
