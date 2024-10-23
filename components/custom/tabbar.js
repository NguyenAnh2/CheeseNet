import Link from "next/link";
import { useRouter } from "next/router";
import Button from "./button";

export default function TabBar() {
  const router = useRouter();
  return (
    <ul className="fixed top-0 left-[50%] translate-x-[-50%] mt-16 flex items-center space-x-5 z-[1000]">
      <li>
        <Link href="/profile" className={`px-4 py-2`}>
          <Button text={"Thông tin"}></Button>
        </Link>
      </li>
      <li>
        <Link href="/diary" className={`px-4 py-2`}>
          <Button text={"Nhật ký"}></Button>
        </Link>
      </li>
    </ul>
  );
}

// className={`px-4 py-2 ${
//   router.pathname === "/diary"
//     ? "border-b-2 border-red-500 text-black"
//     : "text-black hover:bg-blue-200 hover:text-blue-600"
// }`}

// ${
//   router.pathname === "/profile"
//     ? "border-b-2 border-blue-500 bg-white text-black"
//     : "text-black hover:bg-blue-200 hover:text-blue-600"
// }
