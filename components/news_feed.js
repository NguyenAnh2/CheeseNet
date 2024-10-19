import AddPost from "./add_post";
import GetPosts from "./get_posts";

export default function NewsFeed({}) {
  return (
    <div className="">
      <AddPost />

      <div className="w-full">
        <GetPosts />
      </div>
    </div>
  );
}
