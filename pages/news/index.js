import Parser from "rss-parser";
import Link from "next/link";
import Layout from "../../components/layout";
import Head from "next/head";
import { useRouter } from "next/router";
import Sidebar from "../../components/custom/tabbar_news";
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

export default function News({ feed }) {
  const router = useRouter();
  return (
    <Layout>
      <Head>
        <title>Tin tức</title>
        <link rel="icon" href="/icon.png"/>
      </Head>
      <Sidebar />
      <div className="flex justify-center items-center flex-col relative left-2/4 -translate-x-2/4 sm:w-[40%] w-[90%]">
        <div>
          <h1 className="text-2xl font-bold flex justify-center items-center my-4 text-white">
            Tin tức mới nhất từ VN Express
          </h1>
          <ul className="w-full">
            {feed.items.length > 0 ? (
              feed.items.map((item) => (
                <li
                  key={item.link}
                  className="my-3 border rounded-md bg-galaxy-2 shadow-md w-full h-fit px-3 py-5 hover:opacity-85 flex justify-between"
                >
                  <a href={item.link} target="_blank" rel="noopener noreferrer">
                    <h2 className="font-bold text-xl mb-6 text-[#001F3F]">{item.title}</h2>
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
