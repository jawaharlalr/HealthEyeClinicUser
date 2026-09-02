import { db } from './firebaseConfig';
import { 
  collection, 
  doc, 
  runTransaction, 
  query, 
  where, 
  getDocs, 
  getDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { getSlotKey, generateAppointmentId } from '../utils/appointmentSlots';
import { cleanMobileInput } from '../utils/validation';


/**
 * Fetches all booked slot IDs for a specific date (YYYY-MM-DD)
 */
export async function getBookedSlotsForDate(dateStr) {
  if (!dateStr) return [];

  if (db) {
    try {
      const appointmentsRef = collection(db, 'appointments');
      const q = query(
        appointmentsRef, 
        where('date', '==', dateStr),
        where('status', 'in', ['booked', 'confirmed'])
      );
      const querySnapshot = await getDocs(q);
      
      const bookedSlotIds = new Set();
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        if (data.slotId) {
          bookedSlotIds.add(data.slotId);
        }
      });

      const slotLocksRef = collection(db, 'slot_locks');
      const lockQuery = query(slotLocksRef, where('date', '==', dateStr));
      const lockSnapshot = await getDocs(lockQuery);
      lockSnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        if (data.slotId) {
          bookedSlotIds.add(data.slotId);
        }
      });

      return Array.from(bookedSlotIds);
    } catch (error) {
      console.warn("Availability notice:", error.message);
    }
  }

  const localAppointments = JSON.parse(localStorage.getItem('hec_appointments') || '[]');
  const localBookedSlotIds = localAppointments
    .filter(app => app.date === dateStr && app.status !== 'cancelled')
    .map(app => app.slotId);

  return localBookedSlotIds;
}

/**
 * Fetches past & active appointments for a patient by 10-digit mobile number.
 */
export async function getAppointmentsByMobile(mobileNumber) {
  if (!mobileNumber) return [];
  const cleanMobile = cleanMobileInput(mobileNumber);
  if (cleanMobile.length !== 10) return [];

  if (db) {
    try {
      const appointmentsRef = collection(db, 'appointments');
      const q = query(appointmentsRef, where('mobile', '==', cleanMobile));
      const querySnapshot = await getDocs(q);
      
      const list = [];
      querySnapshot.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...docSnap.data() });
      });

      // Sort by date descending
      list.sort((a, b) => (a.date < b.date ? 1 : -1));
      return list;
    } catch (error) {
      console.warn("getAppointmentsByMobile notice:", error.message);
    }
  }

  const localAppointments = JSON.parse(localStorage.getItem('hec_appointments') || '[]');
  return localAppointments
    .filter(app => app.mobile === cleanMobile)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

/**
 * Atomic Appointment Booking using Firestore Transaction
 */
export async function bookAppointmentAtomic(bookingDetails) {
  const {
    date,
    slot,
    patientType,
    fullName,
    mobile,
    email,
    dateOfBirth,
    gender,
    bloodGroup,
    bloodGroupOther,
    address,
    patientId: existingPatientId
  } = bookingDetails;

  const dateStr = date;
  const slotId = slot.id;
  const slotKey = getSlotKey(dateStr, slotId);
  const appointmentId = generateAppointmentId();

  const normalizedMobile = cleanMobileInput(mobile);
  const patientId = existingPatientId || `PAT-${normalizedMobile}`;

  const timestamp = new Date().toISOString();

  const appointmentData = {
    appointmentId,
    patientId,
    patientName: fullName.trim(),
    mobile: normalizedMobile,
    email: email.trim(),
    patientType,
    date: dateStr,
    slotId: slot.id,
    startTime: slot.startTime,
    endTime: slot.endTime,
    slot: slot.label,
    status: 'Booked',
    slotKey,
    createdAt: timestamp,
    updatedAt: timestamp
  };

  const patientData = {
    patientId,
    fullName: fullName.trim(),
    mobile: normalizedMobile,
    email: email.trim(),
    dateOfBirth: dateOfBirth || '',
    gender: gender || '',
    bloodGroup: bloodGroup || '',
    bloodGroupOther: bloodGroup === 'Other / Rare' ? (bloodGroupOther ? bloodGroupOther.trim() : '') : '',
    address: address.trim(),
    updatedAt: timestamp,
    createdAt: timestamp
  };

  if (db) {
    try {
      await runTransaction(db, async (transaction) => {
        const lockRef = doc(db, 'slot_locks', slotKey);
        const lockDoc = await transaction.get(lockRef);

        if (lockDoc.exists()) {
          throw new Error("THIS_SLOT_ALREADY_BOOKED");
        }

        transaction.set(lockRef, {
          bookedAt: serverTimestamp(),
          appointmentId,
          patientId,
          date: dateStr,
          slotId
        });

        const appointmentRef = doc(db, 'appointments', appointmentId);
        transaction.set(appointmentRef, {
          ...appointmentData,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });

        const patientRef = doc(db, 'patients', patientId);
        transaction.set(patientRef, {
          ...patientData,
          updatedAt: serverTimestamp()
        }, { merge: true });
      });

      saveLocalAppointment(appointmentData, patientData);



      return {
        success: true,
        appointment: { ...appointmentData, patientDetails: patientData },
        message: "Appointment confirmed!"
      };
    } catch (error) {
      if (error.message === "THIS_SLOT_ALREADY_BOOKED" || error.code === 'already-exists') {
        return {
          success: false,
          error: "This time is no longer available. Please choose another time.",
          code: "SLOT_TAKEN"
        };
      }
      return {
        success: false,
        error: "Unable to complete your appointment. Please try again.",
        code: "BOOKING_ERROR"
      };
    }
  }

  const localAppointments = JSON.parse(localStorage.getItem('hec_appointments') || '[]');
  const isConflict = localAppointments.some(
    app => app.slotKey === slotKey && app.status !== 'Cancelled'
  );

  if (isConflict) {
    return {
      success: false,
      error: "This time is no longer available. Please choose another time.",
      code: "SLOT_TAKEN"
    };
  }

  saveLocalAppointment(appointmentData, patientData);



  return {
    success: true,
    appointment: { ...appointmentData, patientDetails: patientData },
    message: "Appointment confirmed!"
  };
}

