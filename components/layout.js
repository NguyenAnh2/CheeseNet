import Footer from "./footer";
import Heading from "./heading";
import ParentOpenMessage from "./parent_open_message";
import SideRight from "./sidebar_right";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";

config.autoAddCss = false;

export default function Layout({ children }) {
  return (
    <div className="relative pb-20 font-sans bg-galaxy min-h-screen">
      <Heading />
      <ParentOpenMessage />
      <SideRight />
      {children}
      <Footer />
    </div>
  );
}
