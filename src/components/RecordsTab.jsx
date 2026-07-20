import React from "react";
import { Clock, Calendar, Check } from "lucide-react";

const getGoogleCalendarUrl = (appt) => {
  try {
    const [timeStr, modifier] = appt.time.split(" ");
    let [hours, minutes] = timeStr.split(":");
    hours = parseInt(hours, 10);
    if (modifier === "PM" && hours < 12) {
      hours += 12;
    }
    if (modifier === "AM" && hours === 12) {
      hours = 0;
    }

    const startDt = new Date(`${appt.date}T${hours.toString().padStart(2, "0")}:${minutes}:00`);
    const endDt = new Date(startDt.getTime() + 60 * 60 * 1000);

    const formatGCalDate = (date) => {
      return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    };

    const dates = `${formatGCalDate(startDt)}/${formatGCalDate(endDt)}`;
    const text = `Eye Consultation - ${appt.doctorName}`;
    const details = `Eye Checkup Consultation at Healthy Eye Clinic\nPatient: ${appt.patientName}\nMRN: ${appt.mrno || "N/A"}\nStatus: Confirmed`;
    const location = `Healthy Eye Clinic`;

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(text)}&dates=${dates}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(location)}`;
  } catch (e) {
    console.error("Error generating calendar link", e);
    return "#";
  }
};

const downloadIcsFile = (appt) => {
  try {
    const [timeStr, modifier] = appt.time.split(" ");
    let [hours, minutes] = timeStr.split(":");
    hours = parseInt(hours, 10);
    if (modifier === "PM" && hours < 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;

    const startDt = new Date(`${appt.date}T${hours.toString().padStart(2, "0")}:${minutes}:00`);
    const endDt = new Date(startDt.getTime() + 60 * 60 * 1000);

    const formatIcsDate = (date) => {
      return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    };

    const icsMSG = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Healthy Eye Clinic//Appointment Reminder//EN",
      "BEGIN:VEVENT",
      `UID:appt-${appt.id || Math.random().toString(36).substr(2, 9)}`,
      `DTSTAMP:${formatIcsDate(new Date())}`,
      `DTSTART:${formatIcsDate(startDt)}`,
      `DTEND:${formatIcsDate(endDt)}`,
      `SUMMARY:Eye Consultation - ${appt.doctorName}`,
      `DESCRIPTION:Eye Checkup Consultation\\nPatient: ${appt.patientName}\\nMRN: ${appt.mrno || "N/A"}\\nStatus: Confirmed`,
      "LOCATION:Healthy Eye Clinic",
      "BEGIN:VALARM",
      "TRIGGER:-PT15M",
      "ACTION:DISPLAY",
      "DESCRIPTION:Reminder: Eye Consultation appointment in 15 minutes",
      "END:VALARM",
      "END:VEVENT",
      "END:VCALENDAR"
    ].join("\r\n");

    const blob = new Blob([icsMSG], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `appointment-${appt.date}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (e) {
    console.error("Error downloading ICS file", e);
  }
};

