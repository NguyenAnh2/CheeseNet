import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Heading from "../../components/heading";
import ParentOpenMessage from "../../components/parent_open_message";
import SideRight from "../../components/sidebar_right";
import Layout from "../../components/layout";
import Heading from "../../components/heading";
import ParentOpenMessage from "../../components/parent_open_message";
import SideRight from "../../components/sidebar_right";

const SearchPage = () => {
  const router = useRouter();
  const { query } = router.query; // Lấy giá trị query

  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserSearch = async () => {
      try {
        const response = await fetch(`/api/users/get?search=${query}`);
        const data = await response.json();
        setUser(data);
      } catch (error) {
        setError("Có lỗi xảy ra khi lấy thông tin người dùng.");
        console.error(error);
      }
    };

    if (query) {
      fetchUserSearch();
    }
  }, [query]);

  const createdTime = (timestamp) => {
    let date = new Date(timestamp);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${day}/${month}/${year}`;
  };

  return (
    <Layout>
      <Heading />
      <ParentOpenMessage />
      <SideRight />
      {error && <p>{error}</p>}
      <h1 className="absolute top-[64px] left-[50%] translate-x-[-50%] text-2xl font-bold">
        Kết quả tìm kiếm cho: <span className="text-blue-700">{query}</span>
      </h1>
      {user ? (
        <div className="relative top-32 w-[40%] left-[100%] translate-x-[-175%] h-fit mb-36 duration-300  text-white group cursor-pointer bg-[#DCDFE4] dark:bg-[#22272B] rounded-3xl p-4 hover:bg-blue-200 hover:dark:bg-[#0C66E4]">
          <div className="w-[100%] flex flex-col justify-center items-center">
            <div>
              <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-pink-300 my-4">
                  Thông tin cá nhân
                </h1>
              </div>
              <div className="py-2">
                Tên người dùng:{" "}
                <span className="mx-2 font-semibold w-full">
                  {user.username}
                </span>
              </div>
              <div className="py-2">
                Email: <span className="mx-2 font-semibold">{user.email}</span>
              </div>
              <div className="flex justify-between items-center w-full">
                <div className="py-2">
                  Số điện thoại:
                  <span className="mx-2 font-semibold">{user.phonenumber}</span>
                </div>
              </div>
              <div className="flex flex-col">
                <div className="flex flex-col py-2 relative">
                  <p className="mb-3">Ảnh đại diện</p>
                  <div className="relative w-60 h-60 object-cover cursor-pointer rounded-full overflow-hidden">
                    <img src={user.avatar} alt="Preview" className="" />
                  </div>
                </div>
                <div className="py-2 text-slate-500">
                  Tài khoản được tạo vào: {createdTime(user.createdAt)}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p>Đang tải...</p>
      )}
    </Layout>
  );
};

export default SearchPage;
