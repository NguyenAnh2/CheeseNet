import Parser from "rss-parser";
import Link from "next/link";
import Layout from "../../components/layout";
import Head from "next/head";
import Heading from "../../components/heading";
import ParentOpenMessage from "../../components/parent_open_message";
import SideRight from "../../components/sidebar_right";
import { useRouter } from "next/router";
export async function getStaticProps() {
  const parser = new Parser();
  let feed;

  try {
    feed = await parser.parseURL(`https://vnexpress.net/rss/tin-moi-nhat.rss`);
  } catch (error) {
    console.error("Error fetching RSS feed:", error);
    feed = { items: [] }; // Nếu có lỗi, trả về danh sách trống
  }

  return {
    props: {
      feed,
    },
    revalidate: 3600,
  };
}

export default function Sidebar({ feed }) {
  const router = useRouter();
  return (
    <Layout>
      <Head>
        <title>News</title>
      </Head>
      {/* <Heading />
      <ParentOpenMessage />
      <SideRight /> */}
      <div className="sidebar flex justify-center items-center flex-col relative mt-[64px] left-2/4 -translate-x-2/4 sm:w-[40%] w-[90%]">
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
      <div className="flex justify-center items-center flex-col relative mt-[20px] left-2/4 -translate-x-2/4 sm:w-[40%] w-[90%]">
        <div>
          <h1 className="text-2xl font-bold flex justify-center items-center my-4">
            Tin tức mới nhất từ VN Express
          </h1>
          <ul className="w-full">
            {feed.items.length > 0 ? (
              feed.items.map((item) => (
                <li
                  key={item.link}
                  className="my-3 border rounded-md bg-white shadow-md w-full h-fit px-3 py-5 hover:opacity-85 flex justify-between"
                >
                  <a href={item.link} target="_blank" rel="noopener noreferrer">
                    <h2 className="font-bold text-xl mb-6">{item.title}</h2>
                    <p className="text-sm text-blue-600">Xem thêm</p>
                  </a>
                  {item.enclosure && item.enclosure.url && (
                    <img
                      className="mx-3"
                      src={
                        item.enclosure.url
                          ? item.enclosure.url
                          : "/images/defaultavatar.jpg"
                      }
                      alt={item.title}
                      style={{ width: "150px", height: "auto" }}
                    />
                  )}
                </li>
              ))
            ) : (
              <li>No articles found</li>
            )}
          </ul>
        </div>
      </div>
    </Layout>
  );
}

Sidebar;
