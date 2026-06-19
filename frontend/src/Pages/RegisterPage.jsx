import { useState } from "react";
import { UserPlus } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router";
import api from "../libs/axios";
import { saveAuthSession } from "../libs/auth";
import useAuthSession from "../libs/useAuthSession";

const RegisterPage = () => {
  const { user, token } = useAuthSession();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!username.trim() || !password.trim()) {
      toast.error("Enter a username and password");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post("/auth/register", { username, password });
      saveAuthSession({ token: data.token, user: data.user });
      toast.success("Account created");
      navigate("/");
    } catch (error) {
      toast.error(error?.response?.data?.msg || "Failed to register");
    } finally {
      setLoading(false);
      setPassword("");
      setConfirmPassword("");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-base-200">
      <div className="w-full max-w-md bg-base-100 border border-base-300 rounded-none sm:rounded p-8">

        <h1 className="text-xl font-semibold text-base-content mb-1">Create account</h1>
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
              placeholder="choose a username"
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
              placeholder="create a password"
              className="w-full px-3 py-2 bg-base-200 border border-base-300 text-base-content text-sm focus:outline-none focus:border-primary transition-colors"
              autoComplete="new-password"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-base-content/70 mb-1">
              Confirm password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="repeat your password"
              className="w-full px-3 py-2 bg-base-200 border border-base-300 text-base-content text-sm focus:outline-none focus:border-primary transition-colors"
              autoComplete="new-password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-content text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-60"
          >
            {loading
              ? <span className="loading loading-spinner loading-xs" />
              : <UserPlus className="size-4" />
            }
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="text-sm text-base-content/40 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-primary hover:underline">Login</Link>
        </p>

      </div>
    </div>
  );
};

export default RegisterPage;