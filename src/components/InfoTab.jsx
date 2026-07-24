import React from "react";
import { MapPin, Phone, Mail, Smartphone, Clock, Eye, Star, Shield } from "lucide-react";

const PlayStoreBadge = () => (
  <div className="inline-flex items-center gap-2.5 bg-white/10 text-white px-4 py-2.5 rounded-2xl border border-white/15 hover:bg-white/20 transition-all duration-200 select-none cursor-pointer">
    <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 20.476V3.524c0-.756.592-1.393 1.348-1.488l9.404 9.404L3 20.476z" fill="#00F0FF"/>
      <path d="M19.123 10.976L14.73 8.528l-2.072 2.072 6.465.376z" fill="#FFEB3B"/>
      <path d="M3 20.476l10.752-10.752 2.072 2.072-4.393 2.448c-.756.42-1.684.42-2.44 0L3 20.476z" fill="#FF2D55"/>
      <path d="M13.752 9.724L3.896 2.036C4.652 1.616 5.58 1.616 6.336 2.036l9.404 9.404-2.072-1.716z" fill="#4CAF50"/>
    </svg>
    <div className="text-left leading-none">
      <span className="text-[8px] uppercase block tracking-widest text-white/60 font-bold">Get it on</span>
      <span className="text-[11px] font-extrabold block mt-0.5 text-white">Google Play</span>
    </div>
  </div>
);

const ContactRow = ({ icon: Icon, iconBg, iconColor, label, value, action }) => (
  <div className="flex items-center gap-4">
    <div className={`w-10 h-10 rounded-2xl ${iconBg} flex items-center justify-center shrink-0 border border-white/10`}>
      <Icon size={16} className={iconColor} />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-[9px] font-extrabold text-white/50 uppercase tracking-widest">{label}</p>
      <p className="text-sm font-bold text-white mt-0.5 truncate">{value}</p>
    </div>
    {action}
  </div>
);

