import Layout from "../components/layout";
import Heading from "../components/heading";
import ParentOpenMessage from "../components/parent_open_message";
import SideLeft from "../components/sidebar_left";
import NewsFeed from "../components/news_feed";
import SideRight from "../components/sidebar_right";
import Head from "next/head";
import Footer from "../components/footer";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";

config.autoAddCss = false;

export default function Home() {
  return (
    <Layout>
      <Head>
        <title>ChesseNet</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Heading />
      <div className="relative w-full flex pt-16">
        {/* <SideLeft /> */}
        <ParentOpenMessage />
        <div className="relative left-2/4 -translate-x-2/4 sm:w-[30%] w-[90%]">
          <NewsFeed />
        </div>
        <SideRight />
      </div>
      {/* <Footer /> */}
    </Layout>
  );
}
