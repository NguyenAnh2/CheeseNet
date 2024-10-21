const FriendsComponent = ({ userId }) => {
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    async function fetchFriends() {
      const response = await fetch(`/api/friends?userId=${userId}`);
      const data = await response.json();
      setFriends(data);
    }
    fetchFriends();
  }, [userId]);

  return (
    <div>
      {friends.map((friend) => (
        <FriendCard key={friend._id} friend={friend} />
      ))}
    </div>
  );
};
