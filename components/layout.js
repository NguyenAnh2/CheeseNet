import Footer from "./footer";
import Heading from "./heading";
import ParentOpenMessage from "./parent_open_message";
import SideRight from "./sidebar_right";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Layout({ children }) {
  return (
    <div className="relative h-[200vh]">
      <Heading />
      <ParentOpenMessage />
      <SideRight />
      {children}
      <Footer />
    </div>
  );
}
