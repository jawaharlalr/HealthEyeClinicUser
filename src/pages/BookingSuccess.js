import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle2, Calendar, Clock, MapPin, Phone, Home, PlusCircle, ShieldCheck, AlertCircle, Info, Download, ExternalLink, MessageSquare } from 'lucide-react';
import { getAppointmentById } from '../firebase/appointmentService';
import { CLINIC_INFO, formatReadableDate, generateGoogleCalendarUrl, downloadIcsFile } from '../utils/appointmentSlots';

export default function BookingSuccess() {
  const [searchParams] = useSearchParams();
  const appointmentId = searchParams.get('id');
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (appointmentId) {
      getAppointmentById(appointmentId)
        .then(data => {
          setAppointment(data);
        })
        .catch(err => {
          console.warn("Notice:", err);
          setAppointment(null);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [appointmentId]);

  if (loading) {
    return (
      <div className="py-20 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-slate-600 text-sm font-medium">Please wait...</p>
      </div>
    );
  }

  if (!appointmentId || !appointment) {
    return (
      <div className="py-16 max-w-xl mx-auto px-4 text-center space-y-6">
        <div className="w-16 h-16 bg-pink-50 border-4 border-pink-100 text-pink-600 rounded-full flex items-center justify-center mx-auto">
          <AlertCircle className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-slate-900">Unable to locate appointment</h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            We couldn't find an active appointment for reference number: <code className="font-mono text-pink-700 bg-pink-50 px-2 py-0.5 rounded">{appointmentId || 'N/A'}</code>.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            to="/appointment"
            className="w-full sm:w-auto px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm rounded-xl shadow transition"
          >
            Book an Appointment
          </Link>
          <Link
            to="/"
            className="w-full sm:w-auto px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm rounded-xl transition"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Confirmation Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-teal-200 shadow-xl space-y-8">
        
        {/* Header Icon */}
        <div className="text-center space-y-3">
          <div className="w-20 h-20 bg-teal-50 border-4 border-teal-100 text-teal-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle2 className="w-12 h-12" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Appointment Request Received Successfully
          </h1>
          <p className="text-sm sm:text-base font-semibold text-slate-700 max-w-xl mx-auto leading-relaxed">
            Our clinic will contact you shortly to confirm your appointment.
          </p>
        </div>

        {/* Unique Appointment Number Banner */}
        <div className="bg-gradient-to-r from-teal-800 to-blue-900 text-white rounded-2xl p-5 text-center shadow-inner space-y-1">
          <span className="text-xs font-bold text-teal-300 uppercase tracking-widest block">
            Appointment Number
          </span>
          <span className="text-2xl sm:text-3xl font-mono font-extrabold tracking-wider block">
            {appointment.appointmentId}
          </span>
        </div>

        {/* Details Summary */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-6">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-3 flex items-center justify-between">
            <span>Appointment Details</span>
            <ShieldCheck className="w-4 h-4 text-teal-600" />
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1">
              <span className="text-xs font-semibold text-slate-400 uppercase block">Patient Name</span>
              <strong className="text-slate-900 text-base block">
                {appointment.patientName}
              </strong>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1">
              <span className="text-xs font-semibold text-slate-400 uppercase block">Mobile Number</span>
              <strong className="text-slate-900 text-base block">
                {appointment.mobile}
              </strong>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-teal-200 bg-teal-50/30 space-y-1">
              <span className="text-xs font-bold text-teal-700 uppercase block flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> Date
              </span>
              <strong className="text-slate-900 text-base block">
                {formatReadableDate(appointment.date)}
              </strong>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-blue-200 bg-blue-50/30 space-y-1">
              <span className="text-xs font-bold text-blue-700 uppercase block flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> Time
              </span>
              <strong className="text-slate-900 text-base block">
                {appointment.slot}
              </strong>
            </div>

          </div>

          {/* Attending Vision Specialist Badge */}
          <div className="bg-teal-50/90 border border-teal-200 rounded-xl p-4 flex items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-teal-700 text-white font-extrabold flex items-center justify-center text-sm shadow-sm flex-shrink-0">
                NK
              </div>
              <div>
                <span className="text-xs font-bold text-teal-700 uppercase tracking-wider block">
                  Attending Vision Specialist
                </span>
                <span className="text-base font-extrabold text-slate-900 block">
                  {CLINIC_INFO.optometristTitle}
                </span>
              </div>
            </div>
            <span className="text-xs font-semibold text-teal-800 bg-teal-100/80 px-3 py-1 rounded-full hidden sm:inline-block border border-teal-200">
              Lead Optometrist
            </span>
          </div>

          {/* Smart Calendar Actions */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block border-b border-slate-100 pb-2 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-teal-600" />
              <span>Save to Calendar</span>
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <a
                href={generateGoogleCalendarUrl(appointment)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center space-x-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-extrabold px-4 py-2.5 rounded-xl shadow-sm transition"
              >
                <ExternalLink className="w-4 h-4 text-teal-400" />
                <span>Add to Google Calendar</span>
              </a>

              <button
                type="button"
                onClick={() => downloadIcsFile(appointment)}
                className="w-full inline-flex items-center justify-center space-x-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-4 py-2.5 rounded-xl transition border border-slate-200"
              >
                <Download className="w-4 h-4 text-teal-600" />
                <span>Download .ics File</span>
              </button>
            </div>
          </div>

          {/* Clinic Address Box */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2 text-xs text-slate-600">
            <span className="font-bold text-slate-900 uppercase block border-b border-slate-100 pb-1">
              Clinic Location:
            </span>
            <p className="font-bold text-slate-900 text-sm">{CLINIC_INFO.name}</p>
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

        {/* 11. Before You Visit Section */}
        <div className="bg-blue-50/60 border border-blue-200 rounded-2xl p-6 space-y-3">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Info className="w-5 h-5 text-blue-700" />
            <span>Before You Visit</span>
          </h3>
          <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span>Please arrive a few minutes before your appointment time.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span>Bring your previous eye-test reports or prescriptions if available.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span>If you use spectacles or contact lenses, bring them with you when appropriate.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span>Keep your phone available in case the clinic needs to contact you.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span>If you cannot attend, please contact the clinic as early as possible.</span>
            </li>
          </ul>
        </div>

        {/* 10. Need to Change Your Appointment Section */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-center space-y-2">
          <h4 className="text-sm font-bold text-slate-900">
            Need to Change Your Appointment?
          </h4>
          <p className="text-xs sm:text-sm text-slate-600">
            If you need to reschedule or cancel your appointment, please contact the clinic at <strong>{CLINIC_INFO.phone}</strong>.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
            <a
              href={`tel:${CLINIC_INFO.phone.replace(/\s/g, '')}`}
              className="inline-flex items-center space-x-1.5 text-xs font-extrabold text-teal-800 bg-white border border-teal-200 px-4 py-2 rounded-xl shadow-sm hover:bg-teal-50 transition"
            >
              <Phone className="w-3.5 h-3.5 text-teal-600" />
              <span>Call Clinic: {CLINIC_INFO.phone}</span>
            </a>

            <a
              href={`https://wa.me/91${CLINIC_INFO.phone.replace(/\s/g, '')}?text=${encodeURIComponent(`Hello Healthy Eye Clinic, I have an appointment (${appointment.appointmentId}) on ${appointment.date} at ${appointment.slot}.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1.5 text-xs font-extrabold text-emerald-800 bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-xl shadow-sm hover:bg-emerald-100 transition"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
              <span>Message on WhatsApp</span>
            </a>
          </div>
          <p className="text-[11px] text-slate-500 italic">
            Please contact the clinic as early as possible.
          </p>
        </div>

        {/* Action Buttons (NO PRINT BUTTON) */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm px-5 py-3 rounded-xl transition"
          >
            <Home className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>

          <Link
            to="/appointment"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl shadow transition"
          >
            <PlusCircle className="w-4 h-4 text-white" />
            <span>Book Another Appointment</span>
          </Link>
        </div>

      </div>

    </div>
  );
}
