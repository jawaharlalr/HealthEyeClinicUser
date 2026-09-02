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
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white shadow-md">
      
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
              <span className="text-base sm:text-lg font-extrabold text-white tracking-tight block leading-tight">
                HEALTHY EYE CLINIC
              </span>
              <span className="text-[10px] sm:text-[11px] font-extrabold tracking-widest text-teal-400 uppercase block">
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
                    ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                {link.name}
              </Link>
            ))}
            
            <a
              href="/#gallery"
              className="px-3.5 py-2 rounded-xl text-sm font-bold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Gallery
            </a>
          </nav>

          {/* Desktop Single CTA Button */}
          <div className="hidden md:flex items-center space-x-4">
            <a
              href={`tel:${CLINIC_INFO.phone.replace(/\s/g, '')}`}
              className="text-xs font-extrabold text-slate-300 hover:text-teal-400 flex items-center space-x-1.5 transition"
            >
              <Phone className="w-4 h-4 text-teal-400" />
              <span>{CLINIC_INFO.phone}</span>
            </a>

            <Link
              to="/appointment"
              className="inline-flex items-center space-x-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold text-sm px-5 py-2.5 rounded-xl shadow-md transition-all transform hover:-translate-y-0.5"
            >
              <Calendar className="w-4 h-4 text-slate-950" />
              <span>Book Appointment</span>
            </Link>
          </div>

          {/* Mobile Drawer Hamburger Button */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-6 space-y-3 animate-fadeIn">
          <nav className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                  isActive(link.path)
                    ? 'bg-teal-500/20 text-teal-300'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <a
              href="/#gallery"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2.5 rounded-xl text-sm font-bold text-slate-300 hover:bg-slate-800 transition-colors"
            >
              Gallery
            </a>
          </nav>

          <div className="pt-2 border-t border-slate-800 flex flex-col space-y-2">
            <Link
              to="/appointment"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full inline-flex items-center justify-center space-x-2 bg-teal-500 text-slate-950 font-extrabold text-sm py-3 rounded-xl shadow-md"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Appointment Online</span>
            </Link>
          </div>
        </div>
      )}

    </header>
  );
}
