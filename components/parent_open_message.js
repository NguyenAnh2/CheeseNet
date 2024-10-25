import Message from "./message";
import SideLeft from "./sidebar_left";
import { useState, useEffect } from "react";
import { useGlobal } from "./global_context";

export default function ParentOpenMessage() {
  const [openMess, setOpenMess] = useState([]);
  const [findIndexUser, setFindIndexUser] = useState([]);
  const [toggleMiniState, setToggleMiniState] = useState({});
  const [error, setError] = useState("");
  const { userId } = useGlobal();
  const { users } = useGlobal();
  const [user, setUser] = useState();

  const findUserById = (userId) => {
    if (!users) return null;
    const user = users.find((user) => user.uid === userId);
    return user;
  };

  useEffect(() => {
    const user = userId ? findUserById(userId) : [];
    setUser(user);
  }, [users]);

  useEffect(() => {
    if (users && users.length > 0) {
      const initialState = users.reduce((acc, user) => {
        acc[user.uid] = true;
        return acc;
      }, {});
      setToggleMiniState(initialState);
    }
  }, [users]);

  const clickOpenMess = (key) => {
    if (!openMess.includes(key)) {
      if (openMess.length < 1 && users) {
        setOpenMess([...openMess, key]);
        setFindIndexUser([
          ...findIndexUser,
          users.findIndex((user) => user.uid === key),
        ]);
      } else if (openMess.length === 1 && users) {
        openMess.shift();
        findIndexUser.shift();
        setOpenMess([...openMess, key]);
        setFindIndexUser([
          ...findIndexUser,
          users.findIndex((user) => user.uid === key),
        ]);
      }
    }
  };

  function removeElement(array, elem) {
    var index = array.indexOf(elem);
    if (index > -1) {
      array.splice(index, 1);
      setOpenMess(array);
    }
  }

  function removeElementById(uid) {
    const ele = document.getElementById(uid);
    ele.remove();
    removeElement(openMess, uid);
    setToggleMiniState((prevState) => ({
      ...prevState,
      [uid]: true,
    }));
  }

  function miniMessage(uid) {
    const ele = document.getElementById(`inner_message_${uid}`);
    const send_form = document.getElementById("form-send-message");
    if (toggleMiniState[uid]) {
      ele.classList.add("hidden");
      send_form.classList.remove("absolute");
      send_form.classList.add("hidden");
    } else {
      ele.classList.remove("hidden");
      send_form.classList.remove("hidden");
      send_form.classList.add("absolute");
    }

    setToggleMiniState((prevState) => ({
      ...prevState,
      [uid]: !prevState[uid],
    }));
  }

  return (
    <div className="z-10">
      {findIndexUser && (
        <div className="max-w-[302px] w-full fixed flex mx-3 bottom-0 transition-all z-[1000]">
          {findIndexUser.map((indexUser) =>
            users[indexUser] ? (
              <Message
                user={users[indexUser]}
                openMess={openMess}
                removeElementById={removeElementById}
                miniMessage={miniMessage}
                toggleMiniState={toggleMiniState[users[indexUser].uid]}
              />
            ) : null
          )}
        </div>
      )}
      <SideLeft
        users={users ? users : []}
        user={user}
        clickOpenMess={clickOpenMess}
      />
    </div>
  );
}
