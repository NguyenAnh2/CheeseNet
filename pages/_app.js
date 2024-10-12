// Global styles for every components
import "../styles/global.css";
import { AuthProvider } from "../components/auth";

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}
