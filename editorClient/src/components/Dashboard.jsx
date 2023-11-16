import PostsProfile from "./FetchingPosts";
import Logout from "./Logout";
import { Link } from "react-router-dom";

export function Navbar() {
  return (
    <>
      <div className="title">Mo's Blog</div>
    </>
  );
}

function Dashboard() {
  return (
    <>
      <Navbar />
      <div className="action-group">
        <Link to="/create">
          <button className="btn btn-success mx-2">Create New Article</button>
        </Link>
        <Logout />
      </div>
      <PostsProfile />
    </>
  );
}

export default Dashboard;
