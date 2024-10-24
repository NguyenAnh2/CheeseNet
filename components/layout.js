import Footer from "./footer";
import Heading from "./heading";
import ParentOpenMessage from "./parent_open_message";
import SideRight from "./sidebar_right";
import RandomImageBackground from "./custom/custom_bg";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";

config.autoAddCss = false;

export default function Layout({ children }) {
  return (
    <div className="relative pb-20 font-sans min-h-screen overflow-hidden">
      <RandomImageBackground />
      <div className="absolute inset-0 bg-black opacity-35"></div>
      <Heading />
      <ParentOpenMessage />
      <SideRight />
      {children}
      <Footer />
    </div>
  );
}
