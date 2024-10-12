import { createContext, useContext, useState, useEffect } from "react";

// Tạo Context cho Auth
const AuthContext = createContext(null);

// Tạo Provider cho Auth
export const AuthProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Khi component mount, kiểm tra nếu token đã được lưu trong localStorage
    const storedUserId = localStorage.getItem("userId");

    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  const login = (userId) => {
    setUserId(userId);
    localStorage.setItem("userId", userId);
  };

  const logout = () => {
    setUserId(null);
    localStorage.removeItem("userId");
  };

  return (
    <AuthContext.Provider value={{ userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook để sử dụng AuthContext
export const useAuth = () => useContext(AuthContext);
