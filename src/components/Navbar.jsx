import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Navbar() {
  const navigate = useNavigate();
  const userName = localStorage.getItem("userName") || "User";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <nav className="bg-white/90 border-b border-slate-200 backdrop-blur-md px-8 h-16 flex items-center justify-between sticky top-0 z-50 shadow-[0_1px_0_#e5e1f5,0_2px_12px_rgba(109,40,217,0.05)]">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/dashboard')}>
          <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-purple-400 rounded-lg flex items-center justify-center text-sm shadow-[0_2px_8px_rgba(109,40,217,0.18)]">
            <span>🔗</span>
          </div>
          <span className="text-lg font-extrabold bg-gradient-to-br from-purple-700 to-cyan-600 bg-clip-text text-transparent tracking-tight">
            Shortly
          </span>
        </div>
        <span className="text-sm text-slate-600 font-medium">Welcome, <span className="font-bold text-purple-600">{userName}</span>!</span>
      </div>

      <button
        onClick={handleLogout}
        className="px-4 py-2 bg-purple-50 text-purple-600 border-2 border-purple-200 font-semibold text-sm rounded-lg transition-all hover:bg-purple-100 hover:border-purple-300 hover:text-purple-700"
      >
        Logout
      </button>
    </nav>
  );
}