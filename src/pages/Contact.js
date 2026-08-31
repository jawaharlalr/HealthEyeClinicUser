import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Clock, Calendar, Navigation, ExternalLink } from 'lucide-react';
import { CLINIC_INFO } from '../utils/appointmentSlots';

export default function Contact() {
  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-3.5 py-1 rounded-full border border-teal-200">
          Contact & Location Guide
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Visit Us at Medavakkam, Chennai
        </h1>
        <p className="text-slate-600 text-sm sm:text-base">
          Get in touch with Healthy Eye Clinic & Opticals for appointments, optical inquiries, or location directions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Information Cards */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Address Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-card space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Clinic Address</h3>
            <p className="text-sm text-slate-700 leading-relaxed">
              <strong>{CLINIC_INFO.name}</strong><br />
              12A, Surya Nagar, 1st Cross Street,<br />
              Medavakkam, Chennai – 600100
            </p>
            <a
              href="https://maps.google.com/?q=12A+Surya+Nagar+1st+Cross+Street+Medavakkam+Chennai+600100"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1.5 text-xs font-bold text-teal-700 hover:text-teal-800 pt-1"
            >
              <span>Open in Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Phone & Booking */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-card space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <Phone className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Appointment Phone</h3>
            <p className="text-sm text-slate-600">
              For direct appointment booking and inquiries:
            </p>
            <a
              href={`tel:${CLINIC_INFO.phone.replace(/\s/g, '')}`}
              className="text-xl font-extrabold text-teal-700 hover:text-teal-800 block"
            >
              {CLINIC_INFO.phone}
            </a>
          </div>

          {/* Working Hours */}
          <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center space-x-2 text-teal-400">
              <Clock className="w-5 h-5" />
              <h3 className="text-base font-bold text-white">Clinic Working Schedule</h3>
            </div>

            <div className="space-y-2 text-xs sm:text-sm">
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-300">Tuesday – Sunday</span>
                <span className="text-teal-400 font-bold">11:00 AM – 4:00 PM</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-300">Monday</span>
                <span className="text-pink-400 font-bold uppercase">CLOSED</span>
              </div>
            </div>

            <Link
              to="/appointment"
              className="w-full inline-flex items-center justify-center space-x-2 bg-teal-500 hover:bg-teal-600 text-slate-950 font-bold py-3 rounded-xl transition text-xs shadow-md"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Appointment Online</span>
            </Link>
          </div>

        </div>

        {/* Right Map View */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-card h-full min-h-[400px] flex flex-col">
            <div className="p-3 border-b border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Navigation className="w-4 h-4 text-teal-600" />
                <span>Location Preview (Medavakkam, Chennai)</span>
              </span>
              <span className="text-[11px] bg-teal-50 text-teal-800 px-2 py-0.5 rounded font-semibold">
                Chennai – 600100
              </span>
            </div>

            <div className="flex-1 rounded-2xl overflow-hidden mt-3 relative min-h-[350px]">
              <iframe
                title="Healthy Eye Clinic Location Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.665279589311!2d80.18708331482156!3d12.929218990883654!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a525c1157b1ef01%3A0x6b87201b13854125!2sSurya%20Nagar%2C%20Medavakkam%2C%20Chennai%2C%20Tamil%20Nadu%20600100!5e0!3m2!1sen!2sin!4v1680000000000!5m2!1sen!2sin"
                className="w-full h-full border-0 absolute inset-0 min-h-[350px]"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
