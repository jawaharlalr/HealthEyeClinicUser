import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Calendar, Navigation } from 'lucide-react';
import { CLINIC_INFO } from '../utils/appointmentSlots';

export default function MobileBottomNav() {
  const mapsUrl = `https://maps.google.com/?q=${encodeURIComponent(`${CLINIC_INFO.name}, ${CLINIC_INFO.address}`)}`;
  const phoneCallUrl = `tel:${CLINIC_INFO.phone.replace(/\s/g, '')}`;

  return (
    <div className="md:hidden">
      {/* Light Theme Fixed Sticky Mobile Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-2xl p-2.5">
        <div className="grid grid-cols-3 gap-2 max-w-md mx-auto">
          
          {/* Call Action */}
          <a
            href={phoneCallUrl}
            className="flex flex-col items-center justify-center py-2 px-2 bg-slate-50 hover:bg-slate-100 text-slate-800 rounded-xl border border-slate-200 transition active:scale-95 shadow-sm"
          >
            <Phone className="w-5 h-5 text-teal-600 mb-0.5" />
            <span className="text-[11px] font-bold tracking-tight text-slate-800">Call</span>
          </a>

          {/* Book Action (Highlighted Primary) */}
          <Link
            to="/appointment"
            className="flex flex-col items-center justify-center py-2 px-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-extrabold shadow-md transition active:scale-95"
          >
            <Calendar className="w-5 h-5 text-white mb-0.5" />
            <span className="text-[11px] font-extrabold tracking-tight">Book</span>
          </Link>

          {/* Directions Action */}
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center py-2 px-2 bg-slate-50 hover:bg-slate-100 text-slate-800 rounded-xl border border-slate-200 transition active:scale-95 shadow-sm"
          >
            <Navigation className="w-5 h-5 text-teal-600 mb-0.5" />
            <span className="text-[11px] font-bold tracking-tight text-slate-800">Directions</span>
          </a>

        </div>
      </div>
    </div>
  );
}
