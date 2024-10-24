import "../styles/global.css";
import { GlobalProvider } from "../components/global_context";
import { SessionProvider } from "next-auth/react";

export default function App({ Component, pageProps }) {
  return (
    <GlobalProvider>
      <SessionProvider session={pageProps.session}>
        <Component {...pageProps} />
      </SessionProvider>
    </GlobalProvider>
  );
}
