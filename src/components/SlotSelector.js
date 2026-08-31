import React from 'react';
import { Clock, CheckCircle2, Lock, AlertCircle } from 'lucide-react';
import { CLINIC_SLOTS, formatReadableDate } from '../utils/appointmentSlots';

export default function SlotSelector({
  selectedDate,
  bookedSlotIds = [],
  selectedSlot,
  onSelectSlot,
  loading = false,
  onChangeDate
}) {
  const isAllBooked = bookedSlotIds.length >= CLINIC_SLOTS.length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-teal-600" />
            <span>Select Available Time</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Available appointment times for <strong>{formatReadableDate(selectedDate)}</strong>
          </p>
        </div>

        <button
          type="button"
          onClick={onChangeDate}
          className="text-xs font-semibold text-teal-700 hover:text-teal-800 underline self-start sm:self-auto"
        >
          Change Date
        </button>
      </div>

      {loading ? (
        <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 space-y-3 animate-pulse">
          <div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full mx-auto animate-spin" />
          <p className="text-sm font-semibold text-slate-600">
            Checking available times...
          </p>
        </div>
      ) : isAllBooked ? (
        <div className="p-6 bg-pink-50 border border-pink-200 rounded-2xl text-center space-y-4">
          <AlertCircle className="w-10 h-10 text-pink-600 mx-auto" />
          <div>
            <h4 className="text-base font-bold text-pink-900">
              No available times for this date.
            </h4>
            <p className="text-xs sm:text-sm text-pink-700 mt-1">
              All times for {formatReadableDate(selectedDate)} are already booked. Please choose another date.
            </p>
          </div>
          <button
            type="button"
            onClick={onChangeDate}
            className="inline-flex items-center px-4 py-2.5 bg-pink-600 hover:bg-pink-700 text-white font-semibold text-xs rounded-xl shadow-sm transition"
          >
            Choose another date
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CLINIC_SLOTS.map((slot) => {
            const isBooked = bookedSlotIds.includes(slot.id);
            const isSelected = selectedSlot && selectedSlot.id === slot.id;

            if (isBooked) {
              return (
                <div
                  key={slot.id}
                  className="p-5 rounded-2xl border-2 border-slate-200 bg-slate-100 text-slate-400 flex flex-col justify-between h-28 cursor-not-allowed select-none opacity-75"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-base sm:text-lg font-extrabold text-slate-500 line-through">
                      {slot.label}
                    </span>
                    <Lock className="w-4 h-4 text-slate-400" />
                  </div>
                  <div>
                    <span className="inline-block text-xs bg-pink-100 text-pink-700 font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                      Booked
                    </span>
                  </div>
                </div>
              );
            }

            return (
              <button
                key={slot.id}
                type="button"
                onClick={() => onSelectSlot(slot)}
                className={`p-5 rounded-2xl border-2 text-left transition-all duration-200 flex flex-col justify-between h-28 group ${
                  isSelected
                    ? 'bg-teal-600 text-white border-teal-600 shadow-lg ring-4 ring-teal-100'
                    : 'bg-white text-slate-900 border-slate-200 hover:border-teal-500 hover:shadow-md'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className={`text-base sm:text-lg font-extrabold tracking-tight ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                    {slot.label}
                  </span>
                  {isSelected && <CheckCircle2 className="w-5 h-5 text-white" />}
                </div>

                <div>
                  <span
                    className={`inline-block text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider transition ${
                      isSelected
                        ? 'bg-white/20 text-white'
                        : 'bg-teal-50 text-teal-700 border border-teal-200 group-hover:bg-teal-600 group-hover:text-white'
                    }`}
                  >
                    Available
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
