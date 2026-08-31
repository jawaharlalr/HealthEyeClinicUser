import React, { useState } from 'react';
import { User, Phone, Mail, Calendar, MapPin, Droplet } from 'lucide-react';
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

  const bloodGroupOptions = [
    'A+',
    'A-',
    'B+',
    'B-',
    'AB+',
    'AB-',
    'O+',
    'O-',
    'Other / Rare'
  ];

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

  // Validate All Required Fields before proceeding
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
      <div className="bg-slate-100 p-1.5 rounded-2xl flex max-w-md mx-auto">
        <button
          type="button"
          onClick={() => {
            setPatientType('new');
          }}
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

      {/* Main Patient Registration & Editing Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* 1. Full Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Full Name <span className="text-pink-600">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                name="fullName"
                placeholder="Full Name (Letters only)"
                value={formData.fullName || ''}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-2.5 bg-white rounded-xl border text-sm text-slate-900 font-medium focus:ring-2 focus:ring-teal-500 outline-none ${
                  validationErrors.fullName ? 'border-pink-500 bg-pink-50/20' : 'border-slate-300'
                }`}
              />
            </div>
            {validationErrors.fullName && (
              <p className="text-xs text-pink-600 mt-1 font-medium">{validationErrors.fullName}</p>
            )}
          </div>

          {/* 2. Mobile Number */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Mobile Number <span className="text-pink-600">*</span>
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
                className={`w-full pl-10 pr-4 py-2.5 bg-white rounded-xl border text-sm text-slate-900 font-medium focus:ring-2 focus:ring-teal-500 outline-none ${
                  validationErrors.mobile ? 'border-pink-500 bg-pink-50/20' : 'border-slate-300'
                }`}
              />
            </div>
            {validationErrors.mobile && (
              <p className="text-xs text-pink-600 mt-1 font-medium">{validationErrors.mobile}</p>
            )}
          </div>

          {/* 3. Email */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Email Address <span className="text-pink-600">*</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email || ''}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-2.5 bg-white rounded-xl border text-sm text-slate-900 font-medium focus:ring-2 focus:ring-teal-500 outline-none ${
                  validationErrors.email ? 'border-pink-500 bg-pink-50/20' : 'border-slate-300'
                }`}
              />
            </div>
            {validationErrors.email && (
              <p className="text-xs text-pink-600 mt-1 font-medium">{validationErrors.email}</p>
            )}
          </div>

          {/* 4. Date of Birth */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Date of Birth <span className="text-pink-600">*</span>
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth || ''}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-2.5 bg-white rounded-xl border text-sm text-slate-900 font-medium focus:ring-2 focus:ring-teal-500 outline-none ${
                  validationErrors.dateOfBirth ? 'border-pink-500 bg-pink-50/20' : 'border-slate-300'
                }`}
              />
            </div>
            {validationErrors.dateOfBirth && (
              <p className="text-xs text-pink-600 mt-1 font-medium">{validationErrors.dateOfBirth}</p>
            )}
          </div>

          {/* 5. Gender */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Gender <span className="text-pink-600">*</span>
            </label>
            <select
              name="gender"
              value={formData.gender || ''}
              onChange={handleChange}
              className={`w-full px-4 py-2.5 bg-white rounded-xl border text-sm text-slate-900 font-medium focus:ring-2 focus:ring-teal-500 outline-none ${
                validationErrors.gender ? 'border-pink-500 bg-pink-50/20' : 'border-slate-300'
              }`}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            {validationErrors.gender && (
              <p className="text-xs text-pink-600 mt-1 font-medium">{validationErrors.gender}</p>
            )}
          </div>

          {/* 6. Blood Group Dropdown */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Blood Group <span className="text-pink-600">*</span>
            </label>
            <div className="relative">
              <Droplet className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <select
                name="bloodGroup"
                value={formData.bloodGroup || ''}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-2.5 bg-white rounded-xl border text-sm text-slate-900 font-medium focus:ring-2 focus:ring-teal-500 outline-none ${
                  validationErrors.bloodGroup ? 'border-pink-500 bg-pink-50/20' : 'border-slate-300'
                }`}
              >
                <option value="">Select Blood Group</option>
                {bloodGroupOptions.map((bg) => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </div>
            {validationErrors.bloodGroup && (
              <p className="text-xs text-pink-600 mt-1 font-medium">{validationErrors.bloodGroup}</p>
            )}
          </div>

        </div>

        {/* Conditional Blood Group Specification if Other / Rare */}
        {formData.bloodGroup === 'Other / Rare' && (
          <div className="animate-fadeIn">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Please specify your blood group <span className="text-pink-600">*</span>
            </label>
            <input
              type="text"
              name="bloodGroupOther"
              placeholder="Specify blood group"
              value={formData.bloodGroupOther || ''}
              onChange={handleChange}
              className={`w-full px-4 py-2.5 bg-white rounded-xl border text-sm text-slate-900 font-medium focus:ring-2 focus:ring-teal-500 outline-none ${
                validationErrors.bloodGroupOther ? 'border-pink-500 bg-pink-50/20' : 'border-slate-300'
              }`}
            />
            {validationErrors.bloodGroupOther && (
              <p className="text-xs text-pink-600 mt-1 font-medium">{validationErrors.bloodGroupOther}</p>
            )}
          </div>
        )}

        {/* 7. Address */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Address <span className="text-pink-600">*</span>
          </label>
          <div className="relative">
            <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              name="address"
              placeholder="Address / Locality"
              value={formData.address || ''}
              onChange={handleChange}
              className={`w-full pl-10 pr-4 py-2.5 bg-white rounded-xl border text-sm text-slate-900 font-medium focus:ring-2 focus:ring-teal-500 outline-none ${
                validationErrors.address ? 'border-pink-500 bg-pink-50/20' : 'border-slate-300'
              }`}
            />
          </div>
          {validationErrors.address && (
            <p className="text-xs text-pink-600 mt-1 font-medium">{validationErrors.address}</p>
          )}
        </div>

        {/* Action Button */}
        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm rounded-xl shadow-md transition"
          >
            Confirm Details & Continue →
          </button>
        </div>

      </form>

    </div>
  );
}
