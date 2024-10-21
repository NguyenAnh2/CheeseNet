import Layout from "../../components/layout";
import Heading from "../../components/heading";
import Head from "next/head";
import { useAuth } from "../../components/auth";
import { useState, useEffect } from "react";
import Link from "next/link";
import ParentOpenMessage from "../../components/parent_open_message";
import SideRight from "../../components/sidebar_right";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserMinus, faUserPlus } from "@fortawesome/free-solid-svg-icons";

export default function Friends() {
  const [users, setUsers] = useState([]);
  const [friendIds, setFriendIds] = useState([]); // Lưu trữ danh sách bạn bè
  const [pendingRequests, setPendingRequests] = useState([]); // Lưu trữ danh sách lời mời đang chờ
  const { userId } = useAuth();
  const [sentRequests, setSentRequests] = useState([]); // Lưu trữ danh sách lời mời đã gửi
  const [isLoading, setIsLoading] = useState(true);

  const getUsers = async () => {
    try {
      const response = await fetch(`/api/users/get`, {
        method: "GET",
      });

      if (response.ok) {
        const entries = await response.json();
        setUsers(entries);
        setIsLoading(false);
      } else {
        const errorData = await response.json();
        console.error(errorData.error);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setIsLoading(false);
    }
  };

  const removeFriend = async (friendId) => {
    try {
      const response = await fetch(`/api/friends/remove`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ uid: userId, friendId }),
      });

      if (response.ok) {
        setFriendIds((prevFriends) =>
          prevFriends.filter((id) => id !== friendId)
        );
        console.log("Friend removed successfully");
      } else {
        console.error("Failed to remove friend");
      }
    } catch (error) {
      console.error("Error removing friend:", error);
    }
  };

  // Lấy danh sách bạn bè và lời mời kết bạn
  const getFriendsAndRequests = async () => {
    try {
      const response = await fetch(`/api/friends/get?userId=${userId}`, {
        method: "GET",
      });

      if (response.ok) {
        const data = await response.json();
        setFriendIds(data.friends);
        setPendingRequests(data.receivedFriendRequests); // Lời mời nhận được
        setSentRequests(data.sentFriendRequests.map((req) => req.to)); // Lời mời đã gửi
      } else {
        console.error("Error fetching friends");
      }
    } catch (error) {
      console.error("Failed to fetch friends or requests:", error);
    }
  };

  // Toggle yêu cầu kết bạn (gửi hoặc thu hồi yêu cầu)
  const toggleFriendRequest = async (toUserId) => {
    try {
      const response = await fetch(`/api/friends/request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ from: userId, to: toUserId }),
      });

      if (response.ok) {
        getFriendsAndRequests();
      } else {
        console.error("Failed to toggle friend request");
      }
    } catch (error) {
      console.error("Error toggling friend request:", error);
    }
  };

  // Chấp nhận hoặc từ chối lời mời kết bạn
  const handleFriendRequest = async (fromUserId, action) => {
    try {
      const response = await fetch(`/api/friends/respond`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ from: fromUserId, to: userId, action }),
      });

      if (response.ok) {
        console.log(
          `Friend request ${action === "accept" ? "accepted" : "declined"}`
        );
        getFriendsAndRequests();
      } else {
        console.error(`Failed to ${action} friend request`);
      }
    } catch (error) {
      console.error(`Error ${action} friend request:`, error);
    }
  };

  useEffect(() => {
    getUsers();
    getFriendsAndRequests();
  }, []);

  const [isModalDelete, setIsModalDelete] = useState(false);
  const [idToDelete, setIdToDelete] = useState();

  const setModalDelete = (userId) => {
    setIdToDelete(userId);
    setIsModalDelete(!isModalDelete);
  };

  return (
    <Layout>
      <Head>
        <title>Friends</title>
      </Head>

      {/* <Heading />
      <ParentOpenMessage />
      <SideRight /> */}

      <div className="flex justify-center items-center flex-col relative mt-[64px] left-2/4 -translate-x-2/4 sm:w-[40%] w-[90%]">
        {isModalDelete && (
          <div className="absolute top-[100%] bottom-0 right-0 left-0 ">
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
                <button className="text-red-500 " onClick={setModalDelete}>
                  Hủy
                </button>
              </div>
            </div>
          </div>
        )}
        <h1 className="text-3xl font-bold text-pink-300">Bạn bè</h1>
        {users.map((user) => (
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
                    />
                    <div className="text-lg mx-3">{user.username}</div>
                  </div>
                </Link>
                <div className="">
                  {/* Nếu người dùng đã là bạn bè */}
                  {friendIds.includes(user.uid) ? (
                    <div>
                      <span className="text-green-500">Bạn bè</span>
                      <button
                        onClick={(e) => setModalDelete(user.uid)}
                        className="text-red-500 mx-3"
                      >
                        Xóa
                      </button>
                    </div>
                  ) : pendingRequests.some((req) => req.from === user.uid) ? (
                    // Người nhận lời mời kết bạn, hiển thị các nút đồng ý và từ chối
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
                    // Người đã gửi lời mời kết bạn, hiển thị nút thu hồi
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded"
                      onClick={() => toggleFriendRequest(user.uid)}
                    >
                      <FontAwesomeIcon icon={faUserMinus} />
                    </button>
                  ) : (
                    // Nếu không có kết nối nào, hiển thị nút để gửi lời mời kết bạn
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
        ))}
      </div>
    </Layout>
  );
}
