import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, PhoneCall, Clock, MapPin, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';
import { CLINIC_INFO, getDynamicClinicStatus } from '../utils/appointmentSlots';

export default function Hero() {
  const clinicStatus = getDynamicClinicStatus();

  return (
    <section className="relative bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white overflow-hidden py-14 lg:py-20 border-b border-slate-800">
      
      {/* Background Subtle Medical Glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-96 h-96 bg-blue-600/10 rounded-full filter blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Main Conversion Copy */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Top Tagline Badge */}
            <div className="inline-flex items-center space-x-2 bg-teal-950/80 border border-teal-500/40 px-4 py-1.5 rounded-full shadow-sm">
              <Sparkles className="w-4 h-4 text-teal-400" />
              <span className="text-xs font-extrabold text-teal-300 uppercase tracking-widest">
                {CLINIC_INFO.name}
              </span>
            </div>

            {/* Primary Conversion Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-white">
              Clear Vision. <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-teal-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent">
                Better Life.
              </span>
            </h1>

            {/* Concise Supporting Copy */}
            <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Comprehensive eye examinations, accurate refraction, custom eyewear dispensing, and preventive cataract & glaucoma screening led by <strong>Optometrist Nandhini K</strong> in Medavakkam, Chennai.
            </p>

            {/* Timings & Days Card */}
            <div className="bg-slate-800/80 border border-slate-700/80 p-4 rounded-2xl shadow-md inline-flex flex-col sm:flex-row items-center gap-3 text-xs sm:text-sm text-slate-200">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-teal-400 flex-shrink-0" />
                <span>Working Hours: <strong className="text-white">Tue – Sun (11:00 AM – 4:00 PM)</strong></span>
              </div>
              <span className="hidden sm:inline text-slate-600">|</span>
              <div className="flex items-center space-x-1 text-pink-400 font-bold">
                <span>Mon: Closed</span>
              </div>
            </div>

            {/* Prominent Action Buttons: Book an Appointment & Call Now */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              
              <Link
                to="/appointment"
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold text-base px-8 py-4 rounded-2xl shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 transition-all transform hover:-translate-y-0.5"
              >
                <Calendar className="w-5 h-5 text-slate-950" />
                <span>Book an Appointment</span>
              </Link>

              <a
                href={`tel:${CLINIC_INFO.phone.replace(/\s/g, '')}`}
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2.5 bg-slate-800 hover:bg-slate-700 text-white border border-slate-600 font-extrabold text-base px-7 py-4 rounded-2xl shadow-md transition-all hover:border-slate-500"
              >
                <PhoneCall className="w-5 h-5 text-teal-400" />
                <span>Call Now: {CLINIC_INFO.phone}</span>
              </a>

            </div>

            {/* Quick Trust Badges */}
            <div className="grid grid-cols-2 gap-3 max-w-lg mx-auto lg:mx-0 pt-4">
              <div className="flex items-center space-x-3 bg-slate-800/60 p-3 rounded-xl border border-slate-700/60 text-left">
                <ShieldCheck className="w-5 h-5 text-teal-400 flex-shrink-0" />
                <div className="text-xs">
                  <span className="font-bold text-white block">Instant Time Selection</span>
                  <span className="text-slate-400">No Service Selection Required</span>
                </div>
              </div>

              <div className="flex items-center space-x-3 bg-slate-800/60 p-3 rounded-xl border border-slate-700/60 text-left">
                <MapPin className="w-5 h-5 text-teal-400 flex-shrink-0" />
                <div className="text-xs">
                  <span className="font-bold text-white block">Medavakkam Location</span>
                  <span className="text-slate-400">12A Surya Nagar 1st Cross</span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Clinic Branding & Status Card */}
          <div className="lg:col-span-5">
            <div className="bg-slate-800/90 rounded-3xl p-6 sm:p-8 border border-slate-700 shadow-2xl space-y-6 relative">
              
              {/* Dynamic Live Status Badge */}
              <div className="absolute top-4 right-4 bg-slate-900 border border-slate-700 text-xs px-3.5 py-1 rounded-full font-bold flex items-center gap-2 shadow">
                <span className={`w-2.5 h-2.5 rounded-full ${clinicStatus.isOpen ? 'bg-emerald-400 animate-pulse' : 'bg-pink-500'}`} />
                <span className="text-slate-200">{clinicStatus.text}</span>
              </div>

              {/* Logo Display */}
              <div className="flex justify-center pt-4 pb-2">
                <div className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-full bg-gradient-to-tr from-slate-900 via-slate-800 to-teal-950 border-4 border-teal-500/30 p-4 shadow-2xl flex items-center justify-center">
                  <img 
                    src="/logo.png" 
                    alt="Healthy Eye Clinic Official Logo" 
                    className="w-full h-full object-contain filter drop-shadow-lg hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>

              {/* Clinic & Specialist Overview */}
              <div className="text-center space-y-2">
                <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                  Healthy Eye Clinic & Opticals
                </h2>
                <p className="text-xs text-teal-400 font-extrabold tracking-widest uppercase">
                  MEDAVAKKAM, CHENNAI – 600100
                </p>
                <div className="pt-2 text-xs text-slate-300 space-y-1">
                  <p className="font-semibold flex items-center justify-center gap-1.5 text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-teal-400" />
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
