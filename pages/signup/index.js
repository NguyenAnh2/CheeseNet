import SignUp from "../../components/custom/signup";
import Head from "next/head";

const RegisterForm = () => {
  return (
    <div className="">
      <Head>
        <title>Đăng ký</title>
        <link rel="icon" href="/icon.png"/>
      </Head>
      <SignUp />
    </div>
  );
};

export default RegisterForm;
