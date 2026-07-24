import { useState } from "react";
import { auth } from "../firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { Eye } from "lucide-react";

export default function Login({ showMsg }) {
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      showMsg("success", "Welcome to Healthy Eye Clinic!");
    } catch (err) {
      console.error("Google login error:", err);
      showMsg("error", err.message || "Failed to sign in with Google.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 w-screen h-screen flex items-center justify-center bg-[url('/login_bg.png')] bg-cover bg-center p-4">
      {/* Overlay with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/70 via-teal-900/40 to-slate-900/60 backdrop-blur-[3px]" />

      {/* Floating decorative orbs */}
      <div className="absolute top-[15%] left-[10%] w-60 h-60 rounded-full bg-teal-400/15 blur-3xl animate-float-orb" />
      <div className="absolute bottom-[10%] right-[10%] w-80 h-80 rounded-full bg-emerald-400/10 blur-3xl animate-float-orb" style={{ animationDelay: "5s" }} />
      <div className="absolute top-[40%] right-[25%] w-40 h-40 rounded-full bg-white/5 blur-2xl animate-float-orb" style={{ animationDelay: "10s" }} />

      {/* Glass login card */}
      <div className="glass-strong rounded-3xl p-8 glass-shadow-lg animate-in fade-in zoom-in-95 duration-500 w-full max-w-sm relative z-10 text-center">
        
        {/* Logo */}
        <div className="flex flex-col items-center mb-7">
          <div className="relative mb-5">
            <div className="absolute inset-0 rounded-2xl bg-teal-500/20 blur-xl scale-125" />
            <img 
              src="/hero.png" 
              alt="Healthy Eye Clinic Logo" 
              className="relative w-20 h-20 object-contain rounded-2xl shadow-lg border border-white/30" 
            />
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">Healthy Eye Clinic</h2>
          <p className="text-[10px] font-extrabold text-teal-600 uppercase tracking-[0.2em] mt-1.5">Patient Portal</p>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
          <span className="text-[9px] font-bold text-white/60 uppercase tracking-widest">Sign in to continue</span>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
        </div>
        
        {/* Google sign-in button */}
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full py-3.5 px-6 glass border border-slate-200/60 hover:border-teal-400/50 rounded-2xl flex items-center justify-center gap-3 text-white/70 font-bold transition-all duration-300 hover:shadow-lg hover:bg-white/80 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none group cursor-pointer"
        >
          <svg className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" viewBox="0 0 24 24" fill="currentColor">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
          </svg>
          <span className="text-sm">{loading ? "Authenticating..." : "Continue with Google"}</span>
        </button>

        {/* Footer text */}
        <p className="text-[9px] text-white/60 mt-5 leading-relaxed">
          By signing in, you agree to our clinic's terms and privacy policy.
        </p>
      </div>
    </div>
  );
}
