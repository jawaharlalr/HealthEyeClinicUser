import React, { useState, useEffect } from "react";
import { Calendar, Clock, ChevronRight, Activity, User, MapPin, Stethoscope } from "lucide-react";

export default function HomeTab({ user, appointments, setActiveTab }) {
  const getClinicStatus = () => {
    const now = new Date();
    const day = now.getDay();
    if (day === 1) return { isOpen: false, pillText: "Closed", subText: "Opens Tuesday 11:00 AM" };
    const cur = now.getHours() * 60 + now.getMinutes();
    if (cur >= 660 && cur < 960) return { isOpen: true, pillText: "Open", subText: "Closes at 4:00 PM" };
    let subText = cur < 660 ? "Opens today 11:00 AM" : day === 0 ? "Opens Tuesday 11:00 AM" : "Opens tomorrow 11:00 AM";
    return { isOpen: false, pillText: "Closed", subText };
  };

  const status = getClinicStatus();
  const [liveTime, setLiveTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setLiveTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const fmt = (d) => {
    let h = d.getHours(); const m = d.getMinutes().toString().padStart(2, "0");
    const ap = h >= 12 ? "PM" : "AM"; h = h % 12 || 12;
    return { h: h.toString().padStart(2, "0"), m, ampm: ap };
  };
  const { h, m, ampm } = fmt(liveTime);
  const today = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][liveTime.getDay()];

  const services = [
    { title: "Refraction", category: "Precision Testing", desc: "Accurate measurement for clear and comfortable vision.", img: "/refraction.png", accent: "teal" },
    { title: "Comprehensive Eye Exam", category: "Clinical Diagnostics", desc: "Complete evaluation of your eye health.", img: "/eye_exam.png", accent: "magenta" },
    { title: "Spectacle Dispensing", category: "Frames & Optics", desc: "Wide range of frames and lenses to suit your style and vision.", img: "/spectacles.png", accent: "teal" },
    { title: "Contact Lens Consultation", category: "Specialized Fitting", desc: "Personalized advice for the best fit and comfort.", img: "/contact_lens.png", accent: "magenta" },
    { title: "Binocular Vision Evaluation", category: "Orthoptics & Coordination", desc: "Assessment for better eye coordination and visual performance.", icon: "activity", accent: "teal" },
    { title: "Counselling on Visual Status", category: "Patient Consultation", desc: "Understand your eye health and make informed choices.", icon: "user", accent: "magenta" }
  ];

  const ServiceCard = ({ service, className }) => (
    <div className={className}>
      {service.img ? (
        <div className="w-full h-32 overflow-hidden shrink-0 relative">
          <img src={service.img} alt={service.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        </div>
      ) : (
        <div className={`w-full h-32 shrink-0 flex items-center justify-center ${
          service.accent === "teal" ? "bg-teal-500/15 text-teal-300" : "bg-pink-500/15 text-pink-300"
        }`}>
          {service.icon === "activity" ? <Activity size={36} className="transition-transform group-hover:scale-110" /> : <User size={36} className="transition-transform group-hover:scale-110" />}
        </div>
      )}
      <div className="p-4 flex flex-col flex-grow">
        <span className={`text-[8px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-full border w-fit ${
          service.accent === "teal" ? "bg-teal-500/15 text-teal-300 border-teal-500/30" : "bg-pink-500/15 text-pink-300 border-pink-500/30"
        }`}>
          {service.category}
        </span>
        <h4 className="font-extrabold text-xs text-white pt-1.5 group-hover:text-teal-300 transition-colors duration-200">{service.title}</h4>
        <p className="text-[10px] text-white/60 leading-normal mt-1 line-clamp-2">{service.desc}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">

      {/* 1. Services */}
      <div className="space-y-4">
        <div>
          <h3 className="text-xl font-extrabold tracking-tight">
            <span className="text-teal-400">Services </span>
            <span className="text-pink-400">We Offer</span>
          </h3>
          <p className="text-[10px] text-white/50 mt-0.5">Professional care & visual excellence</p>
        </div>

        {/* Mobile swipeable */}
        <div className="md:hidden flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 -mx-4 px-4 scrollbar-none">
          {services.map((s, i) => (
            <ServiceCard key={i} service={s} className="w-[280px] shrink-0 snap-center glass rounded-3xl overflow-hidden glass-shadow flex flex-col h-[280px] group" />
          ))}
        </div>

        {/* Desktop grid */}
        <div className="hidden md:grid grid-cols-3 gap-5">
          {services.map((s, i) => (
            <ServiceCard key={i} service={s} className="glass rounded-3xl overflow-hidden glass-shadow glass-hover flex flex-col h-[280px] group cursor-pointer" />
          ))}
        </div>
      </div>

      {/* 2. Welcome + Clinic Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 glass rounded-3xl p-6 glass-shadow flex flex-col justify-center">
          <h2 className="text-xl md:text-2xl font-extrabold text-white">
            Hello, {user?.displayName ? user.displayName.split(" ")[0] : "Patient"}! 👋
          </h2>
          <p className="text-sm text-white/60 mt-1">Welcome to Healthy Eye Clinic.</p>
        </div>

        <div className={`relative overflow-hidden rounded-3xl p-5 shadow-lg border ${
          status.isOpen
            ? "bg-gradient-to-br from-emerald-600 via-teal-600 to-teal-700 border-emerald-500/30"
            : "bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 border-slate-600/30"
        }`}>
          <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full blur-2xl opacity-30 bg-white" />
          <div className="absolute -bottom-4 -left-4 w-20 h-20 rounded-full blur-xl opacity-20 bg-white" />
          <div className="relative flex items-center justify-between mb-3">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-white/80">Clinic Status</span>
          </div>
          <div className="relative flex items-end gap-1.5 mb-2.5">
            <span className="text-4xl font-black text-white tabular-nums leading-none tracking-tight">{h}:{m}</span>
            <span className="text-sm font-bold text-white/90 mb-0.5">{ampm}</span>
          </div>
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-white">{today}</p>
              <p className="text-[10px] text-white/70 mt-0.5">{status.subText}</p>
            </div>
            <div className={`px-3 py-1.5 rounded-xl text-[10px] font-extrabold uppercase tracking-widest border backdrop-blur-sm ${
              status.isOpen ? "bg-white/25 text-white border-white/40" : "bg-white/15 text-white border-white/25"
            }`}>
              {status.pillText}
            </div>
          </div>
          <div className="relative mt-3 pt-3 border-t border-white/15 flex items-center gap-1.5">
            <Clock size={10} className="text-white/60" />
            <span className="text-[10px] text-white/65 font-medium">Tue–Sun • 11:00 AM – 4:00 PM</span>
          </div>
        </div>
      </div>

      {/* 3. Recent + Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">

        {/* Recent Appointments */}
        <div className="space-y-3">
          <div className="flex justify-between items-center px-1">
            <h4 className="text-[10px] font-extrabold text-white/50 uppercase tracking-wider">Recent Appointments</h4>
            {appointments.length > 0 && (
              <button onClick={() => setActiveTab("records")} className="text-[10px] font-extrabold text-teal-400 hover:text-teal-300 cursor-pointer transition-colors">
                View All
              </button>
            )}
          </div>
          {appointments.length === 0 ? (
            <div className="glass rounded-2xl p-6 text-center text-xs text-white/50 glass-shadow">No appointments scheduled.</div>
          ) : (
            <div className="space-y-2.5">
              {appointments.slice(0, 2).map((appt, idx) => {
                const isCompleted = (() => {
                  if (appt.status !== "Approved") return false;
                  try {
                    const [ts, mod] = appt.time.split(" ");
                    let [hr, mn] = ts.split(":"); hr = parseInt(hr, 10);
                    if (mod === "PM" && hr < 12) hr += 12;
                    if (mod === "AM" && hr === 12) hr = 0;
                    return Date.now() > new Date(`${appt.date}T${hr.toString().padStart(2, "0")}:${mn}:00`).getTime() + 3600000;
                  } catch { return false; }
                })();
                return (
                  <div key={idx} className="glass rounded-2xl p-4 flex items-center justify-between glass-shadow glass-hover">
                    <div>
                      <p className="text-xs font-bold text-white">{appt.patientName}</p>
                      <p className="text-[9px] text-white/50 mt-0.5">{appt.date} • {appt.time}</p>
                      {appt.status === "Approved" && appt.mrno && (
                        <span className="text-[8px] font-extrabold text-teal-400 bg-teal-500/15 border border-teal-500/30 px-1.5 py-0.5 rounded-md mt-1 inline-block">
                          MRN: {appt.mrno}
                        </span>
                      )}
                    </div>
                    <span className={`text-[8px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                      isCompleted ? "bg-blue-500/15 text-blue-300 border-blue-500/30"
                        : appt.status === "Approved" ? "bg-teal-500/15 text-teal-300 border-teal-500/30"
                        : appt.status === "Cancelled" ? "bg-rose-500/15 text-rose-300 border-rose-500/30"
                        : "bg-amber-500/15 text-amber-300 border-amber-500/30"
                    }`}>
                      {isCompleted ? "Completed" : appt.status === "Approved" ? "Confirmed" : appt.status === "Pending" ? "Awaiting Review" : appt.status}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="space-y-3">
          <h4 className="text-[10px] font-extrabold text-white/50 uppercase tracking-wider px-1">Quick Actions</h4>
          {[
            { tab: "request", icon: <Calendar size={18} />, title: "Schedule Consultation", desc: "Request a new clinic appointment." },
            { tab: "records", icon: <Clock size={18} />, title: "View Medical Logs", desc: "Check appointment schedules & logs." }
          ].map(a => (
            <button key={a.tab} onClick={() => setActiveTab(a.tab)}
              className="w-full glass glass-shadow rounded-2xl p-4 flex items-center justify-between glass-hover group text-left cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-teal-500/15 text-teal-400 rounded-xl flex items-center justify-center group-hover:bg-teal-500 group-hover:text-white transition-colors duration-200 border border-teal-500/25">
                  {a.icon}
                </div>
                <div>
                  <h5 className="font-extrabold text-white text-xs">{a.title}</h5>
                  <p className="text-[10px] text-white/50">{a.desc}</p>
                </div>
              </div>
              <ChevronRight size={16} className="text-white/40 group-hover:text-teal-400 transition-colors duration-200" />
            </button>
          ))}
        </div>

      </div>
    </div>
  );
}
