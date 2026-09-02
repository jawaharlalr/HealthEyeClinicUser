import React, { useState } from 'react';
import { Search, AlertCircle, X } from 'lucide-react';
import { findPatientByMobile } from '../firebase/patientService';
import { cleanMobileInput } from '../utils/validation';

export default function ExistingPatientModal({
  isOpen,
  onClose,
  onPatientFound,
  onSwitchToNewPatient
}) {
  const [mobileNumber, setMobileNumber] = useState('');
  const [searching, setSearching] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleMobileChange = (e) => {
    const val = cleanMobileInput(e.target.value);
    setMobileNumber(val);
    if (errorMessage) setErrorMessage('');
  };

  const handleFormSubmit = async (e) => {
    if (e) e.preventDefault();

    const clean = cleanMobileInput(mobileNumber);
    if (!clean || clean.length !== 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }

    setSearching(true);
    setErrorMessage('');

    try {
      const patient = await findPatientByMobile(clean);
      if (patient) {
        onPatientFound({
          fullName: patient.fullName || '',
          mobile: patient.mobile || clean,
          email: patient.email || '',
          dateOfBirth: patient.dateOfBirth || '',
          gender: patient.gender || '',
          bloodGroup: patient.bloodGroup || '',
          bloodGroupOther: patient.bloodGroupOther || '',
          address: patient.address || '',
          patientId: patient.patientId || patient.id
        });
      } else {
        setErrorMessage("We couldn't find your details. Please check your mobile number or choose New Patient.");
      }
    } catch (err) {
      console.error("Existing patient lookup error:", err);
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setSearching(false);
    }
  };

  const handleTryAgain = () => {
    setErrorMessage('');
    setMobileNumber('');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6 relative border border-slate-100 pointer-events-auto">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-teal-50 text-teal-700 flex items-center justify-center mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Existing Patient</h3>
          <p className="text-xs text-slate-500">
            Enter your mobile number
          </p>
        </div>

        {/* Mobile Search Form */}
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 text-center">
              Mobile Number
            </label>
            <input
              type="tel"
              maxLength={10}
              placeholder="10-digit Mobile Number"
              value={mobileNumber}
              onChange={handleMobileChange}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-center text-lg font-bold text-slate-900 tracking-wider focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
            />
          </div>

          {errorMessage ? (
            <div className="p-4 bg-pink-50 border border-pink-200 rounded-xl text-xs text-pink-900 space-y-3 animate-fadeIn">
              <p className="flex items-start gap-1.5 font-medium">
                <AlertCircle className="w-4 h-4 text-pink-600 flex-shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </p>
              <div className="flex gap-2 justify-center pt-1">
                <button
                  type="button"
                  onClick={handleTryAgain}
                  className="px-3.5 py-1.5 bg-white border border-pink-300 text-pink-900 font-bold rounded-lg text-xs hover:bg-pink-100 transition"
                >
                  Try Again
                </button>
                <button
                  type="button"
                  onClick={onSwitchToNewPatient}
                  className="px-3.5 py-1.5 bg-teal-600 text-white font-bold rounded-lg text-xs hover:bg-teal-700 transition"
                >
                  New Patient
                </button>
              </div>
            </div>
          ) : (
            <button
              type="submit"
              disabled={searching || mobileNumber.length !== 10}
              className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm rounded-xl shadow transition disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {searching ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Checking your details...</span>
                </>
              ) : (
                <span>Continue</span>
              )}
            </button>
          )}
        </form>

      </div>
    </div>
  );
}
