import React from "react";
import { Clock, Calendar, Check, FileText } from "lucide-react";

const getGoogleCalendarUrl = (appt) => {
  try {
    const [timeStr, modifier] = appt.time.split(" ");
    let [hours, minutes] = timeStr.split(":");
    hours = parseInt(hours, 10);
    if (modifier === "PM" && hours < 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;
    const startDt = new Date(`${appt.date}T${hours.toString().padStart(2, "0")}:${minutes}:00`);
    const endDt = new Date(startDt.getTime() + 3600000);
    const fmt = (d) => d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    const text = `Eye Consultation - ${appt.doctorName}`;
    const details = `Eye Checkup Consultation at Healthy Eye Clinic\nPatient: ${appt.patientName}\nMRN: ${appt.mrno || "N/A"}\nStatus: Confirmed`;
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(text)}&dates=${fmt(startDt)}/${fmt(endDt)}&details=${encodeURIComponent(details)}&location=${encodeURIComponent("Healthy Eye Clinic")}`;
  } catch { return "#"; }
};

const downloadIcsFile = (appt) => {
  try {
    const [timeStr, modifier] = appt.time.split(" ");
    let [hours, minutes] = timeStr.split(":");
    hours = parseInt(hours, 10);
    if (modifier === "PM" && hours < 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;
    const startDt = new Date(`${appt.date}T${hours.toString().padStart(2, "0")}:${minutes}:00`);
    const endDt = new Date(startDt.getTime() + 3600000);
    const fmt = (d) => d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    const ics = [
      "BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//Healthy Eye Clinic//Appointment//EN",
      "BEGIN:VEVENT",`UID:appt-${appt.id || Math.random().toString(36).substr(2,9)}`,
      `DTSTAMP:${fmt(new Date())}`,`DTSTART:${fmt(startDt)}`,`DTEND:${fmt(endDt)}`,
      `SUMMARY:Eye Consultation - ${appt.doctorName}`,
      `DESCRIPTION:Eye Checkup\\nPatient: ${appt.patientName}\\nMRN: ${appt.mrno || "N/A"}`,
      "LOCATION:Healthy Eye Clinic","BEGIN:VALARM","TRIGGER:-PT15M","ACTION:DISPLAY",
      "DESCRIPTION:Reminder: Eye Consultation in 15 minutes","END:VALARM","END:VEVENT","END:VCALENDAR"
    ].join("\r\n");
    const url = URL.createObjectURL(new Blob([ics], { type: "text/calendar;charset=utf-8" }));
    const a = document.createElement("a"); a.href = url; a.download = `appointment-${appt.date}.ics`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
  } catch (e) { console.error(e); }
};

export default function RecordsTab({ appointments, handleCancelAppointment }) {
  return (
    <div className="space-y-4 animate-in fade-in duration-300 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-xl bg-teal-500/15 flex items-center justify-center border border-teal-500/25">
          <FileText size={16} className="text-teal-400" />
        </div>
        <div>
          <h3 className="text-base font-extrabold text-white">Consultation Records</h3>
          <p className="text-[10px] text-white/50">{appointments.length} {appointments.length === 1 ? "record" : "records"} on file</p>
        </div>
      </div>

      {appointments.length === 0 ? (
        <div className="glass rounded-3xl p-10 text-center glass-shadow">
          <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-3">
            <FileText size={24} className="text-white/40" />
          </div>
          <p className="text-sm font-bold text-white/60">No consultations on record</p>
          <p className="text-xs text-white/40 mt-1">Your appointments will appear here once booked.</p>
        </div>
      ) : (
        <div className="relative border-l-2 border-white/10 ml-3.5 pl-6 space-y-4">
          {appointments.map((appt, idx) => {
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

            const statusCls = isCompleted
              ? "bg-blue-500/15 text-blue-300 border-blue-500/30"
              : appt.status === "Approved" ? "bg-teal-500/15 text-teal-300 border-teal-500/30"
              : appt.status === "Cancelled" ? "bg-rose-500/15 text-rose-300 border-rose-500/30"
              : "bg-amber-500/15 text-amber-300 border-amber-500/30";

            const nodeCls = isCompleted ? "bg-emerald-500 border-emerald-500"
              : appt.status === "Approved" ? "bg-teal-500 border-teal-500"
              : appt.status === "Cancelled" ? "bg-rose-500 border-rose-500"
              : "bg-amber-400 border-amber-400";

            return (
              <div key={idx} className="relative glass rounded-2xl p-5 space-y-4 glass-shadow glass-hover">
                <span className={`absolute -left-[31px] top-5 w-4 h-4 rounded-full border-2 flex items-center justify-center shadow-sm ${nodeCls}`}>
                  {isCompleted && <Check size={10} strokeWidth={4} className="text-white" />}
                </span>

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[9px] bg-white/8 text-white/60 font-extrabold px-1.5 py-0.5 rounded-lg border border-white/10">S.No: {idx + 1}</span>
                      {appt.appointmentNo && (
                        <span className="text-[9px] bg-teal-500/15 text-teal-400 font-extrabold px-1.5 py-0.5 rounded-lg border border-teal-500/30">Appt No: {appt.appointmentNo}</span>
                      )}
                    </div>
                    <h4 className="font-extrabold text-white text-sm">{appt.patientName}</h4>
                    <p className="text-[10px] text-white/50">{appt.doctorName}</p>
                  </div>
                  <span className={`self-start sm:self-center text-[9px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full border ${statusCls}`}>
                    {isCompleted ? "Completed" : appt.status === "Approved" ? "Confirmed" : appt.status === "Pending" ? "Awaiting Review" : appt.status}
                  </span>
                </div>

                {/* Date & Time */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="flex items-center gap-2.5 bg-white/5 p-3 rounded-xl border border-white/8">
                    <Calendar size={14} className="text-teal-400 shrink-0" />
                    <span className="font-bold text-white/80">{appt.date}</span>
                  </div>
                  <div className="flex items-center gap-2.5 bg-white/5 p-3 rounded-xl border border-white/8">
                    <Clock size={14} className="text-teal-400 shrink-0" />
                    <span className="font-bold text-white/80">{appt.time}</span>
                  </div>
                </div>

                {/* Patient Details */}
                <div className="space-y-2">
                  <span className="text-[9px] font-extrabold text-white/50 uppercase tracking-wider block">Patient Details</span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 bg-white/5 p-3.5 rounded-xl border border-white/8 text-xs">
                    <div>
                      <span className="text-white/40 block text-[8px] uppercase font-bold tracking-wider">Phone</span>
                      <span className="text-white/80 font-extrabold">{appt.phone || "N/A"}</span>
                    </div>
                    <div>
                      <span className="text-white/40 block text-[8px] uppercase font-bold tracking-wider">DOB</span>
                      <span className="text-white/80 font-semibold">{appt.dob || "N/A"}</span>
                    </div>
                    <div>
                      <span className="text-white/40 block text-[8px] uppercase font-bold tracking-wider">Age / Gender</span>
                      <span className="text-white/80 font-semibold">{appt.age !== undefined ? `${appt.age} yrs` : "N/A"} • {appt.gender || "N/A"}</span>
                    </div>
                    <div className="col-span-2 sm:col-span-3">
                      <span className="text-white/40 block text-[8px] uppercase font-bold tracking-wider">Address</span>
                      <span className="text-white/80 font-medium">{appt.address || "N/A"}</span>
                    </div>
                  </div>
                </div>

                {appt.notes && (
                  <div className="bg-white/5 p-3 rounded-xl border border-white/8 text-xs text-white/60">
                    <span className="text-[8px] font-bold text-white/50 uppercase tracking-wider block mb-0.5">Clinical Notes</span>
                    {appt.notes}
                  </div>
                )}

                {/* Actions */}
                {appt.status === "Approved" && !isCompleted && (
                  <div className="pt-1 flex flex-col sm:flex-row gap-2">
                    <a href={getGoogleCalendarUrl(appt)} target="_blank" rel="noopener noreferrer"
                      className="flex-grow py-2.5 text-center text-xs font-bold text-teal-300 bg-teal-500/15 hover:bg-teal-500 hover:text-white border border-teal-500/30 hover:border-teal-500 rounded-xl transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 active:scale-[0.99]">
                      <Calendar size={14} /> Add to Google Calendar
                    </a>
                    <button onClick={() => downloadIcsFile(appt)}
                      className="flex-grow py-2.5 text-xs font-bold text-white/80 bg-white/8 hover:bg-white/15 border border-white/15 rounded-xl transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 active:scale-[0.99]">
                      <Clock size={14} className="text-white/50" /> Download iCal / Outlook
                    </button>
                  </div>
                )}

                {appt.status === "Pending" && (
                  <div className="pt-1">
                    <button onClick={() => handleCancelAppointment(appt)}
                      className="w-full py-2.5 text-xs font-extrabold text-rose-400 bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 rounded-xl transition-all duration-200 cursor-pointer active:scale-[0.99]">
                      Request Cancellation
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
