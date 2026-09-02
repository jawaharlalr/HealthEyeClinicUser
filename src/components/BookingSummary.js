import React from 'react';
import { Calendar, Clock, User, Phone, MapPin, ShieldCheck, ArrowLeft, AlertCircle, MessageSquare } from 'lucide-react';
import { CLINIC_INFO, formatReadableDate } from '../utils/appointmentSlots';

export default function BookingSummary({
  selectedDate,
  selectedSlot,
  formData,
  patientType,
  onConfirm,
  onBack,
  submitting,
  errorMsg
}) {
  return (
    <div className="space-y-6 animate-fadeIn">
      
      <div className="border-b border-slate-100 pb-4">
        <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-teal-600" />
          <span>Review Appointment Details</span>
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Please confirm your details before submitting your appointment request.
        </p>
      </div>

      {errorMsg && (
        <div className="bg-pink-50 border border-pink-200 text-pink-700 p-4 rounded-xl text-xs flex items-center gap-2 font-semibold">
          <AlertCircle className="w-4 h-4 flex-shrink-0 text-pink-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-6">
        
        {/* Date & Time Highlight */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="bg-white p-4 rounded-xl border border-teal-200 bg-teal-50/40 space-y-1">
            <span className="text-xs font-bold text-teal-700 uppercase block flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> Date
            </span>
            <strong className="text-slate-900 text-base block">
              {formatReadableDate(selectedDate)}
            </strong>
          </div>

          <div className="bg-white p-4 rounded-xl border border-blue-200 bg-blue-50/40 space-y-1">
            <span className="text-xs font-bold text-blue-700 uppercase block flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Time Slot
            </span>
            <strong className="text-slate-900 text-base block">
              {selectedSlot?.label}
            </strong>
          </div>
        </div>

        {/* Patient Contact Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1">
            <span className="text-xs font-semibold text-slate-400 uppercase block flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-teal-600" /> Patient Name
            </span>
            <strong className="text-slate-900 text-base block">
              {formData.fullName}
            </strong>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1">
            <span className="text-xs font-semibold text-slate-400 uppercase block flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-teal-600" /> Phone Number
            </span>
            <strong className="text-slate-900 text-base block">
              {formData.mobile}
            </strong>
          </div>
        </div>

        {/* Optional Notes if present */}
        {formData.notes && (
          <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1 text-sm">
            <span className="text-xs font-semibold text-slate-400 uppercase block flex items-center gap-1">
              <MessageSquare className="w-3.5 h-3.5 text-teal-600" /> Optional Notes
            </span>
            <p className="text-slate-800 text-xs italic">
              "{formData.notes}"
            </p>
          </div>
        )}

        {/* Location & Clinic Box */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1.5">
          <strong className="text-slate-900 text-sm block">{CLINIC_INFO.name}</strong>
          <p className="flex items-center gap-1.5 text-slate-700">
            <MapPin className="w-4 h-4 text-teal-600 flex-shrink-0" />
            <span>{CLINIC_INFO.address}</span>
          </p>
          <p className="flex items-center gap-1.5 text-slate-700">
            <Phone className="w-4 h-4 text-teal-600 flex-shrink-0" />
            <span>Phone: <strong>{CLINIC_INFO.phone}</strong></span>
          </p>
        </div>

      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <button
          type="button"
          disabled={submitting}
          onClick={onBack}
          className="w-full sm:w-auto px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center justify-center space-x-1 border border-slate-200 rounded-xl hover:bg-slate-50 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Edit Patient Details</span>
        </button>

        <button
          type="button"
          disabled={submitting}
          onClick={onConfirm}
          className="w-full sm:w-auto px-8 py-3.5 bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-sm rounded-xl shadow-lg transition disabled:opacity-50 flex items-center justify-center space-x-2"
        >
          {submitting ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Confirming Booking...</span>
            </div>
          ) : (
            <span>Submit Appointment Request</span>
          )}
        </button>
      </div>

    </div>
  );
}
