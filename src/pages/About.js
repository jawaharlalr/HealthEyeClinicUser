import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, MapPin, Phone, Calendar, CheckCircle2, PhoneCall } from 'lucide-react';
import { CLINIC_INFO } from '../utils/appointmentSlots';

export default function About() {
  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 bg-slate-50 text-slate-900">
      
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-4 py-1.5 rounded-full border border-teal-200">
          About Our Clinic
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          {CLINIC_INFO.name}
        </h1>
        <p className="text-teal-700 font-semibold text-base italic">
          "{CLINIC_INFO.tagline}"
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        
        {/* Left Branding Card */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-card text-center space-y-6">
            <div className="w-40 h-40 mx-auto rounded-full bg-teal-50 border-4 border-teal-100 p-4 flex items-center justify-center shadow-inner">
              <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
            </div>
            
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">{CLINIC_INFO.name}</h2>
              <p className="text-xs text-teal-700 font-bold uppercase tracking-wider mt-0.5">
                Medavakkam, Chennai
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-3 text-xs text-slate-600">
              <div className="flex items-center justify-center space-x-2">
                <Clock className="w-4 h-4 text-teal-600" />
                <span>Tue – Sun: 11:00 AM – 4:00 PM</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <MapPin className="w-4 h-4 text-teal-600" />
                <span>12A, Surya Nagar, 1st Cross St</span>
              </div>
              <div className="flex items-center justify-center space-x-2 font-extrabold text-slate-900 text-sm">
                <Phone className="w-4 h-4 text-teal-600" />
                <span>{CLINIC_INFO.phone}</span>
              </div>
            </div>

            {/* Lead Optometrist Card (Light Theme) */}
            <div className="bg-gradient-to-br from-teal-50/80 to-blue-50/60 rounded-2xl p-5 border border-teal-200 text-left space-y-2.5 shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-teal-600 text-white font-extrabold flex items-center justify-center text-sm shadow-sm">
                  NK
                </div>
                <div>
                  <span className="text-[10px] font-bold text-teal-800 uppercase tracking-wider block">
                    Lead Vision Specialist
                  </span>
                  <h3 className="text-base font-extrabold text-slate-900">
                    Optometrist Nandhini K
                  </h3>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed pt-2 border-t border-teal-100">
                Dedicated primary vision care practitioner managing comprehensive refraction, spectacle prescription, contact lens fitting, and ocular disease screening.
              </p>
            </div>
          </div>
        </div>

        {/* Right Information Narrative */}
        <div className="lg:col-span-7 space-y-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-snug">
            Professional Eye Examination & Optical Consultations
          </h2>

          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            <strong>Healthy Eye Clinic & Opticals</strong> is dedicated to delivering clear vision solutions and comprehensive eye care services to the residents of Medavakkam and surrounding areas in Chennai.
          </p>

          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            We focus on accurate visual testing, prescribing high-quality spectacle lenses, conducting contact lens consultations, and performing preventive screenings for common ocular conditions such as cataracts, glaucoma, and elevated intraocular pressure.
          </p>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
              Core Clinical Commitments:
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-slate-700 font-medium">
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0" />
                <span>Comprehensive Eye Examinations</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0" />
                <span>Precise Refraction & Prescription</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0" />
                <span>Cataract & Glaucoma Screenings</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0" />
                <span>Intraocular Pressure Evaluation</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0" />
                <span>Contact Lens Guidance</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0" />
                <span>Structured Booking Times</span>
              </li>
            </ul>
          </div>

          <div className="pt-2 flex flex-wrap gap-3">
            <Link
              to="/appointment"
              className="inline-flex items-center space-x-2 bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-sm px-6 py-3.5 rounded-xl shadow-md transition"
            >
              <Calendar className="w-4 h-4 text-white" />
              <span>Book Appointment Online</span>
            </Link>

            <a
              href={`tel:${CLINIC_INFO.phone.replace(/\s/g, '')}`}
              className="inline-flex items-center space-x-2 bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm px-5 py-3.5 rounded-xl border border-slate-300 transition"
            >
              <PhoneCall className="w-4 h-4 text-teal-600" />
              <span>Call Clinic</span>
            </a>
          </div>

        </div>

      </div>

    </div>
  );
}
