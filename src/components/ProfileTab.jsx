import React from "react";
import { User } from "lucide-react";

export default function ProfileTab({ user, appointments }) {
  return (
    <div className="space-y-6 animate-in fade-in duration-200 max-w-md mx-auto">
      <h3 className="text-lg font-black text-slate-800 flex items-center gap-2 px-1">
        <User size={18} className="text-primary" />
        Patient Profile
      </h3>

      <div className="bg-white/70 backdrop-blur-xl border border-white/45 rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col items-center text-center space-y-4">
        {user?.photoURL ? (
          <img src={user.photoURL} alt="Profile" className="w-20 h-20 rounded-full border-4 border-primary/20 shadow-md" referrerPolicy="no-referrer" />
        ) : (
          <div className="w-20 h-20 bg-primary-light/60 backdrop-blur-sm text-primary border border-primary/10 rounded-full flex items-center justify-center">
            <User size={40} />
          </div>
        )}

        <div>
          <h4 className="text-xl font-extrabold text-slate-800">{user?.displayName || "Patient"}</h4>
          <p className="text-xs text-slate-500">{user?.email}</p>
        </div>

        <div className="w-full pt-4 border-t border-slate-200/40 space-y-2 text-left text-xs">
          <div className="flex justify-between">
            <span className="text-slate-400 font-medium">Account Status:</span>
            <span className="text-primary font-bold bg-primary-light/60 backdrop-blur-sm px-2 py-0.5 rounded border border-primary/10 text-[10px]">Active Session</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400 font-medium">Consultations Filed:</span>
            <span className="text-slate-700 font-bold">{appointments.length} Records</span>
          </div>
        </div>
      </div>
    </div>
  );
}
