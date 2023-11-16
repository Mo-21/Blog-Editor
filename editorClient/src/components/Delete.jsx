import { useAuth } from "./AuthContext";
// import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function Delete(id) {
  const navigate = useNavigate();
  const { accessToken, setAccessToken } = useAuth();
  const [error, setError] = useState(null);

  //   const param = useParams();
  useEffect(() => {
    const deletePost = async () => {
      try {
        const response = await fetch(`/dashboard/${id}/delete`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (response.status === 401) {
          throw new Error(setError("Unauthorized"));
        } else if (response.status === 500) {
          throw new Error(setError("Invalid Content"));
        } else if (!response.ok) {
          throw new Error(setError("Something went wrong. Please try again"));
        }
        const data = await response.json();
        navigate("/dashboard");
      } catch (err) {
        console.error(err);
      }
    };
    deletePost();
  }, []);

  return <>{error && <p style={{ color: "red" }}>{error}</p>}</>;
}

export default Delete;
