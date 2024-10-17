export const fetchUser = async (userId) => {
  try {
    const response = await fetch(`/api/users/?uid=${userId}`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    return error;
  }
};
