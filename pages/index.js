import Layout from "../components/layout";
import Heading from "../components/heading";
import ParentOpenMessage from "../components/parent_open_message";
import NewsFeed from "../components/news_feed";
import SideRight from "../components/sidebar_right";
import Head from "next/head";

export default function Home() {
  return (
    <Layout>
      <Head>
        <title>ChesseNet</title>
        <link rel="icon" href="/icon.png" />
      </Head>
      <Heading />
      <div className="relative w-full flex pt-16">
        <ParentOpenMessage />
        <div className="relative left-2/4 -translate-x-2/4 sm:w-[30%] w-[90%]">
          <NewsFeed />
        </div>
        <SideRight />
      </div>
    </Layout>
  );
}
