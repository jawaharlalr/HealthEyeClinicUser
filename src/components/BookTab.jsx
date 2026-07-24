import React, { useState } from "react";
import { Calendar, Clock, User, Phone, MapPin, Droplets, ChevronLeft, ChevronRight, CheckCircle2, Stethoscope } from "lucide-react";

export default function BookTab({
  patientName,
  setPatientName,
  dob,
  age,
  bloodGroup,
  setBloodGroup,
  gender,
  setGender,
  patientPhone,
  setPatientPhone,
  address,
  setAddress,
  bookingDate,
  setBookingDate,
  bookingTime,
  setBookingTime,
  loading,
  handleBookAppointment,
  handleDobChange,
  getAvailableTimeSlots,
  allTimeSlots: _allTimeSlots
}) {
  const [showMondayModal, setShowMondayModal] = useState(false);
  const [phoneTouched, setPhoneTouched] = useState(false);
  const [dobTouched, setDobTouched] = useState(false);

  const isPhoneInvalid = patientPhone && patientPhone.length !== 10;
  const todayStr = new Date().toISOString().split("T")[0];
  const isDobInvalid = dob && dob > todayStr;

  const phoneError = phoneTouched && isPhoneInvalid ? "Phone number must be exactly 10 digits" : null;
  const dobError = dobTouched && isDobInvalid ? "Date of birth cannot be in the future" : null;

  const isFormInvalid = isPhoneInvalid || isDobInvalid;

  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();

  const calendarDays = [];
  for (let i = 0; i < firstDayIndex; i++) calendarDays.push(null);
  for (let d = 1; d <= daysInMonth; d++) calendarDays.push(d);

  const handlePrevMonth = () => {
    const today = new Date();
    if (currentYear === today.getFullYear() && currentMonth === today.getMonth()) return;
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(prev => prev - 1); }
    else setCurrentMonth(prev => prev - 1);
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(prev => prev + 1); }
    else setCurrentMonth(prev => prev + 1);
  };

  const getDayInfo = (dayNumber) => {
    if (!dayNumber) return { disabled: true };
    const dateObj = new Date(currentYear, currentMonth, dayNumber);
    const dayOfWeek = dateObj.getDay();
    const isMonday = dayOfWeek === 1;
    const todayObj = new Date(); todayObj.setHours(0, 0, 0, 0);
    const isInPast = dateObj < todayObj;
    const y = currentYear;
    const m = String(currentMonth + 1).padStart(2, "0");
    const d = String(dayNumber).padStart(2, "0");
    const dateStr = `${y}-${m}-${d}`;
    const isSelected = bookingDate === dateStr;
    const isToday = dateStr === new Date().toISOString().split("T")[0];
    return { dateStr, isMonday, isInPast, disabled: isInPast, isSelected, isToday };
  };

  const renderSlotsGroup = (title, icon, emoji, slots) => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");
    const todayStr = `${y}-${m}-${d}`;

    const filteredSlots = slots.filter(slot => {
      if (bookingDate === todayStr) {
        const [timePart, ampm] = slot.split(" ");
        let [hour, minute] = timePart.split(":").map(Number);
        if (ampm === "PM" && hour !== 12) hour += 12;
        if (ampm === "AM" && hour === 12) hour = 0;
        const slotMinutes = hour * 60 + minute;
        const nowMinutes = now.getHours() * 60 + now.getMinutes();
        return slotMinutes > nowMinutes;
      }
      return true;
    });

    if (filteredSlots.length === 0) return null;

    return (
      <div className="space-y-2.5">
        <div className="flex items-center gap-2">
          <span className="text-base leading-none">{emoji}</span>
          <span className="text-[10px] font-extrabold text-white/50 uppercase tracking-widest">{title}</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {filteredSlots.map((slot, idx) => {
            const isAvailable = getAvailableTimeSlots().includes(slot);
            const isSelected = bookingTime === slot;
            return (
              <button
                key={idx}
                type="button"
                disabled={!isAvailable}
                onClick={() => setBookingTime(isSelected ? "" : slot)}
                className={`relative py-3 px-1 rounded-2xl text-[11px] font-bold border-2 transition-all duration-200 flex flex-col items-center justify-center gap-1 ${
                  isSelected
                    ? "bg-teal-600 text-white border-teal-600 shadow-lg shadow-teal-600/25 scale-[1.04]"
                    : isAvailable
                    ? "bg-white/10 text-slate-200 border-white/15 hover:border-teal-500 hover:bg-teal-500/20 hover:text-teal-300 hover:scale-[1.02]"
                    : "bg-rose-500/10 text-rose-400/80 border-rose-500/20 cursor-not-allowed"
                }`}
              >
                <span>{slot}</span>
                {!isAvailable && <span className="text-[8px] font-extrabold text-rose-400 uppercase tracking-wider">Booked</span>}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const inputClass = (hasError) =>
    `w-full py-3 px-4 bg-white/8 backdrop-blur-sm border-2 rounded-2xl focus:outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/15 text-sm text-white placeholder:text-white/40 transition-all duration-200 ${
      hasError ? "border-rose-500/50 bg-rose-500/10 focus:border-rose-500 focus:ring-rose-500/15" : "border-white/12 hover:border-white/25"
    }`;

  const labelClass = "block text-[10px] font-extrabold text-white/60 uppercase tracking-widest mb-1.5";

  return (
    <div className="space-y-5 max-w-2xl mx-auto">

      {/* Header Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-teal-600 via-teal-500 to-emerald-500 p-6 shadow-xl shadow-teal-600/20">
        <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-6 -left-6 w-32 h-32 rounded-full bg-emerald-400/20 blur-xl" />
        <div className="relative flex items-center justify-between">
          <div>
            <p className="text-teal-100 text-[10px] font-extrabold uppercase tracking-widest mb-1">Healthy Eye Clinic</p>
            <h2 className="text-white text-xl font-black leading-tight">Book a Consultation</h2>
            <p className="text-teal-100/80 text-xs mt-1">Tue – Sun &nbsp;·&nbsp; 11:00 AM – 4:00 PM</p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/25">
            <Calendar size={26} className="text-white" />
          </div>
        </div>
        {/* Doctor chip */}
        <div className="relative mt-4 inline-flex items-center gap-2.5 bg-white/15 backdrop-blur-sm border border-white/25 rounded-2xl px-3.5 py-2">
          <div className="w-7 h-7 rounded-full bg-white/25 flex items-center justify-center text-white text-[10px] font-black">NK</div>
          <div>
            <p className="text-white text-[11px] font-extrabold leading-none">Nandhini K</p>
            <p className="text-teal-100/80 text-[9px] font-bold uppercase tracking-wider mt-0.5">Optometrist</p>
          </div>
          <Stethoscope size={13} className="text-white/60 ml-1" />
        </div>
      </div>

      {/* Monday Notice */}
      <div className="flex items-center gap-3 bg-amber-500/15 border border-amber-500/25 rounded-2xl px-4 py-3">
        <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
          <Calendar size={15} />
        </div>
        <p className="text-xs text-amber-300 leading-relaxed">
          <span className="font-extrabold">Closed every Monday.</span> We're open Tue–Sun, 11:00 AM to 4:00 PM.
        </p>
      </div>

      <form onSubmit={handleBookAppointment} className="space-y-5">

        {/* Patient Info Card */}
        <div className="glass rounded-3xl p-5 glass-shadow space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-6 h-6 rounded-lg bg-teal-500/20 flex items-center justify-center border border-teal-500/25">
              <User size={13} className="text-teal-400" />
            </div>
            <h4 className="text-xs font-extrabold text-white/80 uppercase tracking-wider">Patient Details</h4>
          </div>

          {/* Name */}
          <div>
            <label className={labelClass}>Full Name *</label>
            <input
              type="text"
              placeholder="Enter patient's full name"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              className={inputClass(false)}
              required
            />
          </div>

          {/* DOB + Age */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Date of Birth *</label>
              <input
                type="date"
                value={dob}
                max={new Date().toISOString().split("T")[0]}
                onChange={handleDobChange}
                onBlur={() => setDobTouched(true)}
                className={inputClass(!!dobError)}
                required
              />
              {dobError && (
                <span className="text-[10px] text-rose-500 font-bold mt-1 block animate-in fade-in duration-100">{dobError}</span>
              )}
            </div>
            <div>
              <label className={labelClass}>Age</label>
              <input type="text" value={age} readOnly placeholder="—"
                className="w-full py-3 px-4 bg-white/5 border-2 border-white/8 rounded-2xl text-sm text-white/50 cursor-not-allowed focus:outline-none" />
            </div>
          </div>

          {/* Blood Group + Gender */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Blood Group *</label>
              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                className={inputClass(false) + " cursor-pointer"}
              >
                <option>A+</option><option>A-</option>
                <option>B+</option><option>B-</option>
                <option>O+</option><option>O-</option>
                <option>AB+</option><option>AB-</option>
                <option>A1+</option><option>A1-</option>
                <option>A2+</option><option>A2-</option>
                <option>A1B+</option><option>A1B-</option>
                <option>A2B+</option><option>A2B-</option>
                <option>Bombay Phenotype (Oh)</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Gender *</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className={inputClass(false) + " cursor-pointer"}
              >
                <option>Male</option>
                <option>Female</option>
                <option>Non-binary</option>
                <option>Transgender</option>
                <option>Other</option>
                <option>Prefer not to say</option>
              </select>
            </div>
          </div>
        </div>

        {/* Contact Card */}
        <div className="glass rounded-3xl p-5 glass-shadow space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-6 h-6 rounded-lg bg-blue-500/20 flex items-center justify-center border border-blue-500/25">
              <Phone size={13} className="text-blue-400" />
            </div>
            <h4 className="text-xs font-extrabold text-white/80 uppercase tracking-wider">Contact Info</h4>
          </div>

          <div>
            <label className={labelClass}>Phone Number *</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-white/50">+91</span>
              <input
                type="tel"
                placeholder="10-digit mobile number"
                maxLength={10}
                value={patientPhone}
                onChange={(e) => { setPatientPhone(e.target.value.replace(/\D/g, "")); setPhoneTouched(true); }}
                onBlur={() => setPhoneTouched(true)}
                className={`${inputClass(!!phoneError)} pl-12`}
                required
              />
            </div>
            {phoneError && (
              <span className="text-[10px] text-rose-500 font-bold mt-1 block animate-in fade-in duration-100">{phoneError}</span>
            )}
          </div>

          <div>
            <label className={labelClass}>Residential Address *</label>
            <textarea
              placeholder="Enter full address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className={`${inputClass(false)} resize-none`}
              rows={2}
              required
            />
          </div>
        </div>

        {/* Calendar Card */}
        <div className="glass rounded-3xl p-5 glass-shadow">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 rounded-lg bg-emerald-500/20 flex items-center justify-center border border-emerald-500/25">
              <Calendar size={13} className="text-emerald-400" />
            </div>
            <h4 className="text-xs font-extrabold text-white/80 uppercase tracking-wider">Select Date *</h4>
          </div>

          {/* Month nav */}
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={handlePrevMonth}
              disabled={currentYear === new Date().getFullYear() && currentMonth === new Date().getMonth()}
              className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 flex items-center justify-center transition-all cursor-pointer disabled:opacity-30 disabled:pointer-events-none"
            >
              <ChevronLeft size={15} />
            </button>
            <span className="text-sm font-extrabold text-white">{monthNames[currentMonth]} {currentYear}</span>
            <button
              type="button"
              onClick={handleNextMonth}
              className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 flex items-center justify-center transition-all cursor-pointer"
            >
              <ChevronRight size={15} />
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 gap-1 text-center mb-2">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(d => (
              <span key={d} className="text-[9px] font-extrabold text-white/50 uppercase tracking-wider py-1">{d}</span>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((dayNum, idx) => {
              if (dayNum === null) return <div key={`empty-${idx}`} />;
              const { dateStr, isMonday, disabled, isSelected, isToday } = getDayInfo(dayNum);
              return (
                <button
                  key={`day-${dayNum}`}
                  type="button"
                  disabled={disabled}
                  onClick={() => {
                    if (isMonday) { setShowMondayModal(true); setBookingDate(""); setBookingTime(""); return; }
                    if (isSelected) { setBookingDate(""); setBookingTime(""); }
                    else { setBookingDate(dateStr); setBookingTime(""); }
                  }}
                  className={`h-10 w-full rounded-xl text-[11px] font-bold transition-all duration-150 flex flex-col items-center justify-center relative cursor-pointer ${
                    isSelected
                      ? "bg-teal-600 text-white shadow-md shadow-teal-600/25 scale-[1.08]"
                      : disabled
                      ? "text-white/70 cursor-not-allowed"
                      : isMonday
                      ? "text-rose-400 hover:bg-rose-500/15"
                      : isToday
                      ? "bg-teal-500/20 text-teal-300 border-2 border-teal-500/50 font-extrabold"
                      : "text-white/80 hover:bg-white/10"
                  }`}
                >
                  {dayNum}
                  {isMonday && !disabled && (
                    <span className="absolute bottom-0.5 text-[5px] font-black text-rose-400 uppercase leading-none">✕</span>
                  )}
                  {isToday && !isSelected && (
                    <span className="absolute bottom-0.5 w-1 h-1 rounded-full bg-teal-500" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="mt-3 pt-3 border-t border-white/10 flex items-center gap-4 flex-wrap">
            <span className="flex items-center gap-1.5 text-[9px] text-white/50 font-bold uppercase tracking-wider">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-600 inline-block" /> Selected
            </span>
            <span className="flex items-center gap-1.5 text-[9px] text-white/50 font-bold uppercase tracking-wider">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-500/30 border border-teal-500/50 inline-block" /> Today
            </span>
            <span className="flex items-center gap-1.5 text-[9px] text-white/50 font-bold uppercase tracking-wider">
              <span className="text-rose-400 text-[9px] font-black">✕</span> Closed
            </span>
          </div>
        </div>

        {/* Time Slots Card */}
        <div className="glass rounded-3xl p-5 glass-shadow">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 rounded-lg bg-purple-500/20 flex items-center justify-center border border-purple-500/25">
              <Clock size={13} className="text-purple-400" />
            </div>
            <h4 className="text-xs font-extrabold text-white/80 uppercase tracking-wider">Select Time *</h4>
          </div>

          {!bookingDate ? (
            <div className="flex flex-col items-center justify-center py-8 gap-2 text-white/40">
              <Calendar size={32} strokeWidth={1.5} />
              <p className="text-xs font-bold text-white/50">Pick a date above to see available slots</p>
            </div>
          ) : (
            <div className="space-y-5">
              {renderSlotsGroup("Morning", <Clock size={11} />, "🌅", ["11:00 AM", "12:00 PM"])}
              {renderSlotsGroup("Afternoon", <Clock size={11} />, "☀️", ["01:00 PM", "02:00 PM", "03:00 PM"])}
              {getAvailableTimeSlots().length === 0 && (
                <div className="text-center py-4">
                  <span className="text-[11px] text-rose-500 font-bold">No slots available — please pick another date.</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Summary Card */}
        {bookingDate && bookingTime && (
          <div className="relative overflow-hidden bg-gradient-to-br from-teal-600 to-emerald-500 rounded-3xl p-5 shadow-lg shadow-teal-600/20 animate-in fade-in zoom-in-95 duration-300">
            <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/10 blur-xl" />
            <div className="relative flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
                <CheckCircle2 size={20} className="text-white" />
              </div>
              <div>
                <p className="text-teal-100 text-[9px] font-extrabold uppercase tracking-widest mb-0.5">Appointment Summary</p>
                <h4 className="text-white text-sm font-extrabold leading-tight">
                  {(() => {
                    const [y, m, d] = bookingDate.split("-").map(Number);
                    const dt = new Date(y, m - 1, d);
                    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
                    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                    return `${days[dt.getDay()]}, ${months[dt.getMonth()]} ${dt.getDate()}`;
                  })()}
                </h4>
                <p className="text-teal-100/90 text-xs mt-0.5">at <span className="text-white font-extrabold">{bookingTime}</span></p>
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || isFormInvalid || !bookingDate || !bookingTime}
          className={`w-full py-4 text-sm font-extrabold rounded-2xl transition-all duration-200 shadow-lg tracking-wide ${
            loading || isFormInvalid || !bookingDate || !bookingTime
              ? "bg-white/10 text-white/40 cursor-not-allowed shadow-none"
              : "bg-gradient-to-r from-teal-600 to-emerald-500 text-white hover:from-teal-700 hover:to-emerald-600 active:scale-[0.99] cursor-pointer shadow-teal-600/25"
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Booking…
            </span>
          ) : isFormInvalid ? "Fix errors to continue" : "Confirm Appointment"}
        </button>
      </form>

      {/* Monday Modal */}
      {showMondayModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-strong rounded-3xl p-8 max-w-sm w-full text-center glass-shadow-lg animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-rose-500/15 text-rose-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-rose-500/25">
              <Calendar size={28} />
            </div>
            <h3 className="text-lg font-extrabold text-white mb-2">Clinic Closed</h3>
            <p className="text-sm text-white/60 mb-6 leading-relaxed">
              The clinic is <span className="font-bold text-slate-200">closed every Monday</span>. Please select another day.
            </p>
            <button
              type="button"
              onClick={() => setShowMondayModal(false)}
              className="w-full py-3.5 bg-gradient-to-r from-teal-600 to-emerald-500 text-white font-extrabold rounded-2xl hover:from-teal-700 hover:to-emerald-600 active:scale-[0.99] transition-all cursor-pointer shadow-lg shadow-teal-600/20"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
