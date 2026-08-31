import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Eye, ShieldCheck, Clock, Phone, Sparkles } from 'lucide-react';
import { CLINIC_INFO, getDynamicClinicStatus } from '../utils/appointmentSlots';

export default function Hero() {
  const clinicStatus = getDynamicClinicStatus();

  return (
    <section className="relative bg-gradient-to-b from-teal-50/60 via-slate-50 to-white overflow-hidden py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Main Hero Copy Column */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            <div className="inline-flex items-center space-x-2 bg-teal-50 border border-teal-200 px-3.5 py-1.5 rounded-full">
              <Sparkles className="w-4 h-4 text-teal-600" />
              <span className="text-xs font-bold text-teal-800 uppercase tracking-wider">
                {CLINIC_INFO.tagline}
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-none">
              Healthy Eye Clinic <span className="text-teal-600">& Opticals</span>
            </h1>

            <p className="text-slate-600 text-base sm:text-lg max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium">
              Professional eye examinations, refractive vision testing, spectacle dispensing, and preventive cataract & glaucoma screening in <strong>Medavakkam, Chennai</strong>.
            </p>

            {/* Timings & Days Banner */}
            <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm inline-flex flex-col sm:flex-row items-center gap-4 text-xs sm:text-sm font-semibold text-slate-700">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-teal-600" />
                <span>Tue – Sun: <strong>11:00 AM – 4:00 PM</strong></span>
              </div>
              <span className="hidden sm:inline text-slate-300">|</span>
              <div className="flex items-center space-x-1.5 text-pink-600 font-bold">
                <span>Monday: Closed</span>
              </div>
            </div>

            {/* Main Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                to="/appointment"
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-base px-8 py-4 rounded-2xl shadow-lg shadow-teal-600/30 hover:shadow-teal-600/40 transition-all transform hover:-translate-y-0.5"
              >
                <Calendar className="w-5 h-5" />
                <span>Book Appointment</span>
              </Link>

              <Link
                to="/services"
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold text-base px-7 py-4 rounded-2xl shadow-sm transition"
              >
                <Eye className="w-5 h-5 text-teal-600" />
                <span>Explore Services</span>
              </Link>
            </div>

            {/* Feature Badges */}
            <div className="grid grid-cols-2 gap-3 max-w-lg mx-auto lg:mx-0 pt-4">
              <div className="flex items-center space-x-3 bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                <div className="p-2 rounded-lg bg-pink-50 text-pink-700">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="text-left text-xs">
                  <span className="font-bold text-slate-900 block">Online Booking</span>
                  <span className="text-slate-500">Instant Time Selection</span>
                </div>
              </div>

              <div className="flex items-center space-x-3 bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                <div className="p-2 rounded-lg bg-teal-50 text-teal-700">
                  <Clock className="w-5 h-5" />
                </div>
                <div className="text-left text-xs">
                  <span className="font-bold text-slate-900 block">Clinic Hours</span>
                  <span className="text-slate-500">11:00 AM – 4:00 PM</span>
                </div>
              </div>
            </div>

          </div>

          {/* Graphic / Branding Card (Matching Image 2 Exactly!) */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-teal-100 space-y-6">
              
              {/* Dynamic Live Status Badge in Card */}
              <div className="absolute top-4 right-4 bg-slate-50 border border-slate-200 text-xs px-3 py-1 rounded-full font-bold flex items-center gap-1.5 shadow-sm">
                <span className={`w-2 h-2 rounded-full ${clinicStatus.isOpen ? 'bg-emerald-500 animate-pulse' : 'bg-pink-500'}`} />
                <span className="text-slate-800">{clinicStatus.text}</span>
              </div>

              {/* Central Logo Ring */}
              <div className="flex justify-center pt-4 pb-2">
                <div className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-full bg-gradient-to-tr from-teal-50 via-white to-blue-50 border-4 border-teal-500/20 p-4 shadow-inner flex items-center justify-center">
                  <img 
                    src="/logo.png" 
                    alt="Healthy Eye Clinic Official Logo" 
                    className="w-full h-full object-contain filter drop-shadow-md hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>

              {/* Title & Subtitle & Appointment Line */}
              <div className="text-center space-y-2">
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                  Healthy Eye Clinic & Opticals
                </h2>
                <p className="text-xs text-teal-700 font-bold tracking-wider uppercase">
                  MEDAVAKKAM, CHENNAI
                </p>
                <div className="pt-3 flex items-center justify-center">
                  <a
                    href={`tel:${CLINIC_INFO.phone.replace(/\s/g, '')}`}
                    className="inline-flex items-center space-x-2 text-xs sm:text-sm font-bold text-slate-800 bg-slate-100/90 hover:bg-teal-50 hover:text-teal-900 border border-slate-200 px-4 py-2.5 rounded-xl transition shadow-sm"
                  >
                    <Phone className="w-4 h-4 text-teal-600" />
                    <span>Appointment Line: {CLINIC_INFO.phone}</span>
                  </a>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
