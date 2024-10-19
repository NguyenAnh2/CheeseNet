import "../styles/global.css";
import { AuthProvider } from "../components/auth";
import { SessionProvider } from "next-auth/react";

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <SessionProvider session={pageProps.session}>
        <Component {...pageProps} />
      </SessionProvider>
    </AuthProvider>
  );
}
