import React from "react";
import { User, Mail, FileText, CheckCircle2, LogOut } from "lucide-react";

export default function ProfileTab({ user, appointments, handleSignOut }) {
  const initials = user?.displayName
    ? user.displayName.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase()
    : "P";

  const totalAppts = appointments.length;
  const confirmedAppts = appointments.filter(a => a.status === "Approved").length;
  const pendingAppts = appointments.filter(a => a.status === "Pending").length;

  return (
    <div className="space-y-4 max-w-md mx-auto animate-in fade-in duration-200">

      {/* Profile Hero Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-teal-600 via-teal-500 to-emerald-500 p-6 shadow-xl shadow-teal-600/20 text-center">
        <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-6 -left-6 w-32 h-32 rounded-full bg-emerald-400/15 blur-2xl" />

        {/* Avatar */}
        <div className="relative inline-flex mb-4">
          {user?.photoURL ? (
            <img src={user.photoURL} alt="Profile"
              className="w-20 h-20 rounded-full border-4 border-white/30 shadow-xl" referrerPolicy="no-referrer" />
          ) : (
            <div className="w-20 h-20 rounded-full bg-white/20 border-4 border-white/30 flex items-center justify-center shadow-xl">
              <span className="text-white text-2xl font-black">{initials}</span>
            </div>
          )}
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-400 rounded-full border-2 border-white flex items-center justify-center shadow-sm">
            <CheckCircle2 size={12} className="text-white" />
          </div>
        </div>

        <div className="relative">
          <h2 className="text-white text-xl font-black leading-tight">{user?.displayName || "Patient"}</h2>
          <p className="text-teal-100/80 text-xs mt-0.5">{user?.email}</p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-3">
        <div className="glass rounded-2xl p-4 text-center glass-shadow">
          <p className="text-2xl font-black text-white">{totalAppts}</p>
          <p className="text-[9px] font-extrabold text-white/50 uppercase tracking-wider mt-0.5">Total</p>
        </div>
        <div className="glass rounded-2xl p-4 text-center glass-shadow">
          <p className="text-2xl font-black text-teal-400">{confirmedAppts}</p>
          <p className="text-[9px] font-extrabold text-teal-600 uppercase tracking-wider mt-0.5">Confirmed</p>
        </div>
        <div className="glass rounded-2xl p-4 text-center glass-shadow">
          <p className="text-2xl font-black text-amber-400">{pendingAppts}</p>
          <p className="text-[9px] font-extrabold text-amber-600 uppercase tracking-wider mt-0.5">Pending</p>
        </div>
      </div>

      {/* Account Info Card */}
      <div className="glass rounded-3xl p-5 glass-shadow space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-6 h-6 rounded-lg bg-teal-500/20 flex items-center justify-center border border-teal-500/25">
            <User size={13} className="text-teal-400" />
          </div>
          <h4 className="text-xs font-extrabold text-white/80 uppercase tracking-wider">Account Details</h4>
        </div>

        {/* Name row */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-white/8 flex items-center justify-center shrink-0 border border-white/10">
            <User size={15} className="text-white/50" />
          </div>
          <div className="flex-1">
            <p className="text-[9px] font-extrabold text-white/50 uppercase tracking-widest">Full Name</p>
            <p className="text-sm font-bold text-white mt-0.5">{user?.displayName || "—"}</p>
          </div>
        </div>

        <div className="h-px bg-white/8" />

        {/* Email row */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-blue-500/15 flex items-center justify-center shrink-0 border border-blue-500/20">
            <Mail size={15} className="text-blue-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[9px] font-extrabold text-white/50 uppercase tracking-widest">Email</p>
            <p className="text-sm font-bold text-white mt-0.5 truncate">{user?.email || "—"}</p>
          </div>
        </div>

        <div className="h-px bg-white/8" />

        {/* Records row */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-purple-500/15 flex items-center justify-center shrink-0 border border-purple-500/20">
            <FileText size={15} className="text-purple-400" />
          </div>
          <div className="flex-1">
            <p className="text-[9px] font-extrabold text-white/50 uppercase tracking-widest">Consultations Filed</p>
            <p className="text-sm font-bold text-white mt-0.5">{totalAppts} {totalAppts === 1 ? "Record" : "Records"}</p>
          </div>
        </div>
      </div>

      {/* Sign Out */}
      {handleSignOut && (
        <button onClick={handleSignOut}
          className="w-full flex items-center justify-center gap-2 py-3.5 glass border-2 border-rose-500/30 text-rose-400 text-sm font-extrabold rounded-2xl hover:bg-rose-500/15 hover:border-rose-500/50 transition-all duration-200 active:scale-[0.99] cursor-pointer">
          <LogOut size={15} />
          Sign Out
        </button>
      )}

    </div>
  );
}
