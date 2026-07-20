import React from "react";
import { MapPin, Phone, Mail, Smartphone } from "lucide-react";

const PlayStoreBadge = () => (
  <div className="flex items-center gap-2 bg-black text-white px-3 py-1.5 rounded-xl border border-slate-800/80 shadow-sm w-36 hover:bg-slate-900 transition-colors select-none">
    <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 20.476V3.524c0-.756.592-1.393 1.348-1.488l9.404 9.404L3 20.476z" fill="#00F0FF"/>
      <path d="M19.123 10.976L14.73 8.528l-2.072 2.072 6.465.376z" fill="#FFEB3B"/>
      <path d="M3 20.476l10.752-10.752 2.072 2.072-4.393 2.448c-.756.42-1.684.42-2.44 0L3 20.476z" fill="#FF2D55"/>
      <path d="M13.752 9.724L3.896 2.036C4.652 1.616 5.58 1.616 6.336 2.036l9.404 9.404-2.072-1.716z" fill="#4CAF50"/>
    </svg>
    <div className="text-left leading-none">
      <span className="text-[7px] uppercase block tracking-wider text-slate-400">Get it on</span>
      <span className="text-[10px] font-bold block mt-0.5 font-sans">Google Play</span>
    </div>
  </div>
);

export default function InfoTab() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300 grid grid-cols-1 md:grid-cols-2 md:gap-6 md:space-y-0 max-w-2xl mx-auto">
      {/* Timings Banner */}
      <div className="bg-gradient-to-br from-primary-light/45 via-white/40 to-secondary-light/25 backdrop-blur-xl border border-white/45 rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.03)] text-center md:col-span-2">
        <span className="text-[9px] font-extrabold text-secondary uppercase tracking-widest bg-secondary-light/60 backdrop-blur-sm px-2 py-0.5 rounded border border-secondary/15">
          Clinic Timings
        </span>
        <h3 className="text-xl font-extrabold text-slate-800 mt-2">Tuesday - Sunday</h3>
        <p className="text-xs font-bold text-primary mt-1">11:00 AM to 4:00 PM</p>
        <p className="text-xs text-slate-500 mt-1">Walk-ins Welcome • Exceptional Care for Your Eyes</p>
      </div>

      {/* About Us Card */}
      <div className="bg-white/70 backdrop-blur-xl border border-white/45 rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.03)] space-y-4 hover:bg-white/80 transition-all">
        <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">About Healthy Eye</h4>
        <p className="text-xs text-slate-650 leading-relaxed">
          At <span className="text-primary font-bold">Healthy Eye Clinic</span>, we are committed to providing premium, comprehensive eye care and personalized services. We combine clinical expertise with stylish spectacles and premium lenses to suit your unique lifestyle.
        </p>
        
        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="p-3 bg-primary-light/50 backdrop-blur-sm border border-primary/15 rounded-xl">
            <h5 className="text-[10px] font-extrabold text-primary uppercase">Expert Doctors</h5>
            <p className="text-[9px] text-slate-500 mt-0.5">Experienced & trusted clinical care.</p>
          </div>
          <div className="p-3 bg-secondary-light/50 backdrop-blur-sm border border-secondary/15 rounded-xl">
            <h5 className="text-[10px] font-extrabold text-secondary uppercase">Quality Frames</h5>
            <p className="text-[9px] text-slate-500 mt-0.5">Premium brands & latest styles.</p>
          </div>
        </div>
      </div>

      {/* Contact Details Card */}
      <div className="bg-white/70 backdrop-blur-xl border border-white/45 rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.03)] space-y-4 hover:bg-white/80 transition-all">
        <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Contact & Location</h4>
        
        <div className="space-y-4 text-xs text-slate-600">
          <div className="flex gap-3 items-start">
            <MapPin size={18} className="text-secondary shrink-0 mt-0.5" />
            <div className="flex-1">
              <h5 className="font-extrabold text-slate-800 text-[10px] uppercase">Clinic Address</h5>
              <p className="text-xs text-slate-555 mt-0.5">
                12a, Surya Nagar, Medavakkam, Chennai, Tamil Nadu 600100
              </p>
              <p className="text-[9px] text-secondary font-extrabold mt-1.5 bg-secondary-light/60 backdrop-blur-sm border border-secondary/20 px-2 py-0.5 rounded-lg inline-block">
                Landmark: Opposite to Bhavani Amman Kovil, In Pon Store Complex
              </p>
            </div>
            <a 
              href="https://www.google.com/maps/search/?api=1&query=Healthy+Eye+Clinic+Medavakkam+Chennai"
              target="_blank"
              rel="noopener noreferrer"
              className="py-1.5 px-3 bg-secondary text-white text-[10px] font-bold rounded-xl shadow-sm hover:bg-secondary-hover transition-colors active:scale-95 cursor-pointer shrink-0 self-start mt-4"
            >
              Directions
            </a>
          </div>

          <div className="flex gap-3 items-center pt-3 border-t border-slate-200/40">
            <Phone size={18} className="text-primary shrink-0" />
            <div className="flex-1">
              <h5 className="font-extrabold text-slate-800 text-[10px] uppercase">Telephone</h5>
              <p className="text-xs text-slate-555 mt-0.5">8072097048</p>
            </div>
            <a 
              href="tel:8072097048"
              className="py-1.5 px-3 bg-primary text-white text-xs font-bold rounded-xl shadow-sm hover:bg-primary-hover transition-colors active:scale-95 cursor-pointer"
            >
              Call Now
            </a>
          </div>

          <div className="flex gap-3 items-center pt-3 border-t border-slate-200/40">
            <Mail size={18} className="text-slate-400 shrink-0" />
            <div className="flex-grow flex-1">
              <h5 className="font-extrabold text-slate-800 text-[10px] uppercase">Email Address</h5>
              <p className="text-xs text-slate-555 mt-0.5">healthyeyeclinic26@gmail.com</p>
            </div>
            <a 
              href="mailto:healthyeyeclinic26@gmail.com"
              className="py-1.5 px-3 bg-primary text-white text-xs font-bold rounded-xl shadow-sm hover:bg-primary-hover transition-colors active:scale-95 cursor-pointer"
            >
              Email Us
            </a>
          </div>
        </div>
      </div>

      {/* Android App Announcement */}
      <div className="bg-gradient-to-br from-primary-light/45 via-white/40 to-slate-50/30 backdrop-blur-xl border border-white/45 rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.03)] md:col-span-2 mt-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Smartphone size={16} className="text-primary" />
            <span className="text-[9px] font-extrabold text-primary uppercase tracking-widest bg-primary-light/60 backdrop-blur-sm px-2 py-0.5 rounded border border-primary/15 inline-block">
              Android App
            </span>
          </div>
          <h4 className="text-xs font-extrabold text-slate-800">Healthy Eye Clinic Mobile App</h4>
          <p className="text-[10px] text-slate-500 leading-relaxed">
            Our Android application is under development and will be available soon on the Google Play Store to help you book appointments and check medical logs on the go.
          </p>
          <div className="pt-1">
            <PlayStoreBadge />
          </div>
        </div>
      </div>
    </div>
  );
}