export default function InfoTab() {
  return (
    <div className="space-y-4 max-w-2xl mx-auto animate-in fade-in duration-300">

      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-teal-600 via-teal-500 to-emerald-500 p-6 shadow-xl shadow-teal-600/20">
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-8 -left-8 w-36 h-36 rounded-full bg-emerald-400/20 blur-2xl" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
              <Eye size={16} className="text-white" />
            </div>
            <span className="text-teal-100 text-[10px] font-extrabold uppercase tracking-widest">Healthy Eye Clinic</span>
          </div>
          <h2 className="text-white text-2xl font-black leading-tight mb-1">Tuesday – Sunday</h2>
          <p className="text-teal-100 text-sm font-bold">11:00 AM – 4:00 PM</p>
          <p className="text-teal-100/70 text-xs mt-1">Walk-ins Welcome · Exceptional Eye Care</p>
          <div className="mt-4 flex items-center gap-2 flex-wrap">
            {[["🗓", "Mon Closed"], ["⭐", "Premium Care"], ["🛡", "Trusted"]].map(([ico, label]) => (
              <span key={label} className="inline-flex items-center gap-1.5 bg-white/15 border border-white/25 text-white text-[10px] font-bold px-3 py-1.5 rounded-xl">
                <span>{ico}</span>{label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* About Card */}
      <div className="glass rounded-3xl p-5 glass-shadow space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-teal-500/20 flex items-center justify-center border border-teal-500/25">
            <Eye size={13} className="text-teal-400" />
          </div>
          <h4 className="text-xs font-extrabold text-white/80 uppercase tracking-wider">About Us</h4>
        </div>
        <p className="text-sm text-white/60 leading-relaxed">
          At <span className="text-teal-400 font-bold">Healthy Eye Clinic</span>, we are committed to providing premium, comprehensive eye care and personalized services. We combine clinical expertise with stylish spectacles and premium lenses to suit your unique lifestyle.
        </p>
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3.5 bg-teal-500/10 border border-teal-500/20 rounded-2xl">
            <div className="w-7 h-7 bg-teal-500/20 rounded-xl flex items-center justify-center mb-2">
              <Shield size={13} className="text-teal-400" />
            </div>
            <h5 className="text-[11px] font-extrabold text-teal-300">Expert Doctors</h5>
            <p className="text-[10px] text-teal-400/70 mt-0.5 leading-snug">Experienced & trusted clinical care.</p>
          </div>
          <div className="p-3.5 bg-pink-500/10 border border-pink-500/20 rounded-2xl">
            <div className="w-7 h-7 bg-pink-500/20 rounded-xl flex items-center justify-center mb-2">
              <Star size={13} className="text-pink-400" />
            </div>
            <h5 className="text-[11px] font-extrabold text-pink-300">Quality Frames</h5>
            <p className="text-[10px] text-pink-400/70 mt-0.5 leading-snug">Premium brands & latest styles.</p>
          </div>
        </div>
      </div>

      {/* Contact Card */}
      <div className="glass rounded-3xl p-5 glass-shadow space-y-5">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-blue-500/20 flex items-center justify-center border border-blue-500/25">
            <MapPin size={13} className="text-blue-400" />
          </div>
          <h4 className="text-xs font-extrabold text-white/80 uppercase tracking-wider">Contact & Location</h4>
        </div>

        {/* Address */}
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-2xl bg-pink-500/15 flex items-center justify-center shrink-0 mt-0.5 border border-pink-500/20">
            <MapPin size={16} className="text-pink-400" />
          </div>
          <div className="flex-1">
            <p className="text-[9px] font-extrabold text-white/50 uppercase tracking-widest">Clinic Address</p>
            <p className="text-sm font-bold text-white mt-0.5 leading-snug">12a, Surya Nagar, Medavakkam</p>
            <p className="text-xs text-white/60">Chennai, Tamil Nadu 600100</p>
            <span className="inline-block mt-1.5 text-[9px] font-bold text-pink-400 bg-pink-500/15 border border-pink-500/25 px-2 py-1 rounded-lg leading-snug">
              Opp. Bhavani Amman Kovil, Pon Store Complex
            </span>
          </div>
          <a href="https://www.google.com/maps/search/?api=1&query=Healthy+Eye+Clinic+Medavakkam+Chennai"
            target="_blank" rel="noopener noreferrer"
            className="shrink-0 py-2 px-3.5 bg-pink-500 text-white text-[10px] font-extrabold rounded-xl hover:bg-pink-600 transition-all active:scale-95 cursor-pointer shadow-lg shadow-pink-500/20">
            Map
          </a>
        </div>

        <div className="h-px bg-white/8" />

        <ContactRow icon={Phone} iconBg="bg-teal-500/15" iconColor="text-teal-400" label="Telephone" value="80720 97048"
          action={
            <a href="tel:8072097048" className="shrink-0 py-2 px-3.5 bg-teal-600 text-white text-[10px] font-extrabold rounded-xl hover:bg-teal-700 transition-all active:scale-95 cursor-pointer shadow-lg shadow-teal-600/20">Call</a>
          }
        />

        <div className="h-px bg-white/8" />

        <ContactRow icon={Mail} iconBg="bg-blue-500/15" iconColor="text-blue-400" label="Email Address" value="healthyeyeclinic26@gmail.com"
          action={
            <a href="mailto:healthyeyeclinic26@gmail.com" className="shrink-0 py-2 px-3.5 bg-blue-600 text-white text-[10px] font-extrabold rounded-xl hover:bg-blue-700 transition-all active:scale-95 cursor-pointer shadow-lg shadow-blue-600/20">Email</a>
          }
        />
      </div>

      {/* App Card */}
      <div className="glass rounded-3xl p-5 glass-shadow">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 border border-white/15">
            <Smartphone size={22} className="text-white" />
          </div>
          <div className="flex-1">
            <span className="inline-block text-[9px] font-extrabold text-teal-400 bg-teal-500/15 border border-teal-500/25 px-2 py-0.5 rounded-lg uppercase tracking-widest mb-1.5">
              Coming Soon
            </span>
            <h4 className="text-sm font-extrabold text-white leading-tight">Healthy Eye Clinic App</h4>
            <p className="text-xs text-white/60 mt-1 leading-relaxed">
              Our Android app is under development. Book appointments and view medical records on the go — available soon on Google Play.
            </p>
            <div className="mt-3">
              <PlayStoreBadge />
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
