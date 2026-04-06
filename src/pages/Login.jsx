import { useState } from "react";
import API from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await API.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      toast.success("Logged in successfully!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid email or password.");
      setError(err.response?.data?.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-slate-50 p-6">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-[radial-gradient(#c4b5fd_1px,transparent_1px)] [background-size:28px_28px] opacity-25 pointer-events-none"></div>
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="bg-white border border-slate-200 rounded-3xl p-10 w-full max-w-md shadow-[0_12px_40px_rgba(109,40,217,0.08)] relative z-10 animate-[slideUp_0.4s_cubic-bezier(0.22,1,0.36,1)]">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="w-11 h-11 bg-gradient-to-br from-purple-600 to-purple-400 rounded-xl flex items-center justify-center text-xl shadow-[0_4px_14px_rgba(109,40,217,0.18)]">
            <span>🔗</span>
          </div>
          <span className="text-2xl font-extrabold bg-gradient-to-br from-purple-700 to-cyan-600 bg-clip-text text-transparent tracking-tight">
            Shortly
          </span>
        </div>

        <h1 className="text-2xl font-extrabold text-center text-slate-900 mb-1.5 tracking-tight">
          Welcome back
        </h1>
        <p className="text-center text-slate-500 text-sm mb-8">
          Sign in to manage your short links
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label
              className="block text-xs font-semibold text-slate-900 mb-2 tracking-wide uppercase"
              htmlFor="email"
            >
              Email
            </label>
            <input
              id="email"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm outline-none transition-all placeholder:text-slate-400 focus:bg-purple-50 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div>
            <label
              className="block text-xs font-semibold text-slate-900 mb-2 tracking-wide uppercase"
              htmlFor="password"
            >
              Password
            </label>
            <input
              id="password"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm outline-none transition-all placeholder:text-slate-400 focus:bg-purple-50 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3.5 bg-gradient-to-br from-purple-700 to-purple-800 text-white text-[15px] font-bold rounded-xl shadow-[0_4px_18px_rgba(109,40,217,0.18)] transition-all hover:opacity-95 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(109,40,217,0.18)] active:translate-y-0 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <p className="text-center mt-7 text-sm text-slate-500">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-purple-600 font-semibold hover:text-purple-700 transition-colors"
          >
            Create one &rarr;
          </Link>
        </p>
      </div>
      
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}