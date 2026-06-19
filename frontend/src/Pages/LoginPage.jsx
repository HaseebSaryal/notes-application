import { useState } from "react";
import { LogIn } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router";
import api from "../libs/axios";
import { saveAuthSession } from "../libs/auth";
import useAuthSession from "../libs/useAuthSession";

const LoginPage = () => {
  const { user, token } = useAuthSession();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!username.trim() || !password.trim()) {
      toast.error("Enter your username and password");
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", { username, password });
      saveAuthSession({ token: data.token, user: data.user });
      toast.success("Logged in successfully");
      navigate("/");
    } catch (error) {
      toast.error(error?.response?.data?.msg || "Failed to log in");
    } finally {
      setLoading(false);
      setPassword("");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-base-200">
      <div className="w-full max-w-md bg-base-100 border border-base-300 rounded-none sm:rounded p-8">

        <h1 className="text-xl font-semibold text-base-content mb-1">Sign in</h1>
        <p className="text-sm text-base-content/50 mb-8">
          Or{" "}
          <Link to="/" className="text-primary hover:underline">continue as guest</Link>
        </p>

        {token && (
          <div className="mb-6 p-3 border border-primary/30 text-sm text-base-content/70">
            Signed in as <span className="text-primary font-medium">{user?.username}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-base-content/70 mb-1">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="your username"
              className="w-full px-3 py-2 bg-base-200 border border-base-300 text-base-content text-sm focus:outline-none focus:border-primary transition-colors"
              autoComplete="username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-base-content/70 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2 bg-base-200 border border-base-300 text-base-content text-sm focus:outline-none focus:border-primary transition-colors"
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-content text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-60"
          >
            {loading
              ? <span className="loading loading-spinner loading-xs" />
              : <LogIn className="size-4" />
            }
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="text-sm text-base-content/40 mt-6">
          Don't have an account?{" "}
          <Link to="/register" className="text-primary hover:underline">Register</Link>
        </p>

      </div>
    </div>
  );
};

export default LoginPage;