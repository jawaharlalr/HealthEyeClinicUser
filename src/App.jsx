import { useState, useEffect } from "react";
import { CheckCircle, AlertCircle, X } from "lucide-react";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const showMsg = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50/30 to-white flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin" />
            <div className="absolute inset-0 w-12 h-12 rounded-full bg-teal-400/20 blur-xl" />
          </div>
          <span className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-teal-600 mt-1 animate-pulse">Loading Portal</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-slate-700 font-sans flex flex-col items-center justify-start relative overflow-hidden">
      
      {/* Glass background mesh */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none bg-gradient-to-br from-slate-50 via-teal-50/20 to-white">
        <div className="absolute -top-[15%] -left-[15%] w-[55vw] h-[55vw] rounded-full bg-teal-400/8 blur-[140px] animate-float-orb" />
        <div className="absolute -bottom-[15%] -right-[15%] w-[55vw] h-[55vw] rounded-full bg-pink-300/6 blur-[140px] animate-float-orb" style={{ animationDelay: "5s" }} />
        <div className="absolute top-[25%] right-[15%] w-[35vw] h-[35vw] rounded-full bg-emerald-200/10 blur-[120px] animate-float-orb" style={{ animationDelay: "10s" }} />
        {/* Subtle noise/grain overlay for premium feel */}
        <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")" }} />
      </div>

      {/* Toast Messages */}
      {message && (
        <div className={`fixed top-4 left-4 right-4 z-50 flex items-center gap-3 p-4 rounded-2xl glass-strong glass-shadow-lg transition-all duration-300 border ${
          message.type === "success"
            ? "border-emerald-200/50 text-emerald-900"
            : "border-rose-200/50 text-rose-900"
        }`}>
          {message.type === "success" ? <CheckCircle size={20} className="text-emerald-600" /> : <AlertCircle size={20} className="text-rose-600" />}
          <p className="text-xs font-extrabold flex-1">{message.text}</p>
          <button onClick={() => setMessage(null)} className="text-slate-400 hover:text-slate-700 cursor-pointer transition-colors">
            <X size={18} />
          </button>
        </div>
      )}

      <Dashboard user={user} showMsg={showMsg} />
    </div>
  );
}
