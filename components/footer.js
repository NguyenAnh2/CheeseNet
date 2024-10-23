import Link from "next/link";

export default function Footer() {
  return (
    <div className="absolute flex justify-center flex-col pb-5 items-center bottom-0 left-2/4 -translate-x-2/4 sm:w-[40%] w-[90%] select-none opacity-90">
      <h1 className="text-sm">Bản quyền thuộc về Cheese NetWork </h1>
      <Link href="/privacy" className="text-blue-400 text-sm">Chính sách bảo mật và bản quyền</Link>
    </div>
  );
}
