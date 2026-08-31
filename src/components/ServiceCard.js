import React from 'react';
import { 
  Eye, 
  Glasses, 
  Sparkles, 
  ShieldCheck, 
  Activity, 
  Stethoscope
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
    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between group">
      <div>
        {/* Icon & Badge */}
        <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-100 text-teal-700 flex items-center justify-center mb-4 group-hover:bg-teal-600 group-hover:text-white transition-colors duration-300">
          <IconComponent className="w-6 h-6" />
        </div>

        {/* Service Title */}
        <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-teal-700 transition-colors">
          {serviceName}
        </h3>

        {/* Factual Description */}
        <p className="text-sm text-slate-600 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}
