import React, { useState } from "react";
import { Calendar } from "lucide-react";

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

  // Calendar picker state
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();

  const calendarDays = [];
  for (let i = 0; i < firstDayIndex; i++) {
    calendarDays.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    calendarDays.push(d);
  }

  const handlePrevMonth = () => {
    const today = new Date();
    if (currentYear === today.getFullYear() && currentMonth === today.getMonth()) {
      return;
    }
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
  };

  const getDayInfo = (dayNumber) => {
    if (!dayNumber) return { disabled: true };
    const dateObj = new Date(currentYear, currentMonth, dayNumber);
    const dayOfWeek = dateObj.getDay();

    // Monday is index 1
    const isMonday = dayOfWeek === 1;

    const todayObj = new Date();
    todayObj.setHours(0, 0, 0, 0);
    const isInPast = dateObj < todayObj;

    const y = currentYear;
    const m = String(currentMonth + 1).padStart(2, "0");
    const d = String(dayNumber).padStart(2, "0");
    const dateStr = `${y}-${m}-${d}`;

    const isSelected = bookingDate === dateStr;

    return {
      dateStr,
      isMonday,
      isInPast,
      disabled: isInPast,
      isSelected
    };
  };

  const renderSlotsGroup = (title, icon, slots) => {
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
      <div className="space-y-2">
        <h5 className="text-[9px] font-extrabold text-slate-450 uppercase tracking-wider flex items-center gap-1.5 px-1">
          <span>{icon}</span>
          <span>{title}</span>
        </h5>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {filteredSlots.map((slot, idx) => {
            const isAvailable = getAvailableTimeSlots().includes(slot);
            const isSelected = bookingTime === slot;

            return (
              <div key={idx} className="relative group">
                <button
                  type="button"
                  disabled={!isAvailable}
                  onClick={() => setBookingTime(isSelected ? "" : slot)}
                  className={`w-full py-3 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                    isSelected
                      ? "bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20 scale-[1.02]"
                      : isAvailable
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100/70 hover:border-emerald-300"
                      : "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-60"
                  }`}
                >
                  <span>{slot}</span>
                </button>
                <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-20 bg-slate-800 text-white text-[9px] font-bold py-1.5 px-2 rounded-lg text-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-md z-30 before:content-[''] before:absolute before:top-full before:left-1/2 before:-translate-x-1/2 before:border-4 before:border-transparent before:border-t-slate-800">
                  {isSelected ? "Selected" : isAvailable ? "Available" : "Booked"}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white/80 backdrop-blur-md border border-slate-200/40 rounded-3xl p-6 md:p-8 shadow-sm animate-in fade-in duration-300 max-w-2xl mx-auto">
      <h3 className="text-base font-extrabold text-slate-800 mb-4 flex items-center gap-2">
        <Calendar size={18} className="text-primary" />
        Request a Consultation
      </h3>

      {/* Monday Note Banner */}
      <div className="mb-6 p-4 bg-gradient-to-r from-amber-500/8 via-amber-500/4 to-transparent backdrop-blur-md border border-amber-500/20 rounded-2xl text-xs text-amber-900 flex items-center gap-3.5 shadow-sm animate-in fade-in duration-200">
        <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0 border border-amber-500/20">
          <Calendar size={16} className="animate-pulse" />
        </div>
        <div className="flex-1 leading-normal">
          <span className="font-extrabold text-[10px] uppercase tracking-wider block text-amber-800 mb-0.5">Clinic Schedule Note</span>
          The clinic operates <span className="font-extrabold text-primary">Tuesday - Sunday</span>. All Mondays clinic is closed.
        </div>
      </div>

      <form onSubmit={handleBookAppointment} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">Patient Name *</label>
            <input
              type="text"
              placeholder="Full name"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              className="w-full py-2.5 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 text-xs text-slate-850 transition-all"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">Date of Birth *</label>
              <input
                type="date"
                value={dob}
                max={new Date().toISOString().split("T")[0]}
                onChange={handleDobChange}
                onBlur={() => setDobTouched(true)}
                className={`w-full py-2.5 px-4 bg-slate-50 border rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 text-xs text-slate-850 transition-all ${
                  dobError ? "border-rose-400 bg-rose-50/20" : "border-slate-200"
                }`}
                required
              />
              {dobError && (
                <span className="text-[10px] text-rose-500 font-bold mt-1 block animate-in fade-in duration-100">
                  {dobError}
                </span>
              )}
            </div>
            <div>
              <label className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">Age *</label>
              <input
                type="text"
                value={age}
                readOnly
                placeholder=""
                className="w-full py-2.5 px-4 bg-slate-100/50 border border-slate-200 rounded-xl text-xs text-slate-500 cursor-not-allowed focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">Blood Group *</label>
            <select
              value={bloodGroup}
              onChange={(e) => setBloodGroup(e.target.value)}
              className="w-full py-2.5 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 text-xs text-slate-850 transition-all cursor-pointer"
            >
              <option>A+</option>
              <option>A-</option>
              <option>B+</option>
              <option>B-</option>
              <option>O+</option>
              <option>O-</option>
              <option>AB+</option>
              <option>AB-</option>
              <option>A1+</option>
              <option>A1-</option>
              <option>A2+</option>
              <option>A2-</option>
              <option>A1B+</option>
              <option>A1B-</option>
              <option>A2B+</option>
              <option>A2B-</option>
              <option>Bombay Phenotype (Oh)</option>
            </select>
          </div>
          <div>
            <label className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">Gender *</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full py-2.5 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 text-xs text-slate-850 transition-all cursor-pointer"
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

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">Contact Telephone *</label>
            <input
              type="tel"
              placeholder="10-digit number"
              maxLength={10}
              value={patientPhone}
              onChange={(e) => {
                setPatientPhone(e.target.value.replace(/\D/g, ""));
                setPhoneTouched(true);
              }}
              onBlur={() => setPhoneTouched(true)}
              className={`w-full py-2.5 px-4 bg-slate-50 border rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 text-xs text-slate-850 transition-all ${
                phoneError ? "border-rose-400 bg-rose-50/20" : "border-slate-200"
              }`}
              required
            />
            {phoneError && (
              <span className="text-[10px] text-rose-500 font-bold mt-1 block animate-in fade-in duration-100">
                {phoneError}
              </span>
            )}
          </div>
          <div>
            <label className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">Specialist Consultant</label>
            <div className="flex items-center gap-3 px-4 py-2 bg-primary-light/50 border border-primary/10 rounded-xl">
              <div className="w-7 h-7 bg-primary/10 text-primary rounded-full flex items-center justify-center font-extrabold text-[10px] border border-primary/20">
                NK
              </div>
              <div>
                <h5 className="font-extrabold text-slate-850 text-[10px] leading-tight">Nandhini K</h5>
                <p className="text-[8px] text-primary font-bold uppercase tracking-wider leading-none">Optometrist</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">Residential Address *</label>
            <textarea
              placeholder="Enter full address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full py-2 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 text-xs text-slate-850 resize-none transition-all"
              rows={2}
              required
            />
          </div>
        </div>

        {/* Premium Frosted Glass Date Selector */}
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">Consultation Date *</label>
            <div className="bg-slate-50/50 backdrop-blur-sm border border-slate-200/50 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-4 px-1">
                <button
                  type="button"
                  onClick={handlePrevMonth}
                  className="p-1 hover:bg-slate-100 rounded-lg text-slate-500 cursor-pointer disabled:opacity-30 disabled:pointer-events-none transition-colors text-xs font-bold"
                  disabled={currentYear === new Date().getFullYear() && currentMonth === new Date().getMonth()}
                >
                  &larr; Prev
                </button>
                <span className="text-xs font-extrabold text-slate-800">
                  {monthNames[currentMonth]} {currentYear}
                </span>
                <button
                  type="button"
                  onClick={handleNextMonth}
                  className="p-1 hover:bg-slate-100 rounded-lg text-slate-500 cursor-pointer transition-colors text-xs font-bold"
                >
                  Next &rarr;
                </button>
              </div>

              <div className="grid grid-cols-7 gap-1 text-center mb-1 text-[8px] font-extrabold text-slate-400 uppercase tracking-wider">
                <span>Sun</span>
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
              </div>

              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((dayNum, idx) => {
                  if (dayNum === null) {
                    return <div key={`empty-${idx}`} />;
                  }

                  const { dateStr, isMonday, disabled, isSelected } = getDayInfo(dayNum);

                  return (
                    <button
                      key={`day-${dayNum}`}
                      type="button"
                      disabled={disabled}
                      onClick={() => {
                        if (isMonday) {
                          setShowMondayModal(true);
                          setBookingDate("");
                          setBookingTime("");
                          return;
                        }
                        if (isSelected) {
                          setBookingDate("");
                          setBookingTime("");
                        } else {
                          setBookingDate(dateStr);
                          setBookingTime("");
                        }
                      }}
                      className={`h-9 w-full rounded-xl text-[10px] font-bold transition-all flex flex-col items-center justify-center relative cursor-pointer ${
                        isSelected
                          ? "bg-emerald-600 text-white font-extrabold shadow-sm shadow-emerald-600/20 scale-[1.05]"
                          : disabled
                          ? "bg-slate-100/50 text-slate-300 cursor-not-allowed opacity-40"
                          : isMonday
                          ? "bg-rose-50/40 text-rose-600 border border-rose-100/60 hover:bg-rose-50 hover:border-rose-200"
                          : "bg-white text-slate-700 hover:bg-primary-light hover:text-primary border border-slate-150/40 hover:border-primary/20"
                      }`}
                    >
                      <span>{dayNum}</span>
                      {isMonday && (
                        <span className="absolute bottom-0.5 text-[5px] font-extrabold uppercase text-rose-500 scale-75">
                          Closed
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Premium Frosted Glass Time Slot Selector */}
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">Time Slot (11:00 AM - 4:00 PM) *</label>
            {!bookingDate ? (
              <div className="text-xs text-slate-400 italic p-4 bg-slate-50 border border-dashed border-slate-200 rounded-2xl text-center">
                Please select a consultation date above to view slots.
              </div>
            ) : (
              <div className="space-y-4">
                {renderSlotsGroup("Morning Sessions", "🌅", ["11:00 AM", "12:00 PM"])}
                {renderSlotsGroup("Afternoon Sessions", "☀️", ["01:00 PM", "02:00 PM", "03:00 PM"])}
                
                {getAvailableTimeSlots().length === 0 && (
                  <div className="text-center py-2">
                    <span className="text-[10px] text-rose-500 font-bold">
                      No slots available on this day. Please select another date.
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Selection Summary Card */}
        {bookingDate && bookingTime && (
          <div className="bg-gradient-to-br from-primary-light/65 via-white to-secondary-light/40 border border-primary/20 rounded-2xl p-4 text-center space-y-1 animate-in fade-in zoom-in-95 duration-300 shadow-sm">
            <span className="text-[8px] font-extrabold text-secondary uppercase tracking-widest bg-secondary-light border border-secondary/15 px-2 py-0.5 rounded-full inline-block">
              Selected Schedule
            </span>
            <h4 className="text-xs font-extrabold text-slate-800 pt-1">
              {(() => {
                const [y, m, d] = bookingDate.split("-").map(Number);
                const dt = new Date(y, m - 1, d);
                const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
                const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                return `${days[dt.getDay()]} • ${months[dt.getMonth()]} ${dt.getDate()}, ${dt.getFullYear()}`;
              })()}
            </h4>
            <p className="text-[10px] text-slate-555">
              at <span className="text-primary font-bold">{bookingTime}</span>
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || isFormInvalid || !bookingDate || !bookingTime}
          className={`w-full py-3.5 text-white font-extrabold rounded-xl transition-all shadow-md mt-2 ${
            loading || isFormInvalid || !bookingDate || !bookingTime
              ? "bg-slate-350 opacity-55 cursor-not-allowed shadow-none"
              : "bg-primary hover:bg-primary-hover active:scale-[0.99] cursor-pointer shadow-primary/10"
          }`}
        >
          {isFormInvalid ? "Fix errors to submit" : "Book Appointment"}
        </button>
      </form>

      {showMondayModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200/50 rounded-3xl p-8 max-w-sm text-center shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-rose-100">
              <Calendar size={32} />
            </div>
            <h3 className="text-lg font-extrabold text-slate-800 mb-2">Clinic Closed</h3>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              All Mondays clinic closed. Please choose another date.
            </p>
            <button 
              type="button"
              onClick={() => setShowMondayModal(false)}
              className="w-full py-3 bg-primary text-white font-extrabold rounded-xl hover:bg-primary-hover active:scale-[0.99] transition-all cursor-pointer shadow-md shadow-primary/10"
            >
              Okay
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
