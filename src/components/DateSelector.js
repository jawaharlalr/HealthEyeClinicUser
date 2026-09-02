import React from 'react';
import { Calendar as CalendarIcon, AlertCircle, CheckCircle2 } from 'lucide-react';
import { isMonday, isPastDate, formatReadableDate, getTodayDateStrIST } from '../utils/appointmentSlots';

export default function DateSelector({ selectedDate, onSelectDate }) {
  const todayISTStr = getTodayDateStrIST();

  // Generate quick pick pills for upcoming valid clinic days (Tue-Sun) starting from today
  const getUpcomingDays = () => {
    const days = [];
    const [y, m, d] = todayISTStr.split('-').map(Number);
    let current = new Date(y, m - 1, d);

    while (days.length < 6) {
      const year = current.getFullYear();
      const month = String(current.getMonth() + 1).padStart(2, '0');
      const day = String(current.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;

      if (!isMonday(dateStr) && !isPastDate(dateStr)) {
        days.push({
          dateStr,
          dayName: current.toLocaleDateString('en-US', { weekday: 'short' }),
          dayNum: current.getDate(),
          monthName: current.toLocaleDateString('en-US', { month: 'short' }),
          isToday: dateStr === todayISTStr
        });
      }
      current.setDate(current.getDate() + 1);
    }
    return days;
  };

  const upcomingDays = getUpcomingDays();

  const handleDateChange = (e) => {
    const val = e.target.value;
    onSelectDate(val);
  };

  const isSelectedMonday = isMonday(selectedDate);
  const isSelectedPast = isPastDate(selectedDate);

  return (
    <div className="space-y-6">
      <div className="text-center sm:text-left">
        <h3 className="text-xl font-bold text-slate-900 flex items-center justify-center sm:justify-start gap-2">
          <CalendarIcon className="w-5 h-5 text-teal-600" />
          <span>Select Appointment Date</span>
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Working Days: <strong>Tuesday – Sunday</strong> (11:00 AM – 4:00 PM). <span className="text-pink-600 font-semibold">Monday: Closed</span>.
        </p>
      </div>

      {/* Quick Pick Date Pills */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          Upcoming Available Days:
        </label>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {upcomingDays.map((item) => {
            const isSelected = selectedDate === item.dateStr;
            return (
              <button
                key={item.dateStr}
                type="button"
                onClick={() => onSelectDate(item.dateStr)}
                className={`p-3 rounded-xl border text-center transition-all ${
                  isSelected
                    ? 'bg-teal-600 text-white border-teal-600 shadow-md ring-2 ring-teal-200'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-teal-400 hover:bg-teal-50/50'
                }`}
              >
                <span className="block text-[11px] font-bold uppercase tracking-wider opacity-90">
                  {item.isToday ? 'Today' : item.dayName}
                </span>
                <span className="block text-lg font-extrabold">{item.dayNum}</span>
                <span className="block text-[10px] opacity-80">{item.monthName}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Manual Calendar Picker */}
      <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-3">
        <label htmlFor="appointment-date" className="block text-sm font-bold text-slate-800">
          Or pick a specific date:
        </label>
        <div className="relative max-w-sm">
          <input
            id="appointment-date"
            type="date"
            min={todayISTStr}
            value={selectedDate || ''}
            onChange={handleDateChange}
            className="w-full px-4 py-3 bg-white rounded-xl border border-slate-300 text-slate-900 font-semibold focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none shadow-sm"
          />
        </div>

        {/* Validation Alerts */}
        {isSelectedMonday && (
          <div className="p-3.5 bg-pink-50 border border-pink-200 rounded-xl text-pink-900 text-sm flex items-center gap-2.5 animate-fadeIn">
            <AlertCircle className="w-5 h-5 text-pink-600 flex-shrink-0" />
            <span>Clinic is closed on Mondays.</span>
          </div>
        )}

        {isSelectedPast && (
          <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-sm flex items-center gap-2.5 animate-fadeIn">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <span>Please select today or a future date.</span>
          </div>
        )}

        {selectedDate && !isSelectedMonday && !isSelectedPast && (
          <div className="p-3.5 bg-teal-50 border border-teal-200 rounded-xl text-teal-900 text-sm flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-teal-600 flex-shrink-0" />
            <span>
              Selected Date: <strong>{formatReadableDate(selectedDate)}</strong>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
