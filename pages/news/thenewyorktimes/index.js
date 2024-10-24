import Parser from "rss-parser";
import Layout from "../../../components/layout";
import Head from "next/head";
import Sidebar from "../../../components/custom/tabbar_news";

export async function getStaticProps() {
  const parser = new Parser();
  let feed;

  try {
    feed = await parser.parseURL(
      `https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml`
    );
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

export default function GetRSS({ feed }) {
  return (
    <Layout>
      <Head>
        <title>The New York Times</title>
        <link rel="icon" href="/icon.png"/>
      </Head>
      <Sidebar />
      <div className="flex justify-center items-center flex-col relative left-2/4 -translate-x-2/4 sm:w-[40%] w-[90%]">
        <div>
          <h1 className="text-2xl font-bold flex justify-center items-center my-4 text-white">
            The New York Times
          </h1>
          <ul className="w-full">
            {feed.items.length > 0 ? (
              feed.items.map((item) => (
                <li
                  key={item.link}
                  className="my-3 border rounded-md bg-galaxy-2 shadow-md w-full h-fit px-3 py-5 hover:opacity-85 flex flex-col"
                >
                  <h2 className="font-bold text-xl mb-2 text-[#001F3F]">{item.title}</h2>
                  {item['media:content'] && item['media:content'].url && (
                    <img
                      className="mx-3 mb-2"
                      src={item['media:content'].url}
                      alt={item.title}
                      style={{ width: "100%", height: "auto" }}
                    />
                  )}
                  <p className="text-sm">{item.description}</p>
                  <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 mt-2">See more</a>
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
