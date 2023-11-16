import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useAuth } from "./AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSignIn = async () => {
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Invalid credentials");
      }
      const data = await response.json();
      const jwt = Cookies.get("jwt");
      const accessToken = data.accessToken;

      if (response.status !== 200) {
        throw new Error("Unauthorized");
      } else {
        login(accessToken);
        navigate("/dashboard"); // Redirect to dashboard on successful login
      }
      // if (jwt)
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-group">
      <div className="login-group-2">
        <h1 className="header">Mo's Blog</h1>
        <h1 style={{ fontWeight: "bold" }}>Sign In</h1>
        <div className="login">
          <div>
            <label className="login-label">Email:</label>
            <input
              className="login-input"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="login-label">Password:</label>
            <input
              className="login-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>
        <button className="btn login-btn" onClick={handleSignIn}>
          Sign In
        </button>
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default Login;
