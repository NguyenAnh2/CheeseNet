import { useState } from "react";
import { database } from "../firebase/firebaseConfig";
import { ref, child, push, set } from "firebase/database";
import { useAuth } from "../components/auth";

export const useReplyPost = () => {
  const [loading, setLoading] = useState(false);
  const { userId } = useAuth();

  const handleReplyPost = async ({ postId, userIdOwnPost, messageToReply }) => {
    setLoading(true);
    try {
      const chatId =
        userId > userIdOwnPost
          ? `${userId}_${userIdOwnPost}`
          : `${userIdOwnPost}_${userId}`;

      const messagesRef = child(ref(database), `chats/${chatId}/messages`);
      const newMessageRef = push(messagesRef);

      if (messageToReply) {
        const newMessage = {
          senderId: userId,
          receiverId: userIdOwnPost,
          content: messageToReply,
          postId: postId,
          isReply: true,
          timestamp: Date.now(),
        };

        await set(newMessageRef, newMessage);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      console.log("Done fetching");
    }
  };

  return { loading, handleReplyPost };
};
