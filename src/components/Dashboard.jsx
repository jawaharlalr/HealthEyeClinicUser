import { useState, useEffect, useRef, useCallback } from "react";
import { 
  Calendar, Clock, User, LogOut, CheckCircle, Home, Info, X 
} from "lucide-react";
import { auth, db } from "../firebase";
import { signOut, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  doc, 
  updateDoc,
  setDoc
} from "firebase/firestore";

// Import modular subcomponents
import HomeTab from "./HomeTab";
import BookTab from "./BookTab";
import RecordsTab from "./RecordsTab";
import InfoTab from "./InfoTab";
import ProfileTab from "./ProfileTab";
import EntranceBanner from "./EntranceBanner";
import Login from "./Login";
import ErrorBoundary from "./ErrorBoundary";

export default function Dashboard({ user, showMsg, navigateTo }) {
  const navItems = [
    { id: "home", label: "Home", path: "/", routeLabel: "/", icon: <Home size={18} /> },
    { id: "request", label: "Book Consultation", path: "/book", routeLabel: "/book", icon: <Calendar size={18} /> },
    { id: "records", label: "Medical Logs", path: "/records", routeLabel: "/records", icon: <Clock size={18} /> },
    { id: "info", label: "Clinic Details", path: "/info", routeLabel: "/info", icon: <Info size={18} /> },
    { id: "profile", label: "My Profile", path: "/profile", routeLabel: "/profile", icon: <User size={18} /> }
  ];

  const getInitialTab = () => {
    if (typeof window !== "undefined") {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (path === "/book" || hash === "#book" || hash === "#request") return "request";
      if (path === "/records" || hash === "#records") return "records";
      if (path === "/info" || hash === "#info") return "info";
      if (path === "/profile" || hash === "#profile") return "profile";
    }
    return "home";
  };

  const [activeTab, setActiveTab] = useState(getInitialTab);

  const changeTab = useCallback((tabId, pushHistory = true) => {
    setActiveTab(tabId);
    if (pushHistory && typeof window !== "undefined") {
      const item = navItems.find(n => n.id === tabId);
      if (item && window.location.pathname !== item.path) {
        window.history.pushState({ tabId }, "", item.path);
      }
    }
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.toLowerCase();
      const item = navItems.find(n => n.path === path);
      if (item) {
        setActiveTab(item.id);
      } else {
        setActiveTab("home");
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);
  const [loading, setLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [latestApptNo, setLatestApptNo] = useState("");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showEntranceBanner, setShowEntranceBanner] = useState(true);

  // Form & Sync states
  const [appointments, setAppointments] = useState([]);
  const [allAppointments, setAllAppointments] = useState([]); // Fetch all appointments to prevent slot double-booking
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [patientName, setPatientName] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [dob, setDob] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("Male");
  const [bloodGroup, setBloodGroup] = useState("A+");
  const [address, setAddress] = useState("");

  const remindersRef = useRef({});
  const [stackIndex, setStackIndex] = useState(0); // For layered service cards slideshow

  const allTimeSlots = [
    "11:00 AM",
    "12:00 PM",
    "01:00 PM",
    "02:00 PM",
    "03:00 PM"
  ];

  const [patientMrno, setPatientMrno] = useState("");

  useEffect(() => {
    if (user) {
      // Try loading cached appts and mrno immediately for fast rendering
      try {
        const cachedUserAppts = localStorage.getItem(`healthy_eye_appts_${user.email}`);
        if (cachedUserAppts) setAppointments(JSON.parse(cachedUserAppts));
        const cachedAllAppts = localStorage.getItem(`healthy_eye_all_appts`);
        if (cachedAllAppts) setAllAppointments(JSON.parse(cachedAllAppts));
        const cachedMrno = localStorage.getItem(`healthy_eye_mrno_${user.email}`);
        if (cachedMrno) setPatientMrno(cachedMrno);
      } catch (e) {
        console.warn("Failed reading cached appts from localStorage:", e);
      }
      fetchData(user.email);
    }
  }, [user]);

  const fetchData = async (userEmail) => {
    try {
      // 1. Fetch user specific logs from Firestore
      const appointmentsRef = collection(db, "appointments");
      const userQuery = query(appointmentsRef, where("email", "==", userEmail));
      const userSnapshot = await getDocs(userQuery);
      const appts = userSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      const sortedAppts = appts.sort((a, b) => new Date(b.date) - new Date(a.date));
      setAppointments(sortedAppts);
      try {
        localStorage.setItem(`healthy_eye_appts_${userEmail}`, JSON.stringify(sortedAppts));
      } catch (e) {}

      // Look for MRNO on appointment documents
      const apptWithMrno = sortedAppts.find(a => a.mrno || a.mrNo || a.mr_no);
      let mrnoVal = apptWithMrno ? (apptWithMrno.mrno || apptWithMrno.mrNo || apptWithMrno.mr_no) : "";

      // 2. Fetch from patients collection if MRNO not found in appointments
      if (!mrnoVal) {
        try {
          const patientsRef = collection(db, "patients");
          const pQuery = query(patientsRef, where("email", "==", userEmail));
          const pSnap = await getDocs(pQuery);
          if (!pSnap.empty) {
            const pData = pSnap.docs[0].data();
            mrnoVal = pData.mrno || pData.mrNo || pData.mr_no || "";
          }
        } catch (e) {}
      }

      // 3. Fetch from users collection if MRNO still not found
      if (!mrnoVal) {
        try {
          const usersRef = collection(db, "users");
          const uQuery = query(usersRef, where("email", "==", userEmail));
          const uSnap = await getDocs(uQuery);
          if (!uSnap.empty) {
            const uData = uSnap.docs[0].data();
            mrnoVal = uData.mrno || uData.mrNo || uData.mr_no || "";
          }
        } catch (e) {}
      }

      setPatientMrno(mrnoVal);
      try {
        if (mrnoVal) localStorage.setItem(`healthy_eye_mrno_${userEmail}`, mrnoVal);
      } catch (e) {}

      // 4. Fetch all appointments from Firestore to check taken time slots
      const allSnapshot = await getDocs(appointmentsRef);
      const allAppts = allSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setAllAppointments(allAppts);
      try {
        localStorage.setItem(`healthy_eye_all_appts`, JSON.stringify(allAppts));
      } catch (e) {}
    } catch (err) {
      console.error("Error fetching data from Firestore (offline fallback active):", err);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Sign out error:", err);
    }
  };

  const handleDobChange = (e) => {
    const selectedDob = e.target.value;
    setDob(selectedDob);
    if (selectedDob) {
      const today = new Date();
      const birthDate = new Date(selectedDob);
      let calculatedAge = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        calculatedAge--;
      }
      setAge(calculatedAge >= 0 ? calculatedAge.toString() : "0");
    } else {
      setAge("");
    }
  };

  const getAvailableTimeSlots = () => {
    if (!bookingDate) return [];
    
    const [year, month, day] = bookingDate.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    if (date.getDay() === 1) return [];
    
    // Find all booked times on this date for "Nandhini K - Optometrist"
    const bookedTimes = allAppointments
      .filter(appt => appt.date === bookingDate && appt.status !== "Cancelled" && (appt.doctorName === "Nandhini K - Optometrist" || appt.doctorName === "Nandhini K"))
      .map(appt => appt.time);
      
    // Exclude booked slots
    let slots = allTimeSlots.filter(slot => !bookedTimes.includes(slot));

    // Filter out passed slots if bookingDate is today
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");
    const todayStr = `${y}-${m}-${d}`;

    if (bookingDate === todayStr) {
      slots = slots.filter(slot => {
        const [timePart, ampm] = slot.split(" ");
        let [hour, minute] = timePart.split(":").map(Number);
        if (ampm === "PM" && hour !== 12) hour += 12;
        if (ampm === "AM" && hour === 12) hour = 0;
        
        const slotMinutes = hour * 60 + minute;
        const nowMinutes = now.getHours() * 60 + now.getMinutes();
        return slotMinutes > nowMinutes;
      });
    }

    return slots;
  };

  const scheduleReminder = useCallback((appt) => {
    if (appt.status !== "Approved") return;
    if (remindersRef.current[appt.id]) return;

    try {
      const [timeStr, modifier] = appt.time.split(" ");
      let [hours, minutes] = timeStr.split(":");
      hours = parseInt(hours, 10);
      if (modifier === "PM" && hours < 12) hours += 12;
      if (modifier === "AM" && hours === 12) hours = 0;

      const apptDate = new Date(`${appt.date}T${hours.toString().padStart(2, "0")}:${minutes}:00`);
      const reminderTime = apptDate.getTime() - 15 * 60 * 1000; // 15 mins before
      const msToReminder = reminderTime - Date.now();

      if (msToReminder > 0) {
        const timerId = setTimeout(() => {
          if (Notification.permission === "granted") {
            new Notification("Appointment Reminder", {
              body: `Your eye consultation with Nandhini K is in 15 minutes at ${appt.time}!`,
              icon: "/favicon.svg"
            });
          }
          showMsg("success", `Reminder: Your eye consultation is in 15 minutes at ${appt.time}!`);
        }, msToReminder);

        remindersRef.current[appt.id] = timerId;
      }
    } catch (e) {
      console.error("Failed to parse reminder time for appointment:", appt.id, e);
    }
  }, [showMsg]);

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission === "default") {
        Notification.requestPermission();
      }
    }
  }, []);

  useEffect(() => {
    const currentIds = new Set(appointments.map(a => a.id));
    Object.keys(remindersRef.current).forEach(id => {
      if (!currentIds.has(id)) {
        clearTimeout(remindersRef.current[id]);
        delete remindersRef.current[id];
      }
    });

    appointments.forEach(appt => {
      if (appt.status === "Approved") {
        scheduleReminder(appt);
      }
    });

    return () => {
      Object.values(remindersRef.current).forEach(timerId => clearTimeout(timerId));
      remindersRef.current = {};
    };
  }, [appointments, scheduleReminder]);

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    if (!patientName || !dob || !age || !bookingDate || !bookingTime || !patientPhone || !address) {
      return showMsg("error", "Please fill in all details.");
    }
    
    const [year, month, day] = bookingDate.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    if (date.getDay() === 1) {
      return showMsg("error", "The clinic is closed on Mondays.");
    }

    const dateStr = bookingDate.replace(/-/g, "");
    const rand = Math.floor(1000 + Math.random() * 9000);
    const appointmentNo = `APT-${dateStr}-${rand}`;

     const apptData = {
      patientName,
      phone: patientPhone,
      email: user.email,
      dob,
      age: Number(age),
      gender,
      bloodGroup,
      address,
      date: bookingDate,
      time: bookingTime,
      doctorName: "Nandhini K - Optometrist",
      doctorId: "nandhini_k",
      status: "Pending",
      notes: "",
      appointmentNo,
      ...(patientMrno ? { mrno: patientMrno } : {}),
      createdAt: new Date().toISOString()
    };

    try {
      // Prompt for notifications on submission to ensure they receive alerts
      if (typeof window !== "undefined" && "Notification" in window) {
        Notification.requestPermission();
      }

      // Save appointment record
      const appointmentsRef = collection(db, "appointments");
      await addDoc(appointmentsRef, apptData);

      // Save / update patient profile record in 'patients' collection in Firestore
      try {
        const patientDocRef = doc(db, "patients", user.email);
        await setDoc(patientDocRef, {
          name: patientName,
          email: user.email,
          phone: patientPhone,
          dob,
          age: Number(age),
          gender,
          bloodGroup,
          address,
          ...(patientMrno ? { mrno: patientMrno } : {}),
          updatedAt: new Date().toISOString()
        }, { merge: true });
      } catch (pErr) {
        console.error("Error saving patient data to Firestore 'patients' collection:", pErr);
      }
      
      setLatestApptNo(appointmentNo);
      setBookingSuccess(true);
      fetchData(user.email);

      // Send WhatsApp alert to clinic in the background without redirecting
      sendClinicWhatsAppAlert(apptData);

      // Reset form fields
      setDob("");
      setAge("");
      setPatientPhone("");
      setBookingDate("");
      setBookingTime("");
      setAddress("");
    } catch (err) {
      console.error("Error adding doc to Firestore:", err);
      showMsg("error", "Failed to submit request.");
    }
  };

  const sendClinicWhatsAppAlert = async (appt) => {
    try {
      const response = await fetch("/api/send-whatsapp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ appt })
      });
      if (response.ok) {
        console.log("Clinic WhatsApp Alert notification triggered successfully.");
      } else {
        const errorData = await response.json();
        console.error("Clinic WhatsApp Alert failure:", errorData.error);
      }
    } catch (err) {
      console.error("Error sending WhatsApp alert to clinic:", err);
    }
  };

  const handleCancelAppointment = async (appt) => {
    if (!window.confirm("Cancel this visit?")) return;
    setLoading(true);
    try {
      const apptDocRef = doc(db, "appointments", appt.id);
      await updateDoc(apptDocRef, {
        status: "Cancelled"
      });
      showMsg("success", "Visit cancelled.");
      fetchData(user.email);
    } catch (err) {
      console.error("Error cancelling doc in Firestore:", err);
      showMsg("error", "Failed to cancel.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      showMsg("success", "Signed out successfully.");
    } catch (err) {
      console.error("Sign out error:", err);
      showMsg("error", "Failed to sign out.");
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row relative overflow-hidden">

      {/* ═══════════ Entrance Swinging Board Banner ═══════════ */}
      <EntranceBanner 
        isOpen={showEntranceBanner} 
        onClose={() => setShowEntranceBanner(false)} 
        onBookClick={() => {
          setShowEntranceBanner(false);
          changeTab("request");
        }}
      />

      {/* ═══════════ Booking Success Glass Modal ═══════════ */}
      {bookingSuccess && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="glass-strong rounded-3xl p-8 max-w-sm text-center glass-shadow-lg animate-modal-in relative overflow-hidden">

            <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-teal-100 relative">
              {/* Spreading green flasks/particles */}
              <span className="absolute w-2 h-2 rounded-full bg-emerald-500 animate-flask-1"></span>
              <span className="absolute w-1.5 h-1.5 rounded-full bg-emerald-400 animate-flask-2"></span>
              <span className="absolute w-2 h-2 rounded-full bg-teal-500 animate-flask-3"></span>
              <span className="absolute w-1.5 h-1.5 rounded-full bg-emerald-600 animate-flask-4"></span>
              <span className="absolute w-2 h-2 rounded-full bg-emerald-300 animate-flask-5"></span>
              <span className="absolute w-1.5 h-1.5 rounded-full bg-teal-400 animate-flask-6"></span>

              <svg className="w-10 h-10 z-10 animate-tick-spin" viewBox="0 0 52 52">
                <circle className="animate-checkmark-circle animate-circle-fill stroke-primary stroke-[4]" cx="26" cy="26" r="23" fill="none" />
                <path className="animate-checkmark-check stroke-white stroke-[4] stroke-linecap-round" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
              </svg>
            </div>
            <h3 className="text-xl font-extrabold text-white mb-2">Request Submitted</h3>
            {latestApptNo && (
              <div className="mb-4 inline-block px-4 py-1.5 bg-teal-50 text-teal-700 border border-teal-200 font-mono font-bold text-xs rounded-xl">
                Appt No: {latestApptNo}
              </div>
            )}
            <p className="text-xs text-white mb-6 leading-relaxed">
              Your consultation request has been successfully recorded. Our clinical staff will review and confirm your schedule.
            </p>
            <button 
              onClick={() => {
                setBookingSuccess(false);
                setLatestApptNo("");
                changeTab("records");
              }}
              className="w-full py-3.5 bg-gradient-to-r from-teal-600 to-emerald-500 text-white font-extrabold rounded-2xl hover:from-teal-700 hover:to-emerald-600 active:scale-[0.99] transition-all cursor-pointer shadow-lg shadow-teal-600/20"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* ═══════════ DESKTOP SIDEBAR (Glass) ═══════════ */}
      <aside className="hidden md:flex md:w-64 glass-sidebar flex-col shrink-0 p-6 justify-between h-screen sticky top-0">
        <div className="space-y-8">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 rounded-xl bg-teal-500/15 blur-lg scale-125" />
              <img src="/hero.png" alt="Healthy Eye Clinic Logo" className="relative w-10 h-10 object-contain rounded-xl shadow-sm border border-white/40" />
            </div>
            <div>
              <h1 className="text-sm font-black text-teal-400 leading-snug tracking-tight">Healthy Eye Clinic</h1>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => changeTab(item.id)}
                className={`relative flex items-center gap-3 w-full py-3 px-4 rounded-2xl font-bold text-xs transition-all cursor-pointer duration-200 ${
                  activeTab === item.id 
                    ? "bg-gradient-to-r from-teal-600 to-emerald-500 text-white shadow-lg shadow-teal-600/20" 
                    : "text-white hover:bg-white/10 hover:text-white hover:shadow-sm"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Logout/Sign In */}
        {user ? (
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full py-3 px-4 rounded-2xl font-bold text-xs text-white hover:bg-rose-500/15 hover:text-rose-400 transition-all cursor-pointer duration-200"
          >
            <LogOut size={18} />
            <span>Log Out</span>
          </button>
        ) : (
          <button 
            onClick={() => navigateTo ? navigateTo("/login") : setShowLoginModal(true)}
            className="flex items-center gap-3 w-full py-3 px-4 rounded-2xl font-bold text-xs text-teal-400 bg-teal-500/15 hover:bg-teal-500/25 border border-teal-500/25 transition-all cursor-pointer duration-200"
          >
            <User size={18} />
            <span>Sign In</span>
          </button>
        )}
      </aside>

      {/* ═══════════ MAIN WORKSPACE ═══════════ */}
      <div className="flex-grow flex flex-col min-h-screen">
        
        {/* MOBILE HEADER (Glass) */}
        <header className="md:hidden sticky top-0 z-30 w-full flex justify-between items-center py-3.5 px-4 glass-nav glass-shadow">
          <div className="flex items-center gap-2">
            <img src="/hero.png" alt="Healthy Eye Clinic Logo" className="w-8 h-8 object-contain rounded-xl shadow-sm border border-white/40" />
            <h1 className="text-xs font-black text-teal-400 leading-tight">Healthy Eye Clinic</h1>
          </div>
          
          <div className="flex items-center gap-2">
            {user ? (
              <button onClick={handleLogout} className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-white hover:text-rose-400 hover:bg-rose-500/15 transition-all active:scale-95 cursor-pointer" title="Log Out">
                <LogOut size={16} />
              </button>
            ) : (
              <button onClick={() => navigateTo ? navigateTo("/login") : setShowLoginModal(true)} className="py-1.5 px-3 rounded-xl bg-teal-500/15 text-teal-400 text-xs font-bold hover:bg-teal-500/25 transition-all active:scale-95 cursor-pointer border border-teal-500/25" title="Sign In">
                Sign In
              </button>
            )}
          </div>
        </header>

        {/* Dynamic Page Tab Display */}
        <main className="flex-grow p-4 md:p-8 max-w-4xl w-full mx-auto pb-36 md:pb-8">
          <ErrorBoundary key={activeTab}>
            {activeTab === "home" && (
              <HomeTab 
                user={user} 
                appointments={appointments} 
                patientMrno={patientMrno}
                setActiveTab={changeTab} 
                stackIndex={stackIndex} 
                setStackIndex={setStackIndex} 
              />
            )}

            {activeTab === "request" && (
              <BookTab 
                patientName={patientName}
                setPatientName={setPatientName}
                dob={dob}
                age={age}
                bloodGroup={bloodGroup}
                setBloodGroup={setBloodGroup}
                gender={gender}
                setGender={setGender}
                patientPhone={patientPhone}
                setPatientPhone={setPatientPhone}
                address={address}
                setAddress={setAddress}
                bookingDate={bookingDate}
                setBookingDate={setBookingDate}
                bookingTime={bookingTime}
                setBookingTime={setBookingTime}
                loading={loading}
                handleBookAppointment={handleBookAppointment}
                handleDobChange={handleDobChange}
                getAvailableTimeSlots={getAvailableTimeSlots}
                allTimeSlots={allTimeSlots}
              />
            )}

            {activeTab === "records" && (
              <RecordsTab 
                appointments={appointments} 
                patientMrno={patientMrno}
                handleCancelAppointment={handleCancelAppointment} 
              />
            )}

            {activeTab === "info" && (
              <InfoTab />
            )}

            {activeTab === "profile" && (
              <ProfileTab 
                user={user} 
                appointments={appointments}
                patientMrno={patientMrno}
                handleSignOut={handleSignOut}
              />
            )}
          </ErrorBoundary>
        </main>

        {/* Footer */}
        <footer className="w-full max-w-4xl mx-auto px-4 md:px-8 pb-36 md:pb-6 pt-2 text-center">
          <div className="border-t border-white/10 pt-4">
            <p className="text-[10px] text-white font-medium tracking-wide">
              © {new Date().getFullYear()} <span className="text-teal-400 font-bold">Healthy Eye Clinic</span>. All rights reserved.
            </p>
          </div>
        </footer>

        {/* ═══════════ MOBILE FLOATING DOCK (Glass) ═══════════ */}
        <nav className="md:hidden fixed bottom-5 left-1/2 -translate-x-1/2 glass-nav glass-shadow-lg flex justify-around items-center py-2 px-3 z-40 w-[92%] max-w-sm rounded-2xl">
          {navItems.map(item => (
            <button 
              key={item.id}
              onClick={() => changeTab(item.id)}
              className={`flex flex-col items-center gap-0.5 py-1.5 px-2.5 rounded-xl transition-all duration-200 active:scale-95 cursor-pointer ${
                activeTab === item.id 
                  ? "text-teal-400 bg-teal-500/20 shadow-sm" 
                  : "text-white hover:text-white"
              }`}
            >
              {item.icon}
              <span className="text-[9px] font-extrabold">{item.label.split(" ")[0]}</span>
            </button>
          ))}
        </nav>

        {/* ═══════════ Login Modal (Glass) ═══════════ */}
        {showLoginModal && (
          <Login showMsg={showMsg} onGuestClick={() => setShowLoginModal(false)} />
        )}

      </div>
    </div>
  );
}
