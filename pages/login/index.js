import Head from "next/head";
import SignIn from "../../components/custom/signin";

export default function LoginPage() {
  return (
    <div className="overflow-hidden">
      <Head>
        <title>Đăng nhập</title>
        <link rel="icon" href="/icon.png" />
      </Head>
      <SignIn />
    </div>
  );
}
