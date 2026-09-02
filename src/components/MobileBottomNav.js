import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Calendar, Navigation } from 'lucide-react';
import { CLINIC_INFO } from '../utils/appointmentSlots';

export default function MobileBottomNav() {
  const mapsUrl = `https://maps.google.com/?q=${encodeURIComponent(`${CLINIC_INFO.name}, ${CLINIC_INFO.address}`)}`;
  const phoneCallUrl = `tel:${CLINIC_INFO.phone.replace(/\s/g, '')}`;

  return (
    <div className="md:hidden">
      {/* Fixed Sticky Mobile Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 shadow-2xl p-2.5">
        <div className="grid grid-cols-3 gap-2 max-w-md mx-auto">
          
          {/* Call Action */}
          <a
            href={phoneCallUrl}
            className="flex flex-col items-center justify-center py-2 px-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl border border-slate-700 transition active:scale-95"
          >
            <Phone className="w-5 h-5 text-teal-400 mb-0.5" />
            <span className="text-[11px] font-bold tracking-tight">Call</span>
          </a>

          {/* Book Action (Highlighted Primary) */}
          <Link
            to="/appointment"
            className="flex flex-col items-center justify-center py-2 px-2 bg-teal-500 hover:bg-teal-400 text-slate-950 rounded-xl font-extrabold shadow-md transition active:scale-95"
          >
            <Calendar className="w-5 h-5 text-slate-950 mb-0.5" />
            <span className="text-[11px] font-extrabold tracking-tight">Book</span>
          </Link>

          {/* Directions Action */}
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center py-2 px-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl border border-slate-700 transition active:scale-95"
          >
            <Navigation className="w-5 h-5 text-teal-400 mb-0.5" />
            <span className="text-[11px] font-bold tracking-tight">Directions</span>
          </a>

        </div>
      </div>
    </div>
  );
}
