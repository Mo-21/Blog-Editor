import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

function Logout() {
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleLogout = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/logout");
      const data = response.json();
      if (!response.ok) {
        throw new Error("Invalid credentials");
      }
      Cookies.remove("username");
      navigate("/");
    } catch (err) {
      setError(err.message);
      return <>{error}</>;
    }
  };

  return (
    <>
      <button onClick={handleLogout} className="btn btn-warning mx-2">
        Logout
      </button>
    </>
  );
}

export default Logout;
