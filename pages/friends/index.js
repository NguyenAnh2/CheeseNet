import Layout from "../../components/layout";
import Head from "next/head";
import { toast } from "react-toastify";
import { useAuth } from "../../components/auth";
import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserMinus, faUserPlus } from "@fortawesome/free-solid-svg-icons";

export default function Friends() {
  const [users, setUsers] = useState([]);
  const [friendIds, setFriendIds] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const { userId } = useAuth();
  const [sentRequests, setSentRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Tối ưu hóa các fetch calls với Promise.all
  const getInitialData = async () => {
    try {
      setIsLoading(true);

      const [usersResponse, friendsResponse] = await Promise.all([
        fetch("/api/users/get", { method: "GET" }),
        fetch(`/api/friends/get?uid=${userId}`, { method: "GET" }),
      ]);

      if (usersResponse.ok && friendsResponse.ok) {
        const usersData = await usersResponse.json();
        const friendsData = await friendsResponse.json();

        setUsers(usersData);
        setFriendIds(friendsData.friends);
        setPendingRequests(friendsData.receivedFriendRequests);
        setSentRequests(friendsData.sentFriendRequests.map((req) => req.to));
      } else {
        const usersError = await usersResponse.json();
        const friendsError = await friendsResponse.json();
        console.error(usersError.error, friendsError.error);
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
        toast.success("Xóa bạn thành công");
        setIsModalDelete(!isModalDelete);
      } else {
        toast.error("Failed to remove friend");
      }
    } catch (error) {
      toast.error("Error removing friend");
    }
  };

  // Dùng useMemo để giảm số lần tạo lại các phần tử giao diện
  const userElements = useMemo(() => {
    return users.map((user) => (
      <div key={user.uid} className="mb-4 w-full">
        {user.uid !== userId && (
          <div className="flex items-center justify-between border p-4 rounded-lg">
            <Link href={`/profile/${user.uid}`}>
              <div className="flex items-center">
                <img
                  className="rounded"
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
              {friendIds.includes(user.uid) ? (
                <div>
                  <span className="text-green-500">Bạn bè</span>
                  <button
                    onClick={() => setModalDelete(user.uid)}
                    className="text-red-500 mx-3"
                  >
                    Xóa
                  </button>
                </div>
              ) : pendingRequests.some((req) => req.from === user.uid) ? (
                <div>
                  <button
                    className="bg-green-500 text-white px-3 py-1 rounded mx-2"
                    onClick={() => handleFriendRequest(user.uid, "accept")}
                  >
                    Đồng ý
                  </button>
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded"
                    onClick={() => handleFriendRequest(user.uid, "decline")}
                  >
                    Từ chối
                  </button>
                </div>
              ) : sentRequests.includes(user.uid) ? (
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded"
                  onClick={() => toggleFriendRequest(user.uid)}
                >
                  <FontAwesomeIcon icon={faUserMinus} />
                </button>
              ) : (
                <button
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                  onClick={() => toggleFriendRequest(user.uid)}
                >
                  <FontAwesomeIcon icon={faUserPlus} />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    ));
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
        <title>Friends</title>
      </Head>
      <Heading />
      <ParentOpenMessage />
      <SideRight />
      <div className="flex justify-center items-center flex-col relative mt-[64px] left-2/4 -translate-x-2/4 sm:w-[40%] w-[90%]">
        {isModalDelete && (
          <div className="absolute top-[100%] bottom-0 right-0 left-0">
            <div className="relative pb-16 flex justify-center items-center flex-col bg-blue-300 px-5 py-7 rounded-md shadow-lg">
              <p className="text-lg font-semibold">
                Bạn có chắc chắn muốn xóa bạn bè?
              </p>
              <div className="absolute flex right-2 bottom-2">
                <button
                  className="mx-4 rounded-md px-2 py-1 bg-red-500 text-white font-semibold text-lg"
                  onClick={() => removeFriend(idToDelete)}
                >
                  Đồng ý
                </button>
                <button
                  className="text-red-500"
                  onClick={() => setIsModalDelete(false)}
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        )}
        <h1 className="text-3xl text-center font-semibold mt-4 mb-6">
          Danh sách bạn bè
        </h1>
        {isLoading ? <p>Đang tải dữ liệu...</p> : userElements}
      </div>
    </Layout>
  );
}
