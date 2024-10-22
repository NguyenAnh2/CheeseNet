export const fetchPost = async (postId) => {
  try {
    const response = await fetch(`/api/posts/get?postId=${postId}`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
    return await response.json();
    
  } catch (error) {
    return error;
  }
};
