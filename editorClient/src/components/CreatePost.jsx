import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function Create() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState();
  const [isDraft, setIsDraft] = useState(false);

  const { accessToken, setAccessToken } = useAuth();
  const navigate = useNavigate();

  const handleContent = (e) => {
    setContent(e.target.value);
  };

  const handleTitle = (e) => {
    setTitle(e.target.value);
  };
  const handleSubmission = async (e) => {
    setLoading(true);
    if (!title || !content)
      throw new Error(setError("All field are required!"));
    e.preventDefault();

    try {
      const response = await fetch("/api/dashboard/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ title, content, isDraft }),
      });
      console.log(response);
      if (response.status === 401) {
        throw new Error(setError("Unauthorized"));
      } else if (response.status === 500) {
        throw new Error(setError("Invalid Content"));
      } else if (!response.ok) {
        throw new Error(setError("Something went wrong. Please try again"));
      }
      navigate("/dashboard");
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <div className="create-group">
        <form className="create" onSubmit={handleSubmission}>
          <label htmlFor="title">Title</label>
          <input
            onChange={handleTitle}
            type="text"
            id="title"
            name="title"
            value={title}
            required
          />

          <label htmlFor="content">Content</label>
          <textarea
            cols={70}
            rows={100}
            onChange={handleContent}
            type="text"
            value={content}
            id="content"
            name="content"
            required
          />
          <div className="status">
            <input
              className="form-check-input"
              type="checkbox"
              checked={isDraft}
              onChange={(e) => setIsDraft(e.target.checked)}
              id="flexCheckDefault"
            />

            <label className="form-check-label" htmlFor="flexCheckDefault">
              Draft?
            </label>
          </div>
          <button className="btn btn-success mb-3 mt-3">Submit</button>
        </form>
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {loading && <p style={{ color: "red" }}>Loading...</p>}
    </>
  );
}