export default function RecordsTab({ appointments, handleCancelAppointment }) {
  return (
    <div className="space-y-4 animate-in fade-in duration-300 max-w-2xl mx-auto">
      <h3 className="text-base font-extrabold text-slate-800 flex items-center gap-2 px-1">
        <Clock size={18} className="text-primary" />
        Consultation Records
      </h3>

      {appointments.length === 0 ? (
        <div className="bg-white/80 backdrop-blur-md border border-slate-200/50 rounded-3xl p-8 text-center text-xs text-slate-400 shadow-sm">
          No registered consultations on record.
        </div>
      ) : (
        <div className="relative border-l border-slate-200/60 ml-3.5 pl-6 space-y-6">
          {appointments.map((appt, idx) => {
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
              <div key={idx} className="relative bg-white/70 backdrop-blur-xl border border-white/45 rounded-2xl p-5 space-y-4 shadow-[0_8px_30px_rgb(0,0,0,0.03)] hover:shadow-[0_12px_35px_rgb(0,0,0,0.05)] transition-all duration-200 hover:scale-[1.005]">
                {/* Timeline Node Icon */}
                <span className={`absolute -left-[31px] top-5 w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  isCompleted 
                    ? "bg-emerald-500 border-emerald-500 text-white" 
                    : appt.status === "Approved"
                    ? "bg-primary border-primary text-white"
                    : appt.status === "Cancelled"
                    ? "bg-rose-500 border-rose-500 text-white"
                    : "bg-amber-400 border-amber-400 text-white"
                }`}>
                  {isCompleted && <Check size={10} strokeWidth={4} />}
                </span>

                {/* Header Information */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100/60 pb-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[9px] bg-slate-100/60 backdrop-blur-sm text-slate-600 font-extrabold px-1.5 py-0.5 rounded border border-slate-200/50">
                        S.No: {idx + 1}
                      </span>
                      {appt.appointmentNo && (
                        <span className="text-[9px] bg-primary-light/60 backdrop-blur-sm text-primary font-extrabold px-1.5 py-0.5 rounded border border-primary/20">
                          Appt No: {appt.appointmentNo}
                        </span>
                      )}
                    </div>
                    <h4 className="font-extrabold text-slate-800 text-sm">{appt.patientName}</h4>
                    <p className="text-[10px] text-slate-450">{appt.doctorName}</p>
                  </div>
                  
                  {/* Status Badge */}
                  <span className={`self-start sm:self-center text-[9px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                    isCompleted
                      ? "bg-blue-50/60 text-blue-700 border-blue-100/50"
                      : appt.status === "Approved"
                      ? "bg-primary-light/60 text-primary border-primary/20"
                      : appt.status === "Cancelled"
                      ? "bg-rose-50/50 text-rose-700 border-rose-100/50"
                      : "bg-amber-50/50 text-amber-700 border-amber-100/50"
                  }`}>
                    {isCompleted ? "Completed" : appt.status === "Approved" ? "Confirmed" : appt.status === "Pending" ? "Awaiting Review" : appt.status}
                  </span>
                </div>

                {/* Appointment Date & Time Info */}
                <div className="grid grid-cols-2 gap-4 text-xs text-slate-500 bg-slate-50/30 backdrop-blur-sm p-3 rounded-xl border border-slate-200/25">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-slate-400" />
                    <span className="font-medium text-slate-700">{appt.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-slate-400" />
                    <span className="font-medium text-slate-700">{appt.time}</span>
                  </div>
                </div>

                {/* Patient Profile Info */}
                <div className="space-y-2">
                  <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block">Patient Details</span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 bg-slate-50/20 backdrop-blur-sm p-3.5 rounded-xl border border-slate-200/25 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[8px] uppercase font-bold tracking-wider">Phone</span>
                      <span className="text-slate-700 font-extrabold">{appt.phone || "N/A"}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[8px] uppercase font-bold tracking-wider">DOB</span>
                      <span className="text-slate-700 font-semibold">{appt.dob || "N/A"}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[8px] uppercase font-bold tracking-wider">Age / Gender</span>
                      <span className="text-slate-700 font-semibold">
                        {appt.age !== undefined ? `${appt.age} yrs` : "N/A"} • {appt.gender || "N/A"}
                      </span>
                    </div>
                    <div className="col-span-2 sm:col-span-3">
                      <span className="text-slate-400 block text-[8px] uppercase font-bold tracking-wider">Address</span>
                      <span className="text-slate-700 font-medium">{appt.address || "N/A"}</span>
                    </div>
                  </div>
                </div>

                {appt.notes && (
                  <div className="bg-slate-50/40 backdrop-blur-sm p-3 rounded-xl border border-slate-200/35 text-xs text-slate-600">
                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Clinical Notes</span>
                    {appt.notes}
                  </div>
                )}

                {/* Interactive Action Buttons */}
                {appt.status === "Approved" && !isCompleted && (
                  <div className="pt-1 flex flex-col sm:flex-row gap-2">
                    <a
                      href={getGoogleCalendarUrl(appt)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-grow py-2 text-center text-xs font-bold text-primary bg-primary-light/60 backdrop-blur-sm hover:bg-primary hover:text-white border border-primary/20 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.99]"
                    >
                      <Calendar size={14} />
                      Add to Google Calendar
                    </a>
                    <button
                      onClick={() => downloadIcsFile(appt)}
                      className="flex-grow py-2 text-xs font-bold text-slate-600 bg-slate-50/60 backdrop-blur-sm hover:bg-slate-100 border border-slate-200 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-[0.99]"
                    >
                      <Clock size={14} className="text-slate-455" />
                      Download iCal / Outlook
                    </button>
                  </div>
                )}

                {appt.status === "Pending" && (
                  <div className="pt-1 flex gap-2">
                    <button
                      onClick={() => handleCancelAppointment(appt)}
                      className="w-full py-2 text-xs font-extrabold text-rose-600 bg-rose-50/60 backdrop-blur-sm hover:bg-rose-100 border border-rose-100/50 rounded-xl transition-all cursor-pointer active:scale-[0.99]"
                    >
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
