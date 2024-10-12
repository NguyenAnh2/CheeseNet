import Layout from "../../components/layout";
import Heading from "../../components/heading";
import Head from "next/head";
import Link from "next/link";

export default function FirstPost() {
  return (
    <Layout>
      <Head>
        <title>Friends</title>
      </Head>
      <Heading />
      <h1 className="text-3xl font-bold text-pink-300">friends</h1>
      <h2>
        <Link href="/" className="text-3xl font-bold underline">
          ← Back to home
        </Link>
      </h2>
    </Layout>
  );
}
