import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import ServiceCard from '../components/ServiceCard';
import GallerySection from '../components/GallerySection';
import { 
  Clock, 
  MapPin, 
  Phone, 
  Calendar, 
  CheckCircle2,
  Navigation,
  PhoneCall
} from 'lucide-react';
import { CLINIC_INFO } from '../utils/appointmentSlots';

export default function Home() {

  useEffect(() => {
    const schemaData = {
      "@context": "https://schema.org",
      "@type": "Optician",
      "name": CLINIC_INFO.name,
      "description": "Comprehensive Eye Examinations, Refraction, Spectacles, Contact Lens fitting, Cataract & Glaucoma Screenings in Medavakkam, Chennai.",
      "telephone": "+918072097048",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "12A, Surya Nagar, 1st Cross Street, Medavakkam",
        "addressLocality": "Chennai",
        "addressRegion": "Tamil Nadu",
        "postalCode": "600100",
        "addressCountry": "IN"
      },
      "employee": {
        "@type": "Person",
        "name": "Nandhini K",
        "jobTitle": "Optometrist",
        "worksFor": CLINIC_INFO.name
      },
      "openingHoursSpecification": [
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
          "opens": "11:00",
          "closes": "16:00"
        }
      ]
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'hec-schema-jsonld';
    script.innerHTML = JSON.stringify(schemaData);
    document.head.appendChild(script);

    return () => {
      const existing = document.getElementById('hec-schema-jsonld');
      if (existing) document.head.removeChild(existing);
    };
  }, []);

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

  const mapsUrl = `https://maps.google.com/?q=${encodeURIComponent(`${CLINIC_INFO.name}, ${CLINIC_INFO.address}`)}`;

  return (
    <div className="space-y-16 pb-16">
      
      {/* Hero Section */}
      <Hero />

      {/* Services Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-extrabold uppercase tracking-wider text-teal-700 bg-teal-50 px-4 py-1.5 rounded-full border border-teal-200">
            Factual Clinical Services
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Our Primary Optical & Eye Care Services
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Providing essential eye examinations, refractive testing, custom eyewear dispensing, and preventive screening in Medavakkam.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {topServices.map((svc, i) => (
            <ServiceCard key={i} serviceName={svc.name} description={svc.desc} />
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            to="/services"
            className="inline-flex items-center space-x-2 text-sm font-extrabold text-teal-800 hover:text-teal-900 bg-teal-50 hover:bg-teal-100 border border-teal-200/80 px-8 py-3.5 rounded-2xl transition shadow-sm"
          >
            <span>View All 7 Factual Clinical Services</span>
            <span>→</span>
          </Link>
        </div>
      </section>

      {/* Clinic Gallery Showcase Section */}
      <GallerySection />

      {/* Patient Care Approach Section */}
      <section className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <div className="space-y-6">
              <span className="text-xs font-extrabold uppercase tracking-wider text-teal-400 bg-teal-950/80 border border-teal-700/60 px-3.5 py-1.5 rounded-full">
                Patient-Centric Care
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                Dedicated to Clearer Sight and Healthy Eyes
              </h2>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                At <strong>{CLINIC_INFO.name}</strong>, we are committed to providing structured vision testing, optical consultation, and preventive screening in a welcoming environment.
              </p>

              <ul className="space-y-3.5 pt-2 text-sm text-slate-300">
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

              <div className="pt-4 flex flex-wrap gap-3">
                <Link
                  to="/appointment"
                  className="inline-flex items-center space-x-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold px-6 py-3.5 rounded-2xl shadow-lg transition"
                >
                  <Calendar className="w-5 h-5" />
                  <span>Book Appointment Online</span>
                </Link>
                <a
                  href={`tel:${CLINIC_INFO.phone.replace(/\s/g, '')}`}
                  className="inline-flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-white font-extrabold px-6 py-3.5 rounded-2xl border border-slate-700 transition"
                >
                  <PhoneCall className="w-5 h-5 text-teal-400" />
                  <span>Call {CLINIC_INFO.phone}</span>
                </a>
              </div>
            </div>

            {/* Hours & Schedule Card */}
            <div className="bg-slate-800/90 border border-slate-700/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
              <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
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

              <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-700 space-y-2 text-xs text-slate-300">
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

      {/* Location Banner with Get Directions & Call Now */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
          <div className="space-y-3 text-center md:text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-400 bg-slate-800 px-3.5 py-1 rounded-full border border-slate-700">
              Visit Clinic
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              Visit Healthy Eye Clinic & Opticals
            </h3>
            <p className="text-slate-300 text-sm flex items-center justify-center md:justify-start gap-1.5">
              <MapPin className="w-4 h-4 text-teal-400 flex-shrink-0" />
              <span>{CLINIC_INFO.address}</span>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center space-x-2 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 font-bold px-6 py-3.5 rounded-2xl transition text-sm shadow-md"
            >
              <Navigation className="w-4 h-4 text-teal-400" />
              <span>Get Directions</span>
            </a>

            <a
              href={`tel:${CLINIC_INFO.phone.replace(/\s/g, '')}`}
              className="inline-flex items-center justify-center space-x-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold px-6 py-3.5 rounded-2xl transition text-sm shadow-md"
            >
              <PhoneCall className="w-4 h-4 text-slate-950" />
              <span>Call Now</span>
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
