import React from 'react';
import { Calendar, Clock, User, Phone, MapPin, ShieldCheck, AlertCircle, ArrowLeft, Mail, Droplet } from 'lucide-react';
import { CLINIC_INFO, formatReadableDate } from '../utils/appointmentSlots';

export default function BookingSummary({
  selectedDate,
  selectedSlot,
  formData,
  patientType,
  onConfirm,
  onBack,
  submitting = false,
  errorMsg = null
}) {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="border-b border-slate-200 pb-4">
        <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-teal-600" />
          <span>Confirm Appointment Details</span>
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Please review your details before confirming your appointment.
        </p>
      </div>

      {errorMsg && (
        <div className="p-4 bg-pink-50 border border-pink-200 rounded-xl text-pink-900 text-sm flex items-start gap-3 animate-shake">
          <AlertCircle className="w-5 h-5 text-pink-600 flex-shrink-0 mt-0.5" />
          <div>
            <strong className="block font-bold">Notice</strong>
            <span>{errorMsg}</span>
          </div>
        </div>
      )}

      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-6">
        
        {/* Date & Time Slot Badge */}
        <div className="bg-white p-4 rounded-xl border border-teal-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-teal-50 text-teal-700 rounded-xl">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-teal-700 uppercase tracking-wider block">
                Appointment Date
              </span>
              <span className="text-base font-extrabold text-slate-900">
                {formatReadableDate(selectedDate)}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-50 text-blue-700 rounded-xl">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-blue-700 uppercase tracking-wider block">
                Time Slot
              </span>
              <span className="text-base font-extrabold text-slate-900">
                {selectedSlot?.label}
              </span>
            </div>
          </div>
        </div>

        {/* Attending Specialist Banner */}
        <div className="bg-teal-50/80 border border-teal-200 rounded-xl p-3.5 flex items-center space-x-3 text-slate-800">
          <div className="w-10 h-10 rounded-full bg-teal-600 text-white font-extrabold flex items-center justify-center text-sm shadow-sm flex-shrink-0">
            NK
          </div>
          <div>
            <span className="text-[11px] font-bold text-teal-700 uppercase tracking-wider block">
              Attending Vision Specialist
            </span>
            <span className="text-sm font-extrabold text-slate-900 block">
              {CLINIC_INFO.optometristTitle}
            </span>
          </div>
        </div>

        {/* Patient Profile Summary */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100 pb-2">
            Patient Information ({patientType === 'new' ? 'New Registration' : 'Existing Patient Profile'})
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div className="flex items-center space-x-2 text-slate-700">
              <User className="w-4 h-4 text-teal-600 flex-shrink-0" />
              <span><strong>Name:</strong> {formData.fullName}</span>
            </div>

            <div className="flex items-center space-x-2 text-slate-700">
              <Phone className="w-4 h-4 text-teal-600 flex-shrink-0" />
              <span><strong>Mobile:</strong> {formData.mobile}</span>
            </div>

            <div className="flex items-center space-x-2 text-slate-700">
              <Mail className="w-4 h-4 text-teal-600 flex-shrink-0" />
              <span><strong>Email:</strong> {formData.email}</span>
            </div>

            <div className="flex items-center space-x-2 text-slate-700">
              <Calendar className="w-4 h-4 text-teal-600 flex-shrink-0" />
              <span><strong>Date of Birth:</strong> {formData.dateOfBirth}</span>
            </div>

            <div className="flex items-center space-x-2 text-slate-700">
              <User className="w-4 h-4 text-teal-600 flex-shrink-0" />
              <span><strong>Gender:</strong> {formData.gender}</span>
            </div>

            <div className="flex items-center space-x-2 text-slate-700">
              <Droplet className="w-4 h-4 text-teal-600 flex-shrink-0" />
              <span>
                <strong>Blood Group:</strong> {formData.bloodGroup}
                {formData.bloodGroup === 'Other / Rare' && formData.bloodGroupOther && ` (${formData.bloodGroupOther})`}
              </span>
            </div>

            <div className="flex items-center space-x-2 text-slate-700 col-span-1 sm:col-span-2">
              <MapPin className="w-4 h-4 text-teal-600 flex-shrink-0" />
              <span><strong>Address:</strong> {formData.address}</span>
            </div>
          </div>
        </div>

        {/* Clinic Location */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2 text-xs text-slate-600">
          <div className="flex items-center space-x-2 font-bold text-slate-900">
            <MapPin className="w-4 h-4 text-teal-600" />
            <span>Clinic Details:</span>
          </div>
          <p className="pl-6 font-bold text-slate-900">{CLINIC_INFO.name}</p>
          <p className="pl-6">{CLINIC_INFO.address}</p>
          <p className="pl-6 font-semibold text-teal-700">Phone: {CLINIC_INFO.phone}</p>
        </div>

      </div>

      {/* Action Buttons */}
      <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 pt-2">
        <button
          type="button"
          onClick={onBack}
          disabled={submitting}
          className="w-full sm:w-auto px-5 py-3 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold text-sm rounded-xl transition flex items-center justify-center space-x-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Edit Info</span>
        </button>

        <button
          type="button"
          onClick={onConfirm}
          disabled={submitting}
          className="w-full sm:w-auto px-8 py-3.5 bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-teal-600/30 transition flex items-center justify-center space-x-2 disabled:opacity-50"
        >
          {submitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Confirming your appointment...</span>
            </>
          ) : (
            <>
              <ShieldCheck className="w-5 h-5" />
              <span>Confirm Appointment</span>
            </>
          )}
        </button>
      </div>

    </div>
  );
}
