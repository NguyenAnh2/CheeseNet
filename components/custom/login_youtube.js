import { signIn, signOut, useSession } from "next-auth/react";

export default function LoginPage() {
  const { data: session } = useSession();

  return (
    <div>
      {!session ? (
        <div>
          <p>Bạn chưa đăng nhập</p>
          <button onClick={() => signIn("google")}>Đăng nhập với Google</button>
        </div>
      ) : (
        <div>
          <p>Welcome, {session.user.name}</p>
          <button onClick={() => signOut()}>Đăng ký</button>
        </div>
      )}
    </div>
  );
}
