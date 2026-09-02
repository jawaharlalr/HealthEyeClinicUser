import React, { useState } from 'react';
import { User, Phone, MessageSquare, ShieldCheck } from 'lucide-react';
import { validatePatientForm, cleanNameInput, cleanMobileInput } from '../utils/validation';

export default function PatientForm({
  patientType,
  setPatientType,
  formData,
  setFormData,
  onFormValid,
  onOpenExistingModal
}) {
  const [validationErrors, setValidationErrors] = useState({});

  // Handle Input Changes with strict Filtering
  const handleChange = (e) => {
    const { name, value } = e.target;
    let filteredVal = value;

    if (name === 'fullName') {
      filteredVal = cleanNameInput(value);
    } else if (name === 'mobile') {
      filteredVal = cleanMobileInput(value);
    }

    setFormData(prev => ({
      ...prev,
      [name]: filteredVal
    }));

    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  // Validate Required Fields before proceeding
  const handleSubmit = (e) => {
    e.preventDefault();
    const result = validatePatientForm(formData);

    if (!result.isValid) {
      setValidationErrors(result.errors);
      return;
    }

    onFormValid();
  };

  return (
    <div className="space-y-6">
      
      {/* Patient Type Switcher */}
      <div className="bg-slate-100 p-1.5 rounded-2xl flex max-w-md mx-auto shadow-inner">
        <button
          type="button"
          onClick={() => setPatientType('new')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            patientType === 'new'
              ? 'bg-white text-teal-800 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          New Patient
        </button>
        <button
          type="button"
          onClick={() => {
            setPatientType('existing');
            if (onOpenExistingModal) onOpenExistingModal();
          }}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            patientType === 'existing'
              ? 'bg-white text-teal-800 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Existing Patient
        </button>
      </div>

      {/* Main Streamlined Patient Registration Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          
          {/* 1. Full Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Patient Name <span className="text-pink-600">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                name="fullName"
                placeholder="Full Patient Name"
                value={formData.fullName || ''}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-3 bg-white rounded-xl border text-sm text-slate-900 font-medium focus:ring-2 focus:ring-teal-500 outline-none transition ${
                  validationErrors.fullName ? 'border-pink-500 bg-pink-50/20' : 'border-slate-300'
                }`}
              />
            </div>
            {validationErrors.fullName && (
              <p className="text-xs text-pink-600 mt-1 font-semibold">{validationErrors.fullName}</p>
            )}
          </div>

          {/* 2. Phone Number */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Phone Number <span className="text-pink-600">*</span>
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="tel"
                name="mobile"
                maxLength={10}
                placeholder="10-digit Mobile Number"
                value={formData.mobile || ''}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-3 bg-white rounded-xl border text-sm text-slate-900 font-medium focus:ring-2 focus:ring-teal-500 outline-none transition ${
                  validationErrors.mobile ? 'border-pink-500 bg-pink-50/20' : 'border-slate-300'
                }`}
              />
            </div>
            {validationErrors.mobile && (
              <p className="text-xs text-pink-600 mt-1 font-semibold">{validationErrors.mobile}</p>
            )}
          </div>

        </div>

        {/* 3. Optional Message / Notes */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Optional Notes / Message <span className="text-slate-400 font-normal">(Optional)</span>
          </label>
          <div className="relative">
            <MessageSquare className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <textarea
              name="notes"
              rows={3}
              placeholder="Any specific symptoms, existing glasses, or requests..."
              value={formData.notes || ''}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl border border-slate-300 text-sm text-slate-900 font-medium focus:ring-2 focus:ring-teal-500 outline-none transition"
            />
          </div>
        </div>

        {/* Notice Info */}
        <div className="bg-teal-50/70 border border-teal-200 rounded-xl p-3.5 flex items-center space-x-3 text-xs text-slate-700">
          <ShieldCheck className="w-5 h-5 text-teal-600 flex-shrink-0" />
          <span>No medical service selection required. Full optical and eye testing will be performed at the clinic during your slot.</span>
        </div>

        {/* Action Button */}
        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-3.5 bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-sm rounded-xl shadow-md transition transform hover:-translate-y-0.5"
          >
            Review & Confirm Booking →
          </button>
        </div>

      </form>

    </div>
  );
}