function saveLocalAppointment(appointmentData, patientData) {
  const localAppointments = JSON.parse(localStorage.getItem('hec_appointments') || '[]');
  localAppointments.push(appointmentData);
  localStorage.setItem('hec_appointments', JSON.stringify(localAppointments));

  const localPatients = JSON.parse(localStorage.getItem('hec_patients') || '[]');
  const pIndex = localPatients.findIndex(p => p.patientId === patientData.patientId);
  if (pIndex >= 0) {
    localPatients[pIndex] = { ...localPatients[pIndex], ...patientData };
  } else {
    localPatients.push(patientData);
  }
  localStorage.setItem('hec_patients', JSON.stringify(localPatients));
}

/**
 * Retrieves appointment details by appointmentId
 */
export async function getAppointmentById(appointmentId) {
  if (!appointmentId) return null;

  if (db) {
    try {
      const appRef = doc(db, 'appointments', appointmentId);
      const snap = await getDoc(appRef);
      if (snap.exists()) {
        const appData = snap.data();
        const patientRef = doc(db, 'patients', appData.patientId);
        const patientSnap = await getDoc(patientRef);
        const patientDetails = patientSnap.exists() ? patientSnap.data() : null;

        return { id: snap.id, ...appData, patientDetails };
      }
    } catch (err) {
      console.warn("getAppointmentById notice:", err.message);
    }
  }

  const localAppointments = JSON.parse(localStorage.getItem('hec_appointments') || '[]');
  const localApp = localAppointments.find(a => a.appointmentId === appointmentId);
  if (localApp) {
    const localPatients = JSON.parse(localStorage.getItem('hec_patients') || '[]');
    const patientDetails = localPatients.find(p => p.patientId === localApp.patientId);
    return { ...localApp, patientDetails };
  }
  return null;
}

/**
 * Cancels an appointment and releases its slot lock atomically
 */
export async function cancelAppointmentAtomic(appointmentId) {
  if (!appointmentId) return { success: false, error: 'Appointment ID is required' };

  let cancelledAppData = null;

  if (db) {
    try {
      const appRef = doc(db, 'appointments', appointmentId);
      const appSnap = await getDoc(appRef);
      if (appSnap.exists()) {
        cancelledAppData = appSnap.data();
        await updateDoc(appRef, {
          status: 'cancelled',
          updatedAt: serverTimestamp()
        });

        if (cancelledAppData.slotKey) {
          const lockRef = doc(db, 'slot_locks', cancelledAppData.slotKey);
          await deleteDoc(lockRef).catch(err => console.warn("Lock release notice:", err));
        }
      }
      cancelLocalAppointment(appointmentId);



      return { success: true, message: 'Appointment cancelled successfully' };
    } catch (error) {
      console.warn("cancelAppointment notice:", error.message);
    }
  }

  cancelLocalAppointment(appointmentId);

  return { success: true, message: 'Appointment cancelled successfully' };
}

function cancelLocalAppointment(appointmentId) {
  const localAppointments = JSON.parse(localStorage.getItem('hec_appointments') || '[]');
  let targetApp = null;
  const updated = localAppointments.map(app => {
    if (app.appointmentId === appointmentId) {
      targetApp = app;
      return { ...app, status: 'cancelled' };
    }
    return app;
  });
  localStorage.setItem('hec_appointments', JSON.stringify(updated));
  return targetApp;
}

