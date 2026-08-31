import React from 'react';
import ServiceCard from '../components/ServiceCard';
import { Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Services() {
  const allServices = [
    {
      name: 'Comprehensive Eye Examination',
      description: 'A detailed evaluation of visual acuity, ocular muscle coordination, and general eye structure health.'
    },
    {
      name: 'Refraction',
      description: 'Standardized refractive optical testing to measure refractive errors including myopia, hyperopia, and astigmatism.'
    },
    {
      name: 'Prescription & Glasses',
      description: 'Custom spectacle prescription dispensing with recommendations for high-index, anti-reflective, bifocal, or progressive lenses.'
    },
    {
      name: 'Contact Lens Consultation',
      description: 'Evaluation of cornea suitability, contact lens fitting, trial guidance, and hygiene protocol instructions.'
    },
    {
      name: 'Cataract Screening',
      description: 'Focused inspection of crystalline lens clarity to detect early stage clouding or nuclear sclerosis.'
    },
    {
      name: 'Glaucoma Screening',
      description: 'Assessment of optic disc structural parameters and ocular screening to identify potential signs of optic neuropathy.'
    },
    {
      name: 'Intraocular Pressure Evaluation',
      description: 'Screening measurement of internal fluid pressure (IOP) within the eye to assist in glaucoma risk assessment.'
    }
  ];

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-3.5 py-1 rounded-full border border-teal-200">
          Services Catalog
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Eye Care & Optical Services
        </h1>
        <p className="text-slate-600 text-sm sm:text-base">
          All services listed below are available at Healthy Eye Clinic & Opticals during working hours (Tue – Sun: 11:00 AM – 4:00 PM).
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allServices.map((svc, idx) => (
          <ServiceCard key={idx} serviceName={svc.name} description={svc.description} />
        ))}
      </div>

      {/* Single Bottom CTA Banner */}
      <div className="bg-gradient-to-r from-teal-700 to-blue-900 rounded-3xl p-8 text-white text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-1">
          <h3 className="text-xl font-bold">Ready for your eye checkup?</h3>
          <p className="text-teal-100 text-xs sm:text-sm">
            Book an appointment online for convenient care.
          </p>
        </div>

        <Link
          to="/appointment"
          className="inline-flex items-center space-x-2 bg-white text-teal-900 font-extrabold text-sm px-6 py-3.5 rounded-xl shadow hover:bg-teal-50 transition flex-shrink-0"
        >
          <Calendar className="w-4 h-4 text-teal-700" />
          <span>Book Appointment</span>
        </Link>
      </div>

    </div>
  );
}
