import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";

export default function Dashboard() {
  const [url, setUrl] = useState("");
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [copiedId, setCopiedId] = useState(null);

  const BASE = import.meta.env.VITE_BASE_URL ;

  const fetchUrls = async () => {
    try {
      const res = await API.get("/api/url/my");
      setUrls(res.data);
    } catch {
      /* silent */
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchUrls();
  }, []);

  const handleShorten = async (e) => {
    e.preventDefault();
    if (!url.trim()) return;
    setError("");
    setLoading(true);
    try {
      await API.post("/api/url/shorten", { originalUrl: url });
      setUrl("");
      toast.success("URL shortened successfully!");
      await fetchUrls();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to shorten URL.");
      setError(err.response?.data?.message || "Failed to shorten URL.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (shortCode, id) => {
    navigator.clipboard.writeText(`${BASE}/${shortCode}`);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this URL?")) return;
    try {
      await API.delete(`/api/url/${id}`);
      toast.success("URL deleted successfully!");
      fetchUrls();
    } catch (err) {
      toast.error("Failed to delete URL");
    }
  };

  const totalClicks = urls.reduce((sum, u) => sum + (u.clicks || 0), 0);

  return (
    <div className="min-h-screen bg-slate-50 relative">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-purple-500/5 to-transparent pointer-events-none"></div>

      <Navbar />

      <div className="max-w-[860px] mx-auto px-6 py-10 relative z-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Your Links</h1>
          <p className="text-slate-500 text-sm mt-1">Shorten, share and track your URLs</p>
        </div>

        {/* Shorten Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-7 mb-7 shadow-[0_4px_16px_rgba(109,40,217,0.1),_0_1px_4px_rgba(0,0,0,0.05)]">
          <p className="text-xs font-semibold text-slate-400 tracking-wider uppercase mb-3">
            🔗 Shorten a new URL
          </p>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm mb-4">
              {error}
            </div>
          )}
          <form onSubmit={handleShorten}>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-[15px] outline-none transition-all placeholder:text-slate-400 focus:bg-purple-50 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10"
                placeholder="https://your-long-url.com/goes/here"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
                type="url"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-7 py-3 bg-gradient-to-br from-purple-700 to-purple-800 text-white text-[15px] font-bold rounded-xl shadow-[0_4px_16px_rgba(109,40,217,0.18)] transition-all hover:opacity-95 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(109,40,217,0.18)] disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span className="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
                ) : (
                  <>✂️ Shorten</>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-7">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 text-center shadow-[0_1px_3px_rgba(109,40,217,0.06)] transition-all hover:shadow-[0_4px_16px_rgba(109,40,217,0.1)] hover:-translate-y-0.5">
            <div className="text-3xl font-extrabold bg-gradient-to-br from-purple-700 to-cyan-600 bg-clip-text text-transparent leading-none tracking-tight">
              {urls.length}
            </div>
            <div className="text-[11px] font-semibold text-slate-400 mt-2 uppercase tracking-wide">
              Total Links
            </div>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-5 text-center shadow-[0_1px_3px_rgba(109,40,217,0.06)] transition-all hover:shadow-[0_4px_16px_rgba(109,40,217,0.1)] hover:-translate-y-0.5">
            <div className="text-3xl font-extrabold bg-gradient-to-br from-purple-700 to-cyan-600 bg-clip-text text-transparent leading-none tracking-tight">
              {totalClicks}
            </div>
            <div className="text-[11px] font-semibold text-slate-400 mt-2 uppercase tracking-wide">
              Total Clicks
            </div>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-5 text-center shadow-[0_1px_3px_rgba(109,40,217,0.06)] transition-all hover:shadow-[0_4px_16px_rgba(109,40,217,0.1)] hover:-translate-y-0.5 col-span-2 md:col-span-1">
            <div className="text-3xl font-extrabold bg-gradient-to-br from-purple-700 to-cyan-600 bg-clip-text text-transparent leading-none tracking-tight">
              {urls.length > 0 ? Math.round(totalClicks / urls.length) : 0}
            </div>
            <div className="text-[11px] font-semibold text-slate-400 mt-2 uppercase tracking-wide">
              Avg Clicks
            </div>
          </div>
        </div>

        {/* URL List */}
        <p className="text-[13px] font-semibold text-slate-400 tracking-wider uppercase mb-3 text-left">
          📋 My Links
        </p>

        {fetching ? (
          <div className="bg-white border-[1.5px] border-dashed border-slate-200 rounded-[20px] p-16 text-center text-slate-400">
            <span className="inline-block w-8 h-8 border-[3px] border-slate-200 border-t-purple-500 rounded-full animate-spin"></span>
          </div>
        ) : urls.length === 0 ? (
          <div className="bg-white border-[1.5px] border-dashed border-slate-200 rounded-[20px] p-16 text-center text-slate-400">
            <div className="text-5xl mb-3 opacity-40">🔗</div>
            <p className="text-[15px] font-medium text-slate-500">
              No links yet. Shorten your first URL above!
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {urls.map((u) => (
              <div
                key={u._id}
                className="bg-white border border-slate-200 rounded-2xl p-4 sm:px-5 sm:py-4 flex flex-col sm:flex-row sm:items-center gap-4 shadow-[0_1px_3px_rgba(109,40,217,0.06)] transition-all hover:border-purple-300 hover:shadow-[0_4px_16px_rgba(109,40,217,0.1)] hover:-translate-y-px animate-[fadeIn_0.3s_ease]"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-purple-50/50 to-purple-100/50 border-[1.5px] border-purple-200 rounded-[11px] flex items-center justify-center text-lg shrink-0 hidden sm:flex">
                  🌐
                </div>

                <div className="flex-1 min-w-0">
                  <div
                    className="text-[13px] text-slate-500 whitespace-nowrap overflow-hidden text-ellipsis mb-1"
                    title={u.originalUrl}
                  >
                    {u.originalUrl}
                  </div>
                  <a
                    href={`${BASE}/${u.shortCode}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[15px] font-semibold text-purple-600 hover:text-purple-700 hover:underline transition-colors block"
                  >
                    {BASE.replace(/https?:\/\//, "")}/{u.shortCode}
                  </a>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                  <span className="flex items-center gap-1.5 text-[13px] text-slate-500 whitespace-nowrap">
                    👁 <span className="font-bold text-cyan-600">{u.clicks || 0}</span> clicks
                  </span>
                  <button
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg border-2 transition-all whitespace-nowrap ${
                      copiedId === u._id
                        ? "bg-green-50 text-green-700 border-green-200"
                        : "bg-purple-50 text-purple-600 border-purple-200 hover:bg-purple-100 hover:border-purple-300 hover:text-purple-700"
                    }`}
                    onClick={() => handleCopy(u.shortCode, u._id)}
                  >
                    {copiedId === u._id ? "✓ Copied!" : "Copy"}
                  </button>
                  <button
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg border-2 border-red-200 bg-red-50 text-red-600 hover:bg-red-100 hover:border-red-300 hover:text-red-700 transition-all"
                    onClick={() => handleDelete(u._id)}
                    title="Delete URL"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}