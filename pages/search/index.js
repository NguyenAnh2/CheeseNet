import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Head from "next/head";
import Layout from "../../components/layout";

const SearchPage = () => {
  const router = useRouter();
  const { query } = router.query; 

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
      <Head>
        <title>Tìm kiếm</title>
        <link rel="icon" href="/icon.png"/>
      </Head>
      {error && <p>{error}</p>}
      <h1 className="absolute top-[64px] mt-3 left-[50%] translate-x-[-50%] text-2xl font-bold text-[#001F3F]">
        Kết quả tìm kiếm cho: <span className="text-yellow-400">{query}</span>
      </h1>
      {user ? (
        <div className="relative top-32 w-[40%] left-[100%] translate-x-[-175%] h-fit mb-36 duration-300  text-[#001F3F] group cursor-pointer bg-[#ccdf7b] dark:bg-[#22272B] rounded-3xl p-4 hover:bg-[#e6ff78] hover:dark:bg-[#0C66E4]">
          <div className="w-[100%] flex flex-col justify-center items-center">
            <div>
              <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-[#001F3F] my-4">
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
                  <div className="relative w-60 h-60 object-cover cursor-pointer rounded-full overflow-hidden flex justify-center">
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
