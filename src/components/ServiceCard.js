import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Eye, 
  Glasses, 
  Sparkles, 
  ShieldCheck, 
  Activity, 
  Stethoscope,
  ChevronRight
} from 'lucide-react';

const iconMap = {
  'Comprehensive Eye Examination': Stethoscope,
  'Refraction': Glasses,
  'Prescription & Glasses': Glasses,
  'Contact Lens Consultation': Sparkles,
  'Cataract Screening': ShieldCheck,
  'Glaucoma Screening': Activity,
  'Intraocular Pressure Evaluation': Eye
};

export default function ServiceCard({ serviceName, description }) {
  const IconComponent = iconMap[serviceName] || Eye;

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-card hover:shadow-2xl hover:border-teal-500/40 transition-all duration-300 flex flex-col justify-between group">
      <div className="space-y-4">
        
        {/* Icon & Badge */}
        <div className="w-14 h-14 rounded-2xl bg-teal-50 border border-teal-100 text-teal-700 flex items-center justify-center group-hover:bg-teal-600 group-hover:text-white transition-colors duration-300 shadow-sm">
          <IconComponent className="w-7 h-7" />
        </div>

        {/* Service Title */}
        <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-teal-700 transition-colors tracking-tight">
          {serviceName}
        </h3>

        {/* Factual Description */}
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          {description}
        </p>
      </div>

      {/* Action Footer */}
      <div className="pt-6 mt-4 border-t border-slate-100 flex items-center justify-between">
        <Link
          to="/appointment"
          className="text-xs font-extrabold text-teal-700 group-hover:text-teal-800 flex items-center space-x-1"
        >
          <span>Book Appointment</span>
          <ChevronRight className="w-4 h-4 text-teal-600 group-hover:translate-x-1 transition-transform" />
        </Link>
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          Available
        </span>
      </div>
    </div>
  );
}
