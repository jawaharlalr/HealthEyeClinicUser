import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppointmentStepper from '../components/AppointmentStepper';
import DateSelector from '../components/DateSelector';
import SlotSelector from '../components/SlotSelector';
import PatientForm from '../components/PatientForm';
import BookingSummary from '../components/BookingSummary';
import ExistingPatientModal from '../components/ExistingPatientModal';
import { bookAppointmentAtomic, getAppointmentsByMobile, cancelAppointmentAtomic } from '../firebase/appointmentService';
import { isMonday, isPastDate, formatReadableDate, CLINIC_INFO } from '../utils/appointmentSlots';
import { cleanMobileInput } from '../utils/validation';
import { useSlotAvailability } from '../hooks/useSlotAvailability';
import { UserCheck, FileText, ArrowLeft, Calendar, Search, History, MapPin, Phone, Info, CheckCircle, AlertCircle, XCircle } from 'lucide-react';

export default function Appointment() {
  const navigate = useNavigate();

  // Active Tab: 'book' | 'past'
  const [activeTab, setActiveTab] = useState('book');

  // Booking Flow Stepper
  const [step, setStep] = useState(1);
  const [patientType, setPatientType] = useState('new'); // 'new' | 'existing'
  const [showExistingModal, setShowExistingModal] = useState(false);

  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState(null);
  const { bookedSlotIds, loadingSlots } = useSlotAvailability(selectedDate, selectedSlot, setSelectedSlot);

  const [formData, setFormData] = useState({
    fullName: '',
    mobile: '',
    email: '',
    dateOfBirth: '',
    gender: '',
    bloodGroup: '',
    bloodGroupOther: '',
    address: '',
    patientId: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState(null);

  // Past Appointments State
  const [pastMobile, setPastMobile] = useState('');
  const [pastAppointments, setPastAppointments] = useState(null);
  const [loadingPast, setLoadingPast] = useState(false);
  const [pastError, setPastError] = useState('');
  const [cancellingId, setCancellingId] = useState(null);

  // Initialize with next valid clinic day
  useEffect(() => {
    if (!selectedDate) {
      let candidate = new Date();
      candidate.setDate(candidate.getDate() + 1);
      
      if (candidate.getDay() === 1) {
        candidate.setDate(candidate.getDate() + 1);
      }
      
      const year = candidate.getFullYear();
      const month = String(candidate.getMonth() + 1).padStart(2, '0');
      const day = String(candidate.getDate()).padStart(2, '0');
      setSelectedDate(`${year}-${month}-${day}`);
    }
  }, [selectedDate]);

  const handleCancelAppointment = async (appId) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) return;
    setCancellingId(appId);
    try {
      const res = await cancelAppointmentAtomic(appId);
      if (res.success && pastMobile) {
        const updatedList = await getAppointmentsByMobile(pastMobile);
        setPastAppointments(updatedList);
      }
    } catch (err) {
      console.warn("Cancel error:", err);
    } finally {
      setCancellingId(null);
    }
  };

  const handleSelectPatientType = (type) => {
    setPatientType(type);
    if (type === 'existing') {
      setShowExistingModal(true);
    } else {
      setShowExistingModal(false);
      setStep(2);
    }
  };

  const handleExistingPatientFound = (patientData) => {
    setFormData(patientData);
    setPatientType('existing');
    setShowExistingModal(false);
    setStep(2); // Continue to Date Selection with pre-filled details!
  };

  const handleDateSelect = (dateStr) => {
    setSelectedDate(dateStr);
    setSelectedSlot(null);
    if (!isMonday(dateStr) && !isPastDate(dateStr)) {
      setStep(3);
    }
  };

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
    setStep(4);
  };

  const handleFormValid = () => {
    setBookingError(null);
    setStep(5);
  };

  const handleFinalBookingConfirm = async () => {
    if (!selectedDate || !selectedSlot) return;

    setSubmitting(true);
    setBookingError(null);

    try {
      const result = await bookAppointmentAtomic({
        date: selectedDate,
        slot: selectedSlot,
        patientType,
        fullName: formData.fullName,
        mobile: formData.mobile,
        email: formData.email,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        bloodGroup: formData.bloodGroup,
        bloodGroupOther: formData.bloodGroupOther,
        address: formData.address,
        patientId: formData.patientId
      });

      if (result.success) {
        navigate(`/booking-success?id=${result.appointment.appointmentId}`);
      } else {
        setBookingError(result.error || "Something went wrong. Please try again.");
      }
    } catch (err) {
      setBookingError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Search Past Appointments by Mobile Number (Strict 10 digits)
  const handleSearchPastAppointments = async (e) => {
    e.preventDefault();
    const clean = cleanMobileInput(pastMobile);
    if (!clean || clean.length !== 10) {
      setPastError('Please enter a valid 10-digit mobile number.');
      return;
    }

    setLoadingPast(true);
    setPastError('');
    setPastAppointments(null);

    try {
      const results = await getAppointmentsByMobile(clean);
      setPastAppointments(results);
    } catch (err) {
      setPastError("Something went wrong. Please try again.");
    } finally {
      setLoadingPast(false);
    }
  };

  const getStatusBadge = (statusStr) => {
    const s = String(statusStr || 'Booked').toLowerCase();
    if (s === 'completed') return <span className="bg-emerald-100 text-emerald-800 font-extrabold text-xs px-3 py-1 rounded-full uppercase tracking-wider">Completed</span>;
    if (s === 'cancelled') return <span className="bg-pink-100 text-pink-800 font-extrabold text-xs px-3 py-1 rounded-full uppercase tracking-wider">Cancelled</span>;
    if (s === 'confirmed') return <span className="bg-blue-100 text-blue-800 font-extrabold text-xs px-3 py-1 rounded-full uppercase tracking-wider">Confirmed</span>;
    return <span className="bg-teal-100 text-teal-800 font-extrabold text-xs px-3 py-1 rounded-full uppercase tracking-wider">Booked</span>;
  };

  const renderDynamicInstructions = (app) => {
    const status = String(app.status || 'Booked').toLowerCase();

    if (status === 'completed') {
      return (
        <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-4 text-xs text-slate-700 space-y-1.5 animate-fadeIn">
          <strong className="text-emerald-900 font-bold block text-sm flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>Appointment Completed</span>
          </strong>
          <p>Thank you for visiting Healthy Eye Clinic & Opticals.</p>
          <p>
            If you have any questions about your consultation, prescription, or eyeglasses, please feel free to call us at <strong>{CLINIC_INFO.phone}</strong>.
          </p>
          <p className="text-slate-500 italic pt-0.5">
            We recommend scheduling a routine eye checkup annually to maintain healthy vision.
          </p>
        </div>
      );
    }

    if (status === 'cancelled') {
      return (
        <div className="bg-pink-50/60 border border-pink-200 rounded-xl p-4 text-xs text-slate-700 space-y-1.5 animate-fadeIn">
          <strong className="text-pink-900 font-bold block text-sm flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 text-pink-600" />
            <span>Appointment Cancelled</span>
          </strong>
          <p>This appointment has been cancelled.</p>
          <p>
            If you would like to book a new appointment, please choose an available date and time above or call us at <strong>{CLINIC_INFO.phone}</strong>.
          </p>
          <p className="text-slate-500 italic pt-0.5">
            We look forward to serving you.
          </p>
        </div>
      );
    }

    // Default for 'Booked' or 'Confirmed' (Includes 'Before You Visit')
    return (
      <div className="space-y-4 animate-fadeIn">
        {/* Appointment Information */}
        <div className="bg-blue-50/60 border border-blue-200 rounded-xl p-4 text-xs text-slate-700 space-y-1.5">
          <strong className="text-slate-900 font-bold block text-sm">
            Appointment Information
          </strong>
          <p className="font-semibold text-slate-800">Need to change this appointment?</p>
          <p>
            If you need to reschedule or cancel your appointment, please contact the clinic at <strong>{CLINIC_INFO.phone}</strong>.
          </p>
          <p className="text-slate-500 italic pt-0.5">
            Please contact the clinic as early as possible.
          </p>
        </div>

        {/* Before You Visit (Shown ONLY for Confirmed / Booked appointments) */}
        <div className="bg-teal-50/60 border border-teal-200 rounded-xl p-5 space-y-3">
          <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Info className="w-4 h-4 text-teal-700" />
            <span>Before You Visit</span>
          </h4>
          <ul className="space-y-2 text-xs text-slate-700">
            <li className="flex items-start gap-2">
              <span className="text-teal-600 font-bold">•</span>
              <span>Please arrive a few minutes before your appointment time.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-teal-600 font-bold">•</span>
              <span>Bring your previous eye-test reports or prescriptions if available.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-teal-600 font-bold">•</span>
              <span>If you use spectacles or contact lenses, bring them with you when appropriate.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-teal-600 font-bold">•</span>
              <span>Keep your phone available in case the clinic needs to contact you.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-teal-600 font-bold">•</span>
              <span>If you cannot attend, please contact the clinic as early as possible.</span>
            </li>
          </ul>
        </div>
      </div>
    );
  };

  return (
    <div className="py-8 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Existing Patient Search Modal */}
      <ExistingPatientModal
        isOpen={showExistingModal}
        onClose={() => setShowExistingModal(false)}
        onPatientFound={handleExistingPatientFound}
        onSwitchToNewPatient={() => {
          setShowExistingModal(false);
          setPatientType('new');
          setStep(2);
        }}
      />

      {/* Page Header */}
      <div className="text-center space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-3.5 py-1 rounded-full border border-teal-200">
          Clinic Appointments
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Appointment Services
        </h1>
        <p className="text-sm text-slate-600">
          Working Days: <strong>Tuesday – Sunday (11:00 AM – 4:00 PM)</strong>. Monday: Closed.
        </p>
      </div>

      {/* Two Clear Primary Options: Book an Appointment vs View Past Appointments */}
      <div className="bg-slate-100 p-1.5 rounded-2xl flex max-w-md mx-auto shadow-inner">
        <button
          type="button"
          onClick={() => setActiveTab('book')}
          className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center justify-center space-x-2 ${
            activeTab === 'book'
              ? 'bg-white text-teal-800 shadow'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Calendar className="w-4 h-4 text-teal-600" />
          <span>Book an Appointment</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('past')}
          className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center justify-center space-x-2 ${
            activeTab === 'past'
              ? 'bg-white text-teal-800 shadow'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <History className="w-4 h-4 text-teal-600" />
          <span>View Past Appointments</span>
        </button>
      </div>

      {/* TAB 1: BOOK AN APPOINTMENT */}
      {activeTab === 'book' && (
        <div className="space-y-6 animate-fadeIn">
          <AppointmentStepper currentStep={step} />

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card">
            
            {/* Step 1: Choose Patient Type */}
            {step === 1 && (
              <div className="space-y-6 animate-fadeIn">
                <div className="text-center sm:text-left border-b border-slate-100 pb-4">
                  <h3 className="text-xl font-bold text-slate-900 flex items-center justify-center sm:justify-start gap-2">
                    <UserCheck className="w-5 h-5 text-teal-600" />
                    <span>Choose Patient Type</span>
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <button
                    type="button"
                    onClick={() => handleSelectPatientType('new')}
                    className={`p-6 rounded-2xl border-2 text-left transition-all duration-200 group ${
                      patientType === 'new'
                        ? 'border-teal-600 bg-teal-50/60 shadow-md ring-2 ring-teal-200'
                        : 'border-slate-200 bg-white hover:border-teal-400 hover:bg-slate-50'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                      <UserCheck className="w-6 h-6" />
                    </div>
                    <h4 className="text-lg font-bold text-slate-900 mb-1">New Patient</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      First time visiting Healthy Eye Clinic. You will complete your initial registration details.
                    </p>
                    <span className="inline-block mt-4 text-xs font-bold text-teal-700 group-hover:translate-x-1 transition-transform">
                      Select New Patient →
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelectPatientType('existing')}
                    className={`p-6 rounded-2xl border-2 text-left transition-all duration-200 group ${
                      patientType === 'existing'
                        ? 'border-teal-600 bg-teal-50/60 shadow-md ring-2 ring-teal-200'
                        : 'border-slate-200 bg-white hover:border-teal-400 hover:bg-slate-50'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                      <FileText className="w-6 h-6" />
                    </div>
                    <h4 className="text-lg font-bold text-slate-900 mb-1">Existing Patient</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Enter your mobile number to pre-fill your saved profile details.
                    </p>
                    <span className="inline-block mt-4 text-xs font-bold text-blue-700 group-hover:translate-x-1 transition-transform">
                      Select Existing Patient →
                    </span>
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Date Selector */}
            {step === 2 && (
              <div className="space-y-6 animate-fadeIn">
                <DateSelector
                  selectedDate={selectedDate}
                  onSelectDate={handleDateSelect}
                />

                <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center space-x-1"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Patient Category</span>
                  </button>

                  {selectedDate && !isMonday(selectedDate) && !isPastDate(selectedDate) && (
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow transition"
                    >
                      View Available Times →
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Slot / Time Selector */}
            {step === 3 && (
              <div className="space-y-6 animate-fadeIn">
                <SlotSelector
                  selectedDate={selectedDate}
                  bookedSlotIds={bookedSlotIds}
                  selectedSlot={selectedSlot}
                  onSelectSlot={handleSlotSelect}
                  loading={loadingSlots}
                  onChangeDate={() => setStep(2)}
                />

                <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center space-x-1"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Date Selection</span>
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Patient Info Form */}
            {step === 4 && (
              <div className="space-y-6 animate-fadeIn">
                <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                  <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-teal-600" />
                    <span>Step 4: Patient Details</span>
                  </h3>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="text-xs font-semibold text-teal-700 hover:text-teal-800 underline"
                  >
                    Change Time ({selectedSlot?.label})
                  </button>
                </div>

                <PatientForm
                  patientType={patientType}
                  setPatientType={setPatientType}
                  formData={formData}
                  setFormData={setFormData}
                  onFormValid={handleFormValid}
                  onOpenExistingModal={() => setShowExistingModal(true)}
                />
              </div>
            )}

            {/* Step 5: Review & Confirmation */}
            {step === 5 && (
              <BookingSummary
                selectedDate={selectedDate}
                selectedSlot={selectedSlot}
                formData={formData}
                patientType={patientType}
                onConfirm={handleFinalBookingConfirm}
                onBack={() => setStep(4)}
                submitting={submitting}
                errorMsg={bookingError}
              />
            )}

          </div>
        </div>
      )}

      {/* TAB 2: VIEW PAST APPOINTMENTS */}
      {activeTab === 'past' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6 animate-fadeIn">
          
          <div className="border-b border-slate-100 pb-4 space-y-1">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <History className="w-5 h-5 text-teal-600" />
              <span>Past Appointments</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-500">
              Enter your mobile number to view your previous appointments.
            </p>
          </div>

          <form onSubmit={handleSearchPastAppointments} className="flex flex-col sm:flex-row gap-3 max-w-lg">
            <div className="relative flex-1">
              <input
                type="tel"
                maxLength={10}
                placeholder="10-digit Mobile Number"
                value={pastMobile}
                onChange={(e) => setPastMobile(cleanMobileInput(e.target.value))}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
              />
            </div>
            <button
              type="submit"
              disabled={loadingPast || pastMobile.length !== 10}
              className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm rounded-xl shadow transition disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {loadingPast ? (
                <span>Checking...</span>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>View Appointments</span>
                </>
              )}
            </button>
          </form>

          {pastError && (
            <p className="text-xs text-pink-600 font-semibold">{pastError}</p>
          )}

          {/* Detailed Appointment Cards Result */}
          {pastAppointments !== null && (
            <div className="pt-4 border-t border-slate-100 space-y-6">
              
              {pastAppointments.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <h4 className="text-base font-bold text-slate-800">No past appointments found.</h4>
                  <p className="text-xs text-slate-500">Please check your mobile number and try again.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                    Your Saved Appointments ({pastAppointments.length})
                  </h4>

                  {pastAppointments.map((app) => (
                    <div
                      key={app.id || app.appointmentId}
                      className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-6 shadow-sm"
                    >
                      {/* Card Header: Number & Status */}
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-200 pb-4">
                        <div>
                          <span className="text-xs font-semibold text-slate-400 uppercase block">Appointment Number</span>
                          <span className="text-xl font-mono font-extrabold text-teal-800 block">
                            {app.appointmentId}
                          </span>
                        </div>
                        <div>
                          {getStatusBadge(app.status)}
                        </div>
                      </div>

                      {/* Details Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                          <span className="text-xs font-semibold text-slate-400 uppercase block">Patient Name</span>
                          <strong className="text-slate-900">{app.patientName}</strong>
                        </div>

                        <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                          <span className="text-xs font-semibold text-slate-400 uppercase block">Mobile Number</span>
                          <strong className="text-slate-900">{app.mobile}</strong>
                        </div>

                        <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                          <span className="text-xs font-semibold text-slate-400 uppercase block">Date</span>
                          <strong className="text-slate-900">{formatReadableDate(app.date)}</strong>
                        </div>

                        <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                          <span className="text-xs font-semibold text-slate-400 uppercase block">Time</span>
                          <strong className="text-slate-900">{app.slot || `${app.startTime} – ${app.endTime}`}</strong>
                        </div>
                      </div>

                      {/* Clinic Location Box */}
                      <div className="bg-white p-4 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-1">
                        <strong className="text-slate-900 text-sm block">{CLINIC_INFO.name}</strong>
                        <p className="flex items-center gap-1.5">
                          <MapPin className="w-4 h-4 text-teal-600 flex-shrink-0" />
                          <span>{CLINIC_INFO.address}</span>
                        </p>
                        <p className="flex items-center gap-1.5">
                          <Phone className="w-4 h-4 text-teal-600 flex-shrink-0" />
                          <span>Phone: <strong>{CLINIC_INFO.phone}</strong></span>
                        </p>
                      </div>

                      {/* Dynamic Instructions & Before You Visit per Status */}
                      {renderDynamicInstructions(app)}

                      {/* Cancel Action for active bookings */}
                      {(app.status === 'booked' || app.status === 'Booked' || app.status === 'confirmed' || app.status === 'Confirmed') && (
                        <div className="pt-2 flex justify-end border-t border-slate-200">
                          <button
                            type="button"
                            disabled={cancellingId === app.appointmentId}
                            onClick={() => handleCancelAppointment(app.appointmentId || app.id)}
                            className="inline-flex items-center space-x-1.5 text-xs font-bold text-pink-700 bg-pink-50 hover:bg-pink-100 border border-pink-200 px-3.5 py-2 rounded-xl transition disabled:opacity-50"
                          >
                            <XCircle className="w-4 h-4 text-pink-600" />
                            <span>{cancellingId === app.appointmentId ? 'Cancelling...' : 'Cancel Appointment'}</span>
                          </button>
                        </div>
                      )}

                    </div>
                  ))}

                </div>
              )}
            </div>
          )}

        </div>
      )}

    </div>
  );
}
