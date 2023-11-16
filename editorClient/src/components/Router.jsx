import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Dashboard from "./Dashboard";
import ErrorPage from "./ErrorPage";
import Post from "./Post";
import Logout from "./Logout";
import App from "./App";
import Create from "./CreatePost";
import Delete from "./Delete";

const Router = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <App />,
      errorElement: <ErrorPage />,
    },
    {
      path: "/dashboard",
      element: <Dashboard />,
      errorElement: <ErrorPage />,
    },
    {
      path: "/logout",
      element: <Logout />,
      errorElement: <ErrorPage />,
    },
    {
      path: "dashboard/:postId",
      element: <Post />,
      errorElement: <ErrorPage />,
    },
    {
      path: "/create",
      element: <Create />,
      errorElement: <ErrorPage />,
    },
    // {
    //   path: "dashboard/:postId/delete",
    //   element: <Delete />,
    //   errorElement: <ErrorPage />,
    // },
  ]);
  return <RouterProvider router={router} />;
};

export default Router;
