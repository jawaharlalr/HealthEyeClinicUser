import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, MapPin, Clock, Eye, ChevronRight } from 'lucide-react';
import { CLINIC_INFO } from '../utils/appointmentSlots';

export default function Footer() {
  const servicesList = [
    'Comprehensive Eye Examination',
    'Refraction',
    'Prescription & Glasses',
    'Contact Lens Consultation',
    'Cataract Screening',
    'Glaucoma Screening',
    'Intraocular Pressure Evaluation'
  ];

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 p-1 flex items-center justify-center">
                <img src="/logo.png" alt="Logo" className="w-8 h-8 object-contain" />
              </div>
              <div>
                <span className="text-lg font-bold text-white tracking-tight block leading-tight">
                  HEALTHY EYE CLINIC
                </span>
                <span className="text-xs font-semibold text-teal-400 tracking-wider uppercase block">
                  & OPTICALS
                </span>
              </div>
            </div>
            <p className="text-teal-400 italic text-sm font-medium">
              "{CLINIC_INFO.tagline}"
            </p>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              Dedicated to delivering thorough vision assessments, optical consultations, and comprehensive screening services in Medavakkam.
            </p>
          </div>

          {/* Quick Navigation */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4 border-l-2 border-teal-500 pl-2">
              Quick Links
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-teal-400 transition flex items-center space-x-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-teal-500" />
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-teal-400 transition flex items-center space-x-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-teal-500" />
                  <span>About the Clinic</span>
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-teal-400 transition flex items-center space-x-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-teal-500" />
                  <span>Eye Care Services</span>
                </Link>
              </li>
              <li>
                <Link to="/appointment" className="hover:text-teal-400 transition flex items-center space-x-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-teal-500" />
                  <span>Book Online Appointment</span>
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-teal-400 transition flex items-center space-x-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-teal-500" />
                  <span>Contact & Location</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Services List */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4 border-l-2 border-teal-500 pl-2">
              Our Services
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-400">
              {servicesList.map((service, idx) => (
                <li key={idx} className="flex items-center space-x-1.5">
                  <Eye className="w-3.5 h-3.5 text-teal-500 flex-shrink-0" />
                  <span>{service}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Hours */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4 border-l-2 border-teal-500 pl-2">
              Visit & Contact
            </h3>
            
            <div className="flex items-start space-x-3 text-sm text-slate-300">
              <MapPin className="w-5 h-5 text-teal-400 flex-shrink-0 mt-0.5" />
              <span>{CLINIC_INFO.address}</span>
            </div>

            <div className="flex items-center space-x-3 text-sm text-slate-300">
              <Phone className="w-4 h-4 text-teal-400 flex-shrink-0" />
              <a href={`tel:${CLINIC_INFO.phone.replace(/\s/g, '')}`} className="hover:text-teal-400 font-semibold transition">
                {CLINIC_INFO.phone}
              </a>
            </div>

            <div className="pt-2 border-t border-slate-800 space-y-1">
              <div className="flex items-center space-x-2 text-xs text-slate-300">
                <Clock className="w-4 h-4 text-teal-400" />
                <span className="font-semibold text-white">Working Hours:</span>
              </div>
              <p className="text-xs text-slate-400 pl-6">
                Tuesday – Sunday: <strong className="text-slate-200">11:00 AM – 4:00 PM</strong>
              </p>
              <p className="text-xs text-pink-400 pl-6 font-semibold">
                Monday: CLOSED
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Healthy Eye Clinic & Opticals. All rights reserved.</p>
          <div className="flex items-center space-x-4">
            <Link to="/appointment" className="hover:text-teal-400 transition">Online Slot Booking</Link>
            <span>•</span>
            <Link to="/contact" className="hover:text-teal-400 transition">Medavakkam, Chennai</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
