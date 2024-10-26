import { createContext, useContext, useState, useEffect } from "react";

const GlobalContext = createContext(null);

export const GlobalProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState([]);
  const [posts, setPosts] = useState([]);
  const [postsOfUser, setPostsOfUser] = useState([]);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");

    if (storedUserId) {
      setUserId(storedUserId);
    }

    if (userId) {
      const fetchData = async () => {
        try {
          const [
            usersResponse,
            postsResponse,
            userByIdResponse,
            postsOfUserResponse,
          ] = await Promise.all([
            fetch("/api/users/get"),
            fetch("/api/posts/get_of_user"),
            fetch(`/api/users/get?uid=${userId}`),
            fetch(`/api/posts/get?userId=${userId}`),
          ]);

          const [usersData, postsData, userData, postData] = await Promise.all([
            usersResponse.json(),
            postsResponse.json(),
            userByIdResponse.json(),
            postsOfUserResponse.json(),
          ]);

          setUsers(usersData);
          setPosts(postsData);
          setUser(userData);
          setPostsOfUser(postData);
        } catch (error) {
          console.error("Lỗi khi gọi API:", error);
        }
      };

      fetchData();
    }
  }, [userId]);

  const updatePostLikes = (postId, updatedLikes) => {
    setPostsOfUser((prevPosts) =>
      prevPosts.map((post) =>
        post._id === postId ? { ...post, likes: updatedLikes } : post
      )
    );
  };

  const login = (userId) => {
    setUserId(userId);
    localStorage.setItem("userId", userId);
  };

  const logout = () => {
    setUserId(null);
    localStorage.removeItem("userId");
  };

  return (
    <GlobalContext.Provider
      value={{ userId, login, logout, users, posts, user, postsOfUser, updatePostLikes }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobal = () => useContext(GlobalContext);
