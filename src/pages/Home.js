import React from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import ServiceCard from '../components/ServiceCard';
import { 
  Clock, 
  MapPin, 
  Phone, 
  Calendar, 
  CheckCircle2
} from 'lucide-react';
import { CLINIC_INFO } from '../utils/appointmentSlots';

export default function Home() {

  const topServices = [
    {
      name: 'Comprehensive Eye Examination',
      desc: 'Complete ocular health assessment including visual acuity check, eye structure inspection, and vision evaluation.'
    },
    {
      name: 'Refraction',
      desc: 'Accurate refractive testing to detect myopia, hyperopia, astigmatism, or presbyopia for crystal clear vision.'
    },
    {
      name: 'Prescription & Glasses',
      desc: 'Expert prescription dispensing for single vision, bifocal, and progressive spectacle lenses with comfortable frames.'
    },
    {
      name: 'Contact Lens Consultation',
      desc: 'Professional fitting, lens type recommendation, hygiene guidance, and prescription for daily or monthly contact lenses.'
    },
    {
      name: 'Cataract Screening',
      desc: 'Early lens opacity detection and screening evaluation to guide timely management and vision preservation.'
    },
    {
      name: 'Glaucoma Screening',
      desc: 'Screening assessment of optic nerve and intraocular health to identify early risk factors of optic neuropathy.'
    }
  ];

  return (
    <div className="space-y-10 pb-12">
      
      {/* Hero Section */}
      <Hero />



      {/* Services Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-3.5 py-1 rounded-full border border-teal-200">
            Factual Eye Care Services
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Our Primary Optical & Clinical Services
          </h2>
          <p className="text-sm text-slate-600">
            Providing essential eye examinations, refractive care, and screening evaluations in Medavakkam.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topServices.map((svc, i) => (
            <ServiceCard key={i} serviceName={svc.name} description={svc.desc} />
          ))}
        </div>

        <div className="text-center mt-8">
          <Link
            to="/services"
            className="inline-flex items-center space-x-2 text-sm font-bold text-teal-700 hover:text-teal-800 bg-teal-50 hover:bg-teal-100 border border-teal-200 px-6 py-3 rounded-xl transition"
          >
            <span>View All 7 Clinical Services</span>
            <span>→</span>
          </Link>
        </div>
      </section>

      {/* Patient Care Approach */}
      <section className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <div className="space-y-6">
              <span className="text-xs font-extrabold uppercase tracking-wider text-teal-400 bg-teal-900/60 border border-teal-700/50 px-3 py-1 rounded-full">
                Patient-Centric Care
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                Dedicated to Clearer Sight and Healthy Eyes
              </h2>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                At <strong>{CLINIC_INFO.name}</strong>, we are committed to providing structured vision testing, optical consultation, and preventive screening in a welcoming environment.
              </p>

              <ul className="space-y-3 pt-2 text-sm text-slate-300">
                <li className="flex items-start space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-teal-400 flex-shrink-0 mt-0.5" />
                  <span>Structured Dedicated Appointment Times</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-teal-400 flex-shrink-0 mt-0.5" />
                  <span>Accurate Refraction & Custom Eyewear Dispensing</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-teal-400 flex-shrink-0 mt-0.5" />
                  <span>Targeted Screening for Cataracts & Glaucoma</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-teal-400 flex-shrink-0 mt-0.5" />
                  <span>Convenient Medavakkam, Chennai Location</span>
                </li>
              </ul>

              <div className="pt-4">
                <Link
                  to="/appointment"
                  className="inline-flex items-center space-x-2 bg-teal-500 hover:bg-teal-600 text-slate-950 font-bold px-6 py-3.5 rounded-xl shadow-lg transition"
                >
                  <Calendar className="w-5 h-5" />
                  <span>Book Appointment Online</span>
                </Link>
              </div>
            </div>

            {/* Hours & Schedule Card */}
            <div className="bg-slate-800/90 border border-slate-700/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-teal-400" />
                <span>Clinic Schedule & Timings</span>
              </h3>

              <div className="space-y-4 text-sm">
                <div className="flex justify-between items-center py-2.5 border-b border-slate-700">
                  <span className="text-slate-300 font-medium">Working Days</span>
                  <span className="text-teal-400 font-bold">Tuesday – Sunday</span>
                </div>
                <div className="flex justify-between items-center py-2.5 border-b border-slate-700">
                  <span className="text-slate-300 font-medium">Clinic Timings</span>
                  <span className="text-white font-bold">11:00 AM – 4:00 PM</span>
                </div>
                <div className="flex justify-between items-center py-2.5 border-b border-slate-700">
                  <span className="text-slate-300 font-medium">Monday</span>
                  <span className="text-pink-400 font-bold uppercase tracking-wider">CLOSED</span>
                </div>
              </div>

              <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-700 space-y-2 text-xs text-slate-300">
                <div className="flex items-center space-x-2 text-teal-400 font-bold">
                  <Phone className="w-4 h-4" />
                  <span>Appointment Line</span>
                </div>
                <a href={`tel:${CLINIC_INFO.phone.replace(/\s/g, '')}`} className="text-base font-extrabold text-white block hover:text-teal-400 transition">
                  {CLINIC_INFO.phone}
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Location Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-teal-50 border border-teal-200 rounded-3xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-2xl font-bold text-slate-900">
              Visit Healthy Eye Clinic & Opticals
            </h3>
            <p className="text-slate-600 text-sm flex items-center justify-center md:justify-start gap-1.5">
              <MapPin className="w-4 h-4 text-teal-700 flex-shrink-0" />
              <span>{CLINIC_INFO.address}</span>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <a
              href={`tel:${CLINIC_INFO.phone.replace(/\s/g, '')}`}
              className="inline-flex items-center justify-center space-x-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold px-5 py-3 rounded-xl transition text-sm"
            >
              <Phone className="w-4 h-4 text-teal-600" />
              <span>Call {CLINIC_INFO.phone}</span>
            </a>
            <Link
              to="/appointment"
              className="inline-flex items-center justify-center space-x-2 bg-teal-600 hover:bg-teal-700 text-white font-bold px-6 py-3 rounded-xl transition text-sm shadow-md"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Appointment</span>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
