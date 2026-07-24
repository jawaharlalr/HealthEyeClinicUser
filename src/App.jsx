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
      <div className="min-h-screen bg-gradient-to-tr from-slate-50 via-slate-100 to-primary-light/25 flex items-center justify-center font-sans text-primary">
        <div className="flex flex-col items-center gap-2">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs font-bold uppercase tracking-widest mt-2 animate-pulse">Loading Portal...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/20 text-slate-700 font-sans flex flex-col items-center justify-start p-4 relative overflow-hidden">
      {/* Premium Glassmorphic Background Mesh Glows */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-primary/8 blur-[120px] animate-pulse duration-[10000ms]"></div>
        <div className="absolute -bottom-[10%] -right-[10%] w-[50vw] h-[50vw] rounded-full bg-secondary/6 blur-[120px] animate-pulse duration-[15000ms] delay-3000"></div>
        <div className="absolute top-[30%] right-[20%] w-[30vw] h-[30vw] rounded-full bg-primary-light/40 blur-[100px] animate-pulse duration-[12000ms] delay-1000"></div>
      </div>
      
      {/* Toast Messages */}
      {message && (
        <div className={`fixed top-4 left-4 right-4 z-50 flex items-center gap-3 p-4 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] backdrop-blur-md transition-all duration-300 border ${
          message.type === "success"
            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-900"
            : "bg-rose-500/10 border-rose-500/30 text-rose-900"
        }`}>
          {message.type === "success" ? <CheckCircle size={20} className="text-emerald-600" /> : <AlertCircle size={20} className="text-rose-600" />}
          <p className="text-xs font-extrabold flex-1">{message.text}</p>
          <button onClick={() => setMessage(null)} className="text-slate-450 hover:text-slate-700 cursor-pointer">
            <X size={18} />
          </button>
        </div>
      )}

      <Dashboard user={user} showMsg={showMsg} />
    </div>
  );
}
