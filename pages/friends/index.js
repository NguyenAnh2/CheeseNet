import Layout from "../../components/layout";
import Head from "next/head";
import { useGlobal } from "../../components/global_context";
import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserFriends, faWarning } from "@fortawesome/free-solid-svg-icons";
import Button from "../../components/custom/button";
import LoadingPage from "../../components/custom/loading-page";

export default function Friends() {
  // const [users, setUsers] = useState([]);
  const [friendIds, setFriendIds] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState();
  const { userId } = useGlobal();
  const { users } = useGlobal();

  const getInitialData = async () => {
    try {
      setIsLoading(true);

      const friendsResponse = await fetch(`/api/friends/get?uid=${userId}`);

      if (friendsResponse.ok) {
        const friendsData = await friendsResponse.json();

        setFriendIds(friendsData.friends);
        setPendingRequests(friendsData.receivedFriendRequests);
        setSentRequests(friendsData.sentFriendRequests.map((req) => req.to));
      } else {
        const friendsError = await friendsResponse.json();
        console.error(friendsError.error);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle yêu cầu kết bạn (gửi hoặc thu hồi yêu cầu)
  const toggleFriendRequest = useCallback(
    async (toUserId) => {
      try {
        const response = await fetch("/api/friends/request", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ from: userId, to: toUserId }),
        });

        if (response.ok) {
          await getInitialData();
        } else {
          console.error("Failed to toggle friend request");
        }
      } catch (error) {
        console.error("Error toggling friend request:", error);
      }
    },
    [userId]
  );

  // Chấp nhận hoặc từ chối lời mời kết bạn
  const handleFriendRequest = useCallback(
    async (fromUserId, action) => {
      try {
        const response = await fetch("/api/friends/respond", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ from: fromUserId, to: userId, action }),
        });

        if (response.ok) {
          await getInitialData();
          console.log(
            `Friend request ${action === "accept" ? "accepted" : "declined"}`
          );
        } else {
          console.error(`Failed to ${action} friend request`);
        }
      } catch (error) {
        console.error(`Error ${action} friend request:`, error);
      }
    },
    [userId]
  );

  useEffect(() => {
    if (userId) {
      getInitialData();
    }
  }, [userId]);

  const [isModalDelete, setIsModalDelete] = useState(false);
  const [idToDelete, setIdToDelete] = useState();

  const setModalDelete = (userId) => {
    setIdToDelete(userId);
    setIsModalDelete(!isModalDelete);
  };

  const removeFriend = async (friendId) => {
    try {
      const response = await fetch(`/api/friends/remove`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ uid: userId, friendId: friendId }),
      });

      if (response.ok) {
        setFriendIds((prevFriends) =>
          prevFriends.filter((id) => id !== friendId)
        );
        console.log("Xóa bạn thành công");
        setIsModalDelete(!isModalDelete);
      } else {
        setError("Failed to remove friend");
      }
    } catch (error) {
      setError("Error removing friend");
    }
  };

  // Dùng useMemo để giảm số lần tạo lại các phần tử giao diện
  const userElements = useMemo(() => {
    return (
      users &&
      users.map((user) => (
        <div key={user.uid} className="mb-4 ">
          {user.uid !== userId &&
            user.uid !== "8cvcdVO0GDSOsp4TgqJhy0Hjc6r2" && (
              <div className="flex items-center justify-between border p-4 rounded-lg bg-galaxy-2">
                <Link href={`/profile/${user.uid}`}>
                  <div className="flex items-center">
                    <img
                      className="rounded w-16 h-16 object-cover"
                      src={user.avatar}
                      alt={user.username}
                      width={60}
                      height={60}
                      loading="lazy"
                    />
                    <div className="text-lg mx-3">{user.username}</div>
                  </div>
                </Link>
                <div className="">
                  {friendIds && friendIds.includes(user.uid) ? (
                    <div>
                      <span className="text-green-500">
                        <FontAwesomeIcon
                          icon={faUserFriends}
                          width={30}
                          height={30}
                        />
                      </span>
                      <button
                        onClick={() => setModalDelete(user.uid)}
                        className=" mx-3"
                      >
                        ❌
                      </button>
                    </div>
                  ) : pendingRequests &&
                    pendingRequests.some((req) => req.from === user.uid) ? (
                    <div className="flex">
                      <button
                        className="mx-3"
                        onClick={() => handleFriendRequest(user.uid, "accept")}
                      >
                        <Button text={"✔️"} />
                      </button>
                      <button
                        className=""
                        onClick={() => handleFriendRequest(user.uid, "decline")}
                      >
                        <Button text={"❌"} />
                      </button>
                    </div>
                  ) : sentRequests.includes(user.uid) ? (
                    <button
                      className=""
                      onClick={() => toggleFriendRequest(user.uid)}
                    >
                      <Button text={"➖"} />
                    </button>
                  ) : (
                    <button
                      className=""
                      onClick={() => toggleFriendRequest(user.uid)}
                    >
                      <Button text={"➕"} />
                    </button>
                  )}
                </div>
              </div>
            )}
        </div>
      ))
    );
  }, [
    users,
    userId,
    friendIds,
    pendingRequests,
    sentRequests,
    toggleFriendRequest,
    handleFriendRequest,
  ]);

  return (
    <Layout>
      <Head>
        <title>Bạn bè</title>
        <link rel="icon" href="/icon.png" />
      </Head>

      {!userId && (
        <div className="fixed flex-col top-[64px] bottom-0 left-0 right-0 bg-slate-800 opacity-95 z-[1000] flex justify-center items-center">
          <FontAwesomeIcon
            icon={faWarning}
            className="relative text-yellow-300 "
            width={30}
            height={30}
          />
          <div className="text-2xl font-bold text-red-500">
            Vui lòng đăng nhập để thêm bạn bè.
          </div>
        </div>
      )}

      <div className="flex justify-center items-center flex-col relative mt-[64px] left-2/4 -translate-x-2/4 sm:w-[40%] w-[90%]">
        {isModalDelete && (
          <div className="absolute top-[50%] bottom-0 right-0 left-0">
            <div className="relative pb-16 flex justify-center items-center flex-col bg-blue-300 px-5 py-7 rounded-md shadow-lg">
              <p className="text-lg font-semibold">
                Bạn có chắc chắn muốn xóa bạn bè?
              </p>
              <div className="absolute items-center flex right-2 bottom-2">
                <div
                  className="mx-4 px-2 py-1 "
                  onClick={() => removeFriend(idToDelete)}
                >
                  <Button text={"Xác nhận"} />
                </div>
                <div
                  className="text-red-500"
                  onClick={() => setIsModalDelete(false)}
                >
                  <Button text={"Hủy"} />
                </div>
              </div>
            </div>
          </div>
        )}
        <h1 className="text-3xl text-center font-semibold mt-4 mb-6">
          Danh sách bạn bè
        </h1>
        {userId && (
          <div className="w-[80%]">
            {isLoading ? <LoadingPage /> : userElements}
          </div>
        )}
      </div>
    </Layout>
  );
}
