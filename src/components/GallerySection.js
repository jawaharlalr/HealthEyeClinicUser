import React, { useState } from 'react';
import { Eye, ShieldCheck, Glasses, Sparkles, Stethoscope, Maximize2, X } from 'lucide-react';

export default function GallerySection() {
  const [activeImage, setActiveImage] = useState(null);

  const galleryItems = [
    {
      id: 'reception',
      title: 'Reception & Patient Lounge',
      category: 'Clinic Exterior & Entrance',
      desc: 'Clean, welcoming patient reception and consultation waiting area in Medavakkam.',
      icon: Sparkles,
      gradient: 'from-teal-500 via-teal-600 to-blue-700',
      badge: 'Patient Lounge'
    },
    {
      id: 'examination',
      title: 'Eye Examination Suite',
      category: 'Clinical Suite',
      desc: 'Dedicated room equipped for comprehensive visual acuity testing and ocular inspection.',
      icon: Stethoscope,
      gradient: 'from-blue-600 via-teal-600 to-cyan-700',
      badge: 'Examination'
    },
    {
      id: 'optical',
      title: 'Optical Frame Showcase',
      category: 'Eyewear & Lenses',
      desc: 'Curated display of prescription optical frames, single-vision, bifocal, and progressive lenses.',
      icon: Glasses,
      gradient: 'from-cyan-600 via-blue-600 to-teal-700',
      badge: 'Optical Display'
    },
    {
      id: 'refraction',
      title: 'Advanced Refraction Unit',
      category: 'Vision Testing',
      desc: 'Precision refractive testing setup to accurately evaluate myopia, hyperopia, and astigmatism.',
      icon: Eye,
      gradient: 'from-teal-600 via-blue-700 to-teal-800',
      badge: 'Refraction'
    },
    {
      id: 'screening',
      title: 'Screening Station',
      category: 'Cataract & Glaucoma',
      desc: 'Focused screening instruments for crystalline lens clarity and intraocular pressure evaluation.',
      icon: ShieldCheck,
      gradient: 'from-blue-700 via-teal-600 to-cyan-800',
      badge: 'Screening'
    }
  ];

  return (
    <section id="gallery" className="py-16 bg-slate-50 text-slate-900 relative overflow-hidden border-y border-slate-200/80">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-extrabold uppercase tracking-widest text-teal-800 bg-teal-50 px-4 py-1.5 rounded-full border border-teal-200 shadow-sm">
            Clean • Professional • Patient-Focused
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Clinic & Optical Gallery
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Take a look inside Healthy Eye Clinic & Opticals — equipped for comprehensive eye checkups, precise optical dispensing, and preventive vision screening.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryItems.map((item) => {
            const IconComp = item.icon;
            return (
              <div
                key={item.id}
                onClick={() => setActiveImage(item)}
                className="group relative bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-card hover:shadow-2xl hover:border-teal-400 transition-all duration-300 cursor-pointer flex flex-col justify-between"
              >
                {/* Visual Placeholder / Image Canvas */}
                <div className={`h-52 w-full bg-gradient-to-br ${item.gradient} p-6 relative flex flex-col justify-between overflow-hidden`}>
                  
                  {/* Subtle Grid overlay */}
                  <div className="absolute inset-0 opacity-15 bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:24px_24px]" />

                  {/* Top Badge & Zoom */}
                  <div className="relative z-10 flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-900 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full shadow-sm">
                      {item.badge}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow">
                      <Maximize2 className="w-4 h-4 text-white" />
                    </div>
                  </div>

                  {/* Center Icon & Branding */}
                  <div className="relative z-10 my-auto text-center space-y-2 py-4">
                    <div className="w-14 h-14 mx-auto rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 text-white flex items-center justify-center group-hover:bg-white group-hover:text-teal-700 transition-colors duration-300 shadow-lg">
                      <IconComp className="w-7 h-7" />
                    </div>
                  </div>

                  {/* Bottom Location Label */}
                  <div className="relative z-10 text-xs font-semibold text-white/90 tracking-wide uppercase flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-white" />
                    <span>Medavakkam, Chennai</span>
                  </div>

                </div>

                {/* Card Information Body */}
                <div className="p-6 bg-white space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-extrabold text-teal-700 uppercase tracking-wider block mb-1">
                      {item.category}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed mt-1.5">
                      {item.desc}
                    </p>
                  </div>
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-teal-700">
                    <span>View Details</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* Light Theme Lightbox / Modal */}
      {activeImage && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setActiveImage(null)}
        >
          <div
            className="bg-white border border-slate-200 rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveImage(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className={`h-64 w-full bg-gradient-to-br ${activeImage.gradient} rounded-2xl p-6 relative flex flex-col justify-between overflow-hidden shadow-inner text-white`}>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-900 bg-white/90 px-3 py-1 rounded-full w-max shadow-sm">
                {activeImage.badge}
              </span>
              <div className="my-auto text-center space-y-3">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 text-white flex items-center justify-center shadow-lg">
                  {React.createElement(activeImage.icon, { className: "w-8 h-8" })}
                </div>
                <h3 className="text-xl font-extrabold text-white">{activeImage.title}</h3>
              </div>
            </div>

            <div className="space-y-3 text-sm text-slate-700">
              <span className="text-xs font-bold text-teal-700 uppercase tracking-wider block">
                {activeImage.category}
              </span>
              <p className="leading-relaxed text-slate-600">
                {activeImage.desc}
              </p>
              <p className="text-xs text-slate-500 italic">
                Located at Healthy Eye Clinic & Opticals, 12A Surya Nagar 1st Cross Street, Medavakkam, Chennai – 600100.
              </p>
            </div>
          </div>
        </div>
      )}

    </section>
  );
}
