import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, PhoneCall, Clock, MapPin, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';
import { CLINIC_INFO, getDynamicClinicStatus } from '../utils/appointmentSlots';

export default function Hero() {
  const clinicStatus = getDynamicClinicStatus();

  return (
    <section className="relative bg-gradient-to-b from-teal-50/60 via-slate-50 to-white text-slate-900 overflow-hidden py-14 lg:py-20 border-b border-slate-200/80">
      
      {/* Background Soft Glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-teal-200/30 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-96 h-96 bg-blue-200/30 rounded-full filter blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Main Conversion Copy */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Top Tagline Badge */}
            <div className="inline-flex items-center space-x-2 bg-teal-50 border border-teal-200 px-4 py-1.5 rounded-full shadow-sm">
              <Sparkles className="w-4 h-4 text-teal-600" />
              <span className="text-xs font-extrabold text-teal-800 uppercase tracking-widest">
                {CLINIC_INFO.name}
              </span>
            </div>

            {/* Primary Conversion Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-slate-900">
              Clear Vision. <br className="hidden sm:inline" />
              <span className="text-teal-700">
                Better Life.
              </span>
            </h1>

            {/* Concise Supporting Copy */}
            <p className="text-slate-600 text-base sm:text-lg max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium">
              Comprehensive eye examinations, accurate refraction, custom eyewear dispensing, and preventive cataract & glaucoma screening led by <strong>Optometrist Nandhini K</strong> in Medavakkam, Chennai.
            </p>

            {/* Timings & Days Card */}
            <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm inline-flex flex-col sm:flex-row items-center gap-3 text-xs sm:text-sm text-slate-700">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-teal-600 flex-shrink-0" />
                <span>Working Hours: <strong className="text-slate-900">Tue – Sun (11:00 AM – 4:00 PM)</strong></span>
              </div>
              <span className="hidden sm:inline text-slate-300">|</span>
              <div className="flex items-center space-x-1 text-pink-600 font-bold">
                <span>Mon: Closed</span>
              </div>
            </div>

            {/* Prominent Action Buttons: Book an Appointment & Call Now */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              
              <Link
                to="/appointment"
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2.5 bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-base px-8 py-4 rounded-2xl shadow-lg shadow-teal-600/20 hover:shadow-teal-600/30 transition-all transform hover:-translate-y-0.5"
              >
                <Calendar className="w-5 h-5 text-white" />
                <span>Book an Appointment</span>
              </Link>

              <a
                href={`tel:${CLINIC_INFO.phone.replace(/\s/g, '')}`}
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-extrabold text-base px-7 py-4 rounded-2xl shadow-sm transition-all hover:border-slate-400"
              >
                <PhoneCall className="w-5 h-5 text-teal-600" />
                <span>Call Now: {CLINIC_INFO.phone}</span>
              </a>

            </div>

            {/* Quick Trust Badges */}
            <div className="grid grid-cols-2 gap-3 max-w-lg mx-auto lg:mx-0 pt-4">
              <div className="flex items-center space-x-3 bg-white p-3 rounded-xl border border-slate-200/80 shadow-sm text-left">
                <ShieldCheck className="w-5 h-5 text-teal-600 flex-shrink-0" />
                <div className="text-xs">
                  <span className="font-bold text-slate-900 block">Instant Time Selection</span>
                  <span className="text-slate-500">No Service Selection Required</span>
                </div>
              </div>

              <div className="flex items-center space-x-3 bg-white p-3 rounded-xl border border-slate-200/80 shadow-sm text-left">
                <MapPin className="w-5 h-5 text-teal-600 flex-shrink-0" />
                <div className="text-xs">
                  <span className="font-bold text-slate-900 block">Medavakkam Location</span>
                  <span className="text-slate-500">12A Surya Nagar 1st Cross</span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Clinic Branding & Status Card */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-teal-100 shadow-card space-y-6 relative">
              
              {/* Dynamic Live Status Badge */}
              <div className="absolute top-4 right-4 bg-slate-50 border border-slate-200 text-xs px-3.5 py-1 rounded-full font-bold flex items-center gap-2 shadow-sm">
                <span className={`w-2.5 h-2.5 rounded-full ${clinicStatus.isOpen ? 'bg-emerald-500 animate-pulse' : 'bg-pink-500'}`} />
                <span className="text-slate-800">{clinicStatus.text}</span>
              </div>

              {/* Logo Display */}
              <div className="flex justify-center pt-4 pb-2">
                <div className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-full bg-gradient-to-tr from-teal-50 via-white to-blue-50 border-4 border-teal-500/20 p-4 shadow-inner flex items-center justify-center">
                  <img 
                    src="/logo.png" 
                    alt="Healthy Eye Clinic Official Logo" 
                    className="w-full h-full object-contain filter drop-shadow-md hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>

              {/* Clinic & Specialist Overview */}
              <div className="text-center space-y-2">
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                  Healthy Eye Clinic & Opticals
                </h2>
                <p className="text-xs text-teal-700 font-extrabold tracking-widest uppercase">
                  MEDAVAKKAM, CHENNAI – 600100
                </p>
                <div className="pt-2 text-xs text-slate-600 space-y-1">
                  <p className="font-semibold flex items-center justify-center gap-1.5 text-slate-800">
                    <CheckCircle2 className="w-4 h-4 text-teal-600" />
                    <span>Attending Specialist: <strong>{CLINIC_INFO.optometristTitle}</strong></span>
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
