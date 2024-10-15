import AddPost from "./add_post";
import GetPosts from "./get_posts";

export default function NewsFeed() {
  return (
    <div className="flex flex-col items-center ">
      <AddPost />

      <div className="w-full">
        <GetPosts />
      </div>
    </div>
  );
}
