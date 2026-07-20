import React from "react";
import { Calendar, Clock, ChevronRight, Activity, User } from "lucide-react";

export default function HomeTab({
  user,
  appointments,
  setActiveTab
}) {
  const getClinicStatus = () => {
    const now = new Date();
    const day = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    
    if (day === 1) {
      return {
        isOpen: false,
        statusText: "Closed Today",
        pillText: "Closed",
        colorClass: "bg-rose-500",
        pingColorClass: "bg-rose-400",
        pillColorClass: "bg-rose-50 text-rose-700 border-rose-100/50",
        subText: "Opens Tuesday 11:00 AM"
      };
    }
    
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const currentMinutes = hours * 60 + minutes;
    
    const openMinutes = 11 * 60; // 11:00 AM
    const closeMinutes = 16 * 60; // 4:00 PM
    
    if (currentMinutes >= openMinutes && currentMinutes < closeMinutes) {
      return {
        isOpen: true,
        statusText: "Open Now",
        pillText: "Available",
        colorClass: "bg-emerald-500",
        pingColorClass: "bg-emerald-400",
        pillColorClass: "bg-emerald-50 text-emerald-700 border-emerald-100/50",
        subText: "Closes at 4:00 PM"
      };
    } else {
      let subText = "Opens tomorrow 11:00 AM";
      if (currentMinutes < openMinutes) {
        subText = "Opens today 11:00 AM";
      } else if (day === 0) {
        // Sunday night. Monday is closed, so next open is Tuesday!
        subText = "Opens Tuesday 11:00 AM";
      }
      
      return {
        isOpen: false,
        statusText: "Closed Now",
        pillText: "Closed",
        colorClass: "bg-slate-400",
        pingColorClass: "bg-slate-350",
        pillColorClass: "bg-slate-50 text-slate-500 border-slate-200/50",
        subText: subText
      };
    }
  };

  const status = getClinicStatus();

  const services = [
    {
      title: "Refraction",
      category: "Precision Testing",
      desc: "Accurate measurement for clear and comfortable vision.",
      img: "/refraction.png",
      accent: "teal"
    },
    {
      title: "Comprehensive Eye Exam",
      category: "Clinical Diagnostics",
      desc: "Complete evaluation of your eye health.",
      img: "/eye_exam.png",
      accent: "magenta"
    },
    {
      title: "Spectacle Dispensing",
      category: "Frames & Optics",
      desc: "Wide range of frames and lenses to suit your style and vision.",
      img: "/spectacles.png",
      accent: "teal"
    },
    {
      title: "Contact Lens Consultation",
      category: "Specialized Fitting",
      desc: "Personalized advice for the best fit and comfort.",
      img: "/contact_lens.png",
      accent: "magenta"
    },
    {
      title: "Binocular Vision Evaluation",
      category: "Orthoptics & Coordination",
      desc: "Assessment for better eye coordination and visual performance.",
      icon: "activity",
      accent: "teal"
    },
    {
      title: "Counselling on Visual Status",
      category: "Patient Consultation",
      desc: "Understand your eye health and make informed choices.",
      icon: "user",
      accent: "magenta"
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">

      {/* 1. Services Section */}
      <div className="space-y-4">
        <div>
          <h3 className="text-xl font-extrabold tracking-tight">
            <span className="text-primary">Services </span>
            <span className="text-secondary">We Offer</span>
          </h3>
          <p className="text-[10px] text-slate-400 mt-0.5">Professional care & visual excellence</p>
        </div>

        {/* MOBILE View: Swipeable Horizontal Snap Container */}
        <div className="md:hidden flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 -mx-4 px-4 scrollbar-none">
          {services.map((service, idx) => (
            <div
              key={idx}
              className="w-[280px] shrink-0 snap-center bg-white/70 backdrop-blur-xl border border-white/45 rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.03)] flex flex-col h-[280px] hover:bg-white/80 transition-all duration-300"
            >
              {service.img ? (
                <img src={service.img} alt={service.title} className="w-full h-32 object-cover shrink-0" />
              ) : (
                <div className={`w-full h-32 shrink-0 flex items-center justify-center bg-gradient-to-br ${
                  service.accent === "teal" 
                    ? "from-primary-light/50 to-primary/5 text-primary" 
                    : "from-secondary-light/50 to-secondary/5 text-secondary"
                }`}>
                  {service.icon === "activity" ? <Activity size={36} /> : <User size={36} />}
                </div>
              )}

              <div className="p-4 flex flex-col justify-between flex-grow">
                <div className="space-y-1.5">
                  <span className={`text-[8px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-full ${
                    service.accent === "teal" 
                      ? "bg-primary-light/60 text-primary border border-primary/10" 
                      : "bg-secondary-light/60 text-secondary border border-secondary/10"
                  }`}>
                    {service.category}
                  </span>
                  <h4 className="font-extrabold text-xs text-slate-800 pt-0.5">
                    {service.title}
                  </h4>
                  <p className="text-[10px] text-slate-500 leading-normal line-clamp-2">
                    {service.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* DESKTOP View: Responsive Grid */}
        <div className="hidden md:grid grid-cols-3 gap-6">
          {services.map((service, idx) => (
            <div
              key={idx}
              className="bg-white/70 backdrop-blur-xl border border-white/45 rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col h-[280px] transition-all duration-350 hover:-translate-y-1.5 hover:shadow-[0_12px_40px_rgb(0,0,0,0.06)] hover:border-primary/35 group cursor-pointer hover:bg-white/80"
            >
              {service.img ? (
                <div className="w-full h-32 overflow-hidden shrink-0 relative">
                  <img src={service.img} alt={service.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
                </div>
              ) : (
                <div className={`w-full h-32 shrink-0 flex items-center justify-center transition-all duration-300 bg-gradient-to-br ${
                  service.accent === "teal" 
                    ? "from-primary-light/50 to-primary/5 text-primary group-hover:from-primary/10" 
                    : "from-secondary-light/50 to-secondary/5 text-secondary group-hover:from-secondary/10"
                }`}>
                  {service.icon === "activity" ? <Activity size={36} className="transition-transform group-hover:scale-110" /> : <User size={36} className="transition-transform group-hover:scale-110" />}
                </div>
              )}

              <div className="p-4 flex flex-col justify-between flex-grow">
                <div className="space-y-1.5">
                  <span className={`text-[8px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-full border ${
                    service.accent === "teal" 
                      ? "bg-primary-light/60 text-primary border-primary/10" 
                      : "bg-secondary-light/60 text-secondary border border-secondary/10"
                  }`}>
                    {service.category}
                  </span>
                  <h4 className="font-extrabold text-xs text-slate-800 pt-0.5 group-hover:text-primary transition-colors duration-200">
                    {service.title}
                  </h4>
                  <p className="text-[10px] text-slate-500 leading-normal line-clamp-2">
                    {service.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Welcome Message Card & Clinic Status Widget */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 bg-gradient-to-br from-primary-light/50 via-white/40 to-slate-100/20 backdrop-blur-xl border border-white/45 rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.03)] flex flex-col justify-center">
          <h2 className="text-xl md:text-2xl font-extrabold text-primary">
            Hello, {user?.displayName ? user.displayName.split(" ")[0] : "Patient"}!
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Welcome to Healthy Eye Clinic.
          </p>
        </div>
        
        <div className="bg-white/70 backdrop-blur-xl border border-white/45 rounded-3xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.03)] flex items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400">Clinic Status</span>
            <div className="flex items-center gap-2 mt-0.5">
              <div className="relative flex h-2.5 w-2.5">
                {status.isOpen && (
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${status.pingColorClass} opacity-75`}></span>
                )}
                <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${status.colorClass}`}></span>
              </div>
              <h4 className="text-xs font-extrabold text-slate-800">{status.statusText}</h4>
            </div>
            <p className="text-[9px] text-slate-450">{status.subText}</p>
          </div>
          <div className={`px-2.5 py-1 text-[9px] font-bold rounded-lg border uppercase tracking-wide ${status.pillColorClass}`}>
            {status.pillText}
          </div>
        </div>
      </div>

      {/* 3. Grid Layout: Recent Bookings & Quick Actions Side-by-Side on Desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">

        {/* Recent Appointments Overview Widget */}
        <div className="space-y-3">
          <div className="flex justify-between items-center px-1">
            <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Recent Appointments</h4>
            {appointments.length > 0 && (
              <button
                onClick={() => setActiveTab("records")}
                className="text-[10px] font-extrabold text-primary hover:text-primary-dark cursor-pointer transition-colors"
              >
                View All
              </button>
            )}
          </div>

          {appointments.length === 0 ? (
            <div className="bg-white border border-slate-200/50 rounded-2xl p-6 text-center text-xs text-slate-450 shadow-sm">
              No appointments scheduled.
            </div>
          ) : (
            <div className="space-y-2.5">
              {appointments.slice(0, 2).map((appt, idx) => {
                const isCompleted = (() => {
                  if (appt.status !== "Approved") return false;
                  try {
                    const [timeStr, modifier] = appt.time.split(" ");
                    let [hours, minutes] = timeStr.split(":");
                    hours = parseInt(hours, 10);
                    if (modifier === "PM" && hours < 12) hours += 12;
                    if (modifier === "AM" && hours === 12) hours = 0;
                    const endDt = new Date(`${appt.date}T${hours.toString().padStart(2, "0")}:${minutes}:00`).getTime() + 60 * 60 * 1000;
                    return Date.now() > endDt;
                  } catch (e) {
                    return false;
                  }
                })();

                return (
                  <div key={idx} className="bg-white/70 backdrop-blur-xl border border-white/45 rounded-2xl p-4 flex items-center justify-between shadow-[0_8px_30px_rgb(0,0,0,0.03)] hover:shadow-[0_12px_35px_rgb(0,0,0,0.05)] hover:bg-white/80 transition-all duration-250 hover:scale-[1.01]">
                    <div>
                      <p className="text-xs font-bold text-slate-800">{appt.patientName}</p>
                      <p className="text-[9px] text-slate-455 mt-0.5">{appt.date} • {appt.time}</p>
                      {appt.status === "Approved" && appt.mrno && (
                        <span className="text-[8px] font-extrabold text-primary bg-primary-light/60 border border-primary/20 px-1.5 py-0.5 rounded-md mt-1 inline-block">
                          MRN: {appt.mrno}
                        </span>
                      )}
                    </div>
                    <span className={`text-[8px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      isCompleted
                        ? "bg-blue-50/60 text-blue-700 border border-blue-100/80"
                        : appt.status === "Approved"
                        ? "bg-primary-light/60 text-primary border border-primary/20"
                        : appt.status === "Cancelled"
                        ? "bg-rose-50/60 text-rose-700 border border-rose-100/80"
                        : "bg-amber-50/60 text-amber-700 border border-amber-100/80"
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
          <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider px-1">Quick Actions</h4>

          <button
            onClick={() => setActiveTab("request")}
            className="w-full bg-white/70 backdrop-blur-xl border border-white/45 hover:border-primary/30 rounded-2xl p-4 flex items-center justify-between shadow-[0_8px_30px_rgb(0,0,0,0.03)] hover:shadow-[0_12px_35px_rgb(0,0,0,0.05)] transition-all group text-left cursor-pointer duration-250 hover:scale-[1.01] hover:bg-white/80"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-primary-light/60 text-primary rounded-xl flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors duration-200">
                <Calendar size={18} />
              </div>
              <div>
                <h5 className="font-extrabold text-slate-800 text-xs">Schedule Consultation</h5>
                <p className="text-[10px] text-slate-400">Request a new clinic appointment.</p>
              </div>
            </div>
            <ChevronRight size={16} className="text-slate-400 group-hover:text-primary transition-colors duration-200" />
          </button>

          <button
            onClick={() => setActiveTab("records")}
            className="w-full bg-white/70 backdrop-blur-xl border border-white/45 hover:border-primary/30 rounded-2xl p-4 flex items-center justify-between shadow-[0_8px_30px_rgb(0,0,0,0.03)] hover:shadow-[0_12px_35px_rgb(0,0,0,0.05)] transition-all group text-left cursor-pointer duration-250 hover:scale-[1.01] hover:bg-white/80"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-primary-light/60 text-primary rounded-xl flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors duration-200">
                <Clock size={18} />
              </div>
              <div>
                <h5 className="font-extrabold text-slate-800 text-xs">View Medical Logs</h5>
                <p className="text-[10px] text-slate-400">Check appointment schedules & logs.</p>
              </div>
            </div>
            <ChevronRight size={16} className="text-slate-400 group-hover:text-primary transition-colors duration-200" />
          </button>
        </div>

      </div>
    </div>
  );
}
