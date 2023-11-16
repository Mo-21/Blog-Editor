import Login from "./Sign-in";
import Dashboard from "./Dashboard";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Post from "./Post";
import Create from "./CreatePost";
import { AuthProvider } from "./AuthContext";
import Delete from "./Delete";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/logout" />
          <Route path="/dashboard/:postId" element={<Post />} />
          <Route path="/dashboard/:postId" element={<Post />} />
          <Route path="/create" element={<Create />} />
          {/* <Route path="dashboard/:postId/delete" element={<Delete />} /> */}
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
