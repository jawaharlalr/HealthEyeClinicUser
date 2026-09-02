import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Phone, Calendar, Menu, X } from 'lucide-react';
import { CLINIC_INFO } from '../utils/appointmentSlots';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Contact', path: '/contact' }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm text-slate-900">
      
      {/* MAIN NAVBAR (Desktop & Mobile Header) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Official Clinic Logo & Branding */}
          <Link to="/" className="flex items-center space-x-3 group">
            <img 
              src="/logo.png" 
              alt="Healthy Eye Clinic & Opticals Logo" 
              className="h-10 sm:h-12 w-auto object-contain transition-transform group-hover:scale-105"
            />
            <div>
              <span className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight block leading-tight">
                HEALTHY EYE CLINIC
              </span>
              <span className="text-[10px] sm:text-[11px] font-bold tracking-widest text-teal-700 uppercase block">
                & OPTICALS
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3.5 py-2 rounded-xl text-sm font-bold transition-colors ${
                  isActive(link.path)
                    ? 'bg-teal-50 text-teal-800 border border-teal-200/80'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {link.name}
              </Link>
            ))}
            
            <a
              href="/#gallery"
              className="px-3.5 py-2 rounded-xl text-sm font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors"
            >
              Gallery
            </a>
          </nav>

          {/* Desktop Single CTA Button */}
          <div className="hidden md:flex items-center space-x-4">
            <a
              href={`tel:${CLINIC_INFO.phone.replace(/\s/g, '')}`}
              className="text-xs font-bold text-slate-700 hover:text-teal-700 flex items-center space-x-1.5 transition"
            >
              <Phone className="w-4 h-4 text-teal-600" />
              <span>{CLINIC_INFO.phone}</span>
            </a>

            <Link
              to="/appointment"
              className="inline-flex items-center space-x-2 bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-sm px-5 py-2.5 rounded-xl shadow-sm hover:shadow transition-all transform hover:-translate-y-0.5"
            >
              <Calendar className="w-4 h-4 text-white" />
              <span>Book Appointment</span>
            </Link>
          </div>

          {/* Mobile Drawer Hamburger Button */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu (Pure Light Theme) */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-3 animate-fadeIn">
          <nav className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                  isActive(link.path)
                    ? 'bg-teal-50 text-teal-800 font-extrabold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <a
              href="/#gallery"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2.5 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Gallery
            </a>
          </nav>

          <div className="pt-2 border-t border-slate-100 flex flex-col space-y-2">
            <Link
              to="/appointment"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full inline-flex items-center justify-center space-x-2 bg-teal-600 text-white font-extrabold text-sm py-3 rounded-xl shadow-sm"
            >
              <Calendar className="w-4 h-4 text-white" />
              <span>Book Appointment Online</span>
            </Link>
          </div>
        </div>
      )}

    </header>
  );
}
