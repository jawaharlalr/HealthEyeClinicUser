import { useState, useEffect, useRef, useCallback } from "react";
import { 
  Calendar, Clock, User, LogOut, CheckCircle, Home, Info 
} from "lucide-react";
import { auth, db } from "../firebase";
import { signOut } from "firebase/auth";
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  doc, 
  updateDoc
} from "firebase/firestore";

// Import modular subcomponents
import HomeTab from "./HomeTab";
import BookTab from "./BookTab";
import RecordsTab from "./RecordsTab";
import InfoTab from "./InfoTab";
import ProfileTab from "./ProfileTab";

export default function Dashboard({ user, showMsg }) {
  const [activeTab, setActiveTab] = useState("home"); // home, request, records, profile
  const [loading, setLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [latestApptNo, setLatestApptNo] = useState("");

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

  useEffect(() => {
    if (user) {
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
      setAppointments(appts.sort((a, b) => new Date(b.date) - new Date(a.date)));

      // 2. Fetch all appointments from Firestore to check taken time slots
      const allSnapshot = await getDocs(appointmentsRef);
      const allAppts = allSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setAllAppointments(allAppts);
    } catch (err) {
      console.error("Error fetching data from Firestore:", err);
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
    if (!patientName || !dob || !age || !bookingDate || !bookingTime || !patientPhone || !address) {
      return showMsg("error", "Please fill in all details.");
    }
    
    const [year, month, day] = bookingDate.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    if (date.getDay() === 1) {
      return showMsg("error", "The clinic is closed on Mondays.");
    }
    
    setLoading(true);

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
      createdAt: new Date().toISOString()
    };

    try {
      // Prompt for notifications on submission to ensure they receive alerts
      if (typeof window !== "undefined" && "Notification" in window) {
        Notification.requestPermission();
      }

      const appointmentsRef = collection(db, "appointments");
      await addDoc(appointmentsRef, apptData);
      
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
    } finally {
      setLoading(false);
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
    <div className="min-h-screen w-full bg-slate-50/30 flex flex-col md:flex-row relative overflow-hidden">
      {/* Premium Glassmorphic Background Mesh Glows */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-primary/8 blur-[120px] animate-pulse duration-[10000ms]"></div>
        <div className="absolute -bottom-[10%] -right-[10%] w-[50vw] h-[50vw] rounded-full bg-secondary/6 blur-[120px] animate-pulse duration-[15000ms] delay-3000"></div>
        <div className="absolute top-[30%] right-[20%] w-[30vw] h-[30vw] rounded-full bg-primary-light/40 blur-[100px] animate-pulse duration-[12000ms] delay-1000"></div>
      </div>

      {/* Booking Success Overlay */}
      {bookingSuccess && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white/70 backdrop-blur-xl border border-white/45 rounded-3xl p-8 max-w-sm text-center shadow-[0_20px_50px_rgba(0,0,0,0.15)] animate-modal-in">
            <div className="w-16 h-16 bg-primary-light/60 backdrop-blur-sm text-primary rounded-full flex items-center justify-center mx-auto mb-4 border border-primary/20 animate-check-bounce">
              <CheckCircle size={32} />
            </div>
            <h3 className="text-xl font-extrabold text-slate-800 mb-2">Request Submitted</h3>
            {latestApptNo && (
              <div className="mb-4 inline-block px-4 py-1.5 bg-primary-light/60 backdrop-blur-sm text-primary border border-primary/25 font-mono font-bold text-xs rounded-xl animate-appt-pulse">
                Appt No: {latestApptNo}
              </div>
            )}
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              Your consultation request has been successfully recorded. Our clinical staff will review and confirm your schedule.
            </p>
            <button 
              onClick={() => {
                setBookingSuccess(false);
                setLatestApptNo("");
                setActiveTab("records");
              }}
              className="w-full py-3 bg-primary text-white font-extrabold rounded-xl hover:bg-primary-hover active:scale-[0.99] transition-all cursor-pointer shadow-md shadow-primary/10"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* DESKTOP SIDEBAR NAVIGATION (hidden on mobile) */}
      <aside className="hidden md:flex md:w-64 bg-white/50 backdrop-blur-xl border-r border-white/45 flex-col shrink-0 p-6 justify-between h-screen sticky top-0">
        <div className="space-y-8">
          {/* Logo/Clinic Name */}
          <div className="flex items-center gap-3">
            <img src="/hero.png" alt="Healthy Eye Clinic Logo" className="w-10 h-10 object-contain rounded-xl shadow-sm border border-slate-100" />
            <div>
              <h1 className="text-sm font-black text-primary leading-snug tracking-tight">Healthy Eye Clinic</h1>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1.5">
            {[
              { id: "home", label: "Home", icon: <Home size={18} /> },
              { id: "request", label: "Book Consultation", icon: <Calendar size={18} /> },
              { id: "records", label: "Medical Logs", icon: <Clock size={18} /> },
              { id: "info", label: "Clinic Details", icon: <Info size={18} /> },
              { id: "profile", label: "My Profile", icon: <User size={18} /> }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative flex items-center gap-3 w-full py-3 px-4 rounded-xl font-bold text-xs transition-all cursor-pointer hover:translate-x-1 duration-200 ${
                  activeTab === item.id 
                    ? "bg-primary text-white shadow-md shadow-primary/20" 
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                }`}
              >
                {activeTab === item.id && (
                  <span className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-secondary rounded-r" />
                )}
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Logout at bottom */}
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 w-full py-3 px-4 rounded-xl font-bold text-xs text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-all cursor-pointer hover:translate-x-1 duration-200"
        >
          <LogOut size={18} />
          <span>Log Out</span>
        </button>
      </aside>

      {/* MAIN CONTAINER WORKSPACE */}
      <div className="flex-grow flex flex-col min-h-screen">
        
        {/* MOBILE HEADER (hidden on desktop) */}
        <header className="md:hidden sticky top-0 z-30 w-full flex justify-between items-center py-4 px-4 bg-white/60 backdrop-blur-xl border-b border-white/45 shadow-[0_4px_30px_rgba(0,0,0,0.03)]">
          <div className="flex items-center gap-3">
            <img src="/hero.png" alt="Healthy Eye Clinic Logo" className="w-10 h-10 object-contain rounded-xl shadow-sm border border-slate-100" />
            <div>
              <h1 className="text-sm font-black text-primary leading-tight">Healthy Eye Clinic</h1>
            </div>
          </div>
          <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-rose-600 transition-all active:scale-95" title="Log Out">
            <LogOut size={18} />
          </button>
        </header>

        {/* Dynamic Page Tab Display */}
        <main className="flex-grow p-4 md:p-8 max-w-4xl w-full mx-auto pb-36 md:pb-8">
          {activeTab === "home" && (
            <HomeTab 
              user={user} 
              appointments={appointments} 
              setActiveTab={setActiveTab} 
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
            />
          )}
        </main>

        {/* Footer */}
        <footer className="w-full max-w-4xl mx-auto px-4 md:px-8 pb-36 md:pb-6 pt-2 text-center">
          <div className="border-t border-slate-200/60 pt-4">
            <p className="text-[10px] text-slate-400 font-medium tracking-wide">
              © {new Date().getFullYear()} <span className="text-primary font-bold">Healthy Eye Clinic</span>. All rights reserved.
            </p>
          </div>
        </footer>

        {/* MOBILE FLOATING DOCK NAVIGATION (hidden on desktop) */}
        <nav className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 bg-white/60 backdrop-blur-xl border border-white/45 shadow-[0_12px_40px_rgba(0,0,0,0.08)] flex justify-around items-center py-2.5 px-4 z-40 w-[92%] max-w-sm rounded-2xl">
          <button 
            onClick={() => setActiveTab("home")}
            className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all active:scale-95 cursor-pointer ${
              activeTab === "home" ? "text-primary bg-primary-light" : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <Home size={18} />
            <span className="text-[9px] font-extrabold">Home</span>
          </button>

          <button 
            onClick={() => setActiveTab("request")}
            className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all active:scale-95 cursor-pointer ${
              activeTab === "request" ? "text-primary bg-primary-light" : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <Calendar size={18} />
            <span className="text-[9px] font-extrabold">Book</span>
          </button>

          <button 
            onClick={() => setActiveTab("records")}
            className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all active:scale-95 cursor-pointer ${
              activeTab === "records" ? "text-primary bg-primary-light" : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <Clock size={18} />
            <span className="text-[9px] font-extrabold">Records</span>
          </button>

          <button 
            onClick={() => setActiveTab("info")}
            className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all active:scale-95 cursor-pointer ${
              activeTab === "info" ? "text-primary bg-primary-light" : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <Info size={18} />
            <span className="text-[9px] font-extrabold">Info</span>
          </button>

          <button 
            onClick={() => setActiveTab("profile")}
            className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all active:scale-95 cursor-pointer ${
              activeTab === "profile" ? "text-primary bg-primary-light" : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <User size={18} />
            <span className="text-[9px] font-extrabold">Profile</span>
          </button>
        </nav>

      </div>
    </div>
  );
}
