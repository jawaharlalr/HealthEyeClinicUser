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
      gradient: 'from-blue-900 via-slate-800 to-teal-900',
      badge: 'Patient Lounge'
    },
    {
      id: 'examination',
      title: 'Eye Examination Suite',
      category: 'Clinical Suite',
      desc: 'Dedicated room equipped for comprehensive visual acuity testing and ocular inspection.',
      icon: Stethoscope,
      gradient: 'from-teal-900 via-slate-900 to-blue-950',
      badge: 'Examination'
    },
    {
      id: 'optical',
      title: 'Optical Frame Showcase',
      category: 'Eyewear & Lenses',
      desc: 'Curated display of prescription optical frames, single-vision, bifocal, and progressive lenses.',
      icon: Glasses,
      gradient: 'from-slate-900 via-teal-950 to-blue-900',
      badge: 'Optical Display'
    },
    {
      id: 'refraction',
      title: 'Advanced Refraction Unit',
      category: 'Vision Testing',
      desc: 'Precision refractive testing setup to accurately evaluate myopia, hyperopia, and astigmatism.',
      icon: Eye,
      gradient: 'from-blue-950 via-teal-900 to-slate-900',
      badge: 'Refraction'
    },
    {
      id: 'screening',
      title: 'Screening Station',
      category: 'Cataract & Glaucoma',
      desc: 'Focused screening instruments for crystalline lens clarity and intraocular pressure evaluation.',
      icon: ShieldCheck,
      gradient: 'from-teal-950 via-blue-900 to-slate-900',
      badge: 'Screening'
    }
  ];

  return (
    <section id="gallery" className="py-16 bg-slate-900 text-white relative overflow-hidden">
      
      {/* Background Subtle Medical Grid Pattern */}
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-extrabold uppercase tracking-widest text-teal-400 bg-teal-950/80 px-4 py-1.5 rounded-full border border-teal-700/60 shadow-sm">
            Clean • Professional • Patient-Focused
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Clinic & Optical Gallery
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
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
                className="group relative bg-slate-800 border border-slate-700/70 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl hover:border-teal-500/50 transition-all duration-300 cursor-pointer flex flex-col justify-between"
              >
                {/* Visual Placeholder / Image Canvas */}
                <div className={`h-52 w-full bg-gradient-to-br ${item.gradient} p-6 relative flex flex-col justify-between overflow-hidden`}>
                  
                  {/* Subtle Grid overlay */}
                  <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:24px_24px]" />

                  {/* Top Badge & Zoom */}
                  <div className="relative z-10 flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-teal-300 bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-full border border-teal-500/30">
                      {item.badge}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Maximize2 className="w-4 h-4 text-teal-300" />
                    </div>
                  </div>

                  {/* Center Icon & Branding */}
                  <div className="relative z-10 my-auto text-center space-y-2 py-4">
                    <div className="w-14 h-14 mx-auto rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-teal-300 flex items-center justify-center group-hover:bg-teal-500 group-hover:text-slate-950 transition-colors duration-300 shadow-lg">
                      <IconComp className="w-7 h-7" />
                    </div>
                  </div>

                  {/* Bottom Location Label */}
                  <div className="relative z-10 text-xs font-semibold text-slate-300/90 tracking-wide uppercase flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-teal-400" />
                    <span>Medavakkam, Chennai</span>
                  </div>

                </div>

                {/* Card Information Body */}
                <div className="p-6 bg-slate-800/90 space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-bold text-teal-400 uppercase tracking-wider block mb-1">
                      {item.category}
                    </span>
                    <h3 className="text-lg font-bold text-white group-hover:text-teal-300 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed mt-1.5">
                      {item.desc}
                    </p>
                  </div>
                  <div className="pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs font-semibold text-teal-400">
                    <span>View Space Details</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* Lightbox / Modal */}
      {activeImage && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setActiveImage(null)}
        >
          <div
            className="bg-slate-900 border border-slate-700 rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveImage(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className={`h-64 w-full bg-gradient-to-br ${activeImage.gradient} rounded-2xl p-6 relative flex flex-col justify-between overflow-hidden shadow-inner`}>
              <span className="text-xs font-bold uppercase tracking-wider text-teal-300 bg-slate-950/80 px-3 py-1 rounded-full w-max border border-teal-500/30">
                {activeImage.badge}
              </span>
              <div className="my-auto text-center space-y-3">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-teal-300 flex items-center justify-center shadow-lg">
                  {React.createElement(activeImage.icon, { className: "w-8 h-8" })}
                </div>
                <h3 className="text-xl font-extrabold text-white">{activeImage.title}</h3>
              </div>
            </div>

            <div className="space-y-3 text-sm text-slate-300">
              <span className="text-xs font-bold text-teal-400 uppercase tracking-wider block">
                {activeImage.category}
              </span>
              <p className="leading-relaxed">
                {activeImage.desc}
              </p>
              <p className="text-xs text-slate-400 italic">
                Located at Healthy Eye Clinic & Opticals, 12A Surya Nagar 1st Cross Street, Medavakkam, Chennai – 600100.
              </p>
            </div>
          </div>
        </div>
      )}

    </section>
  );
}
