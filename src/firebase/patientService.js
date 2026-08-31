import { db } from './firebaseConfig';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { cleanMobileInput } from '../utils/validation';

/**
 * Searches for an existing patient profile by 10-digit mobile number.
 */
export async function findPatientByMobile(mobileNumber) {
  if (!mobileNumber) return null;
  const cleanMobile = cleanMobileInput(mobileNumber);
  if (cleanMobile.length !== 10) return null;

  if (!db) {
    const localPatients = JSON.parse(localStorage.getItem('hec_patients') || '[]');
    return localPatients.find(p => p.mobile === cleanMobile) || null;
  }

  try {
    const patientsRef = collection(db, 'patients');
    const q = query(patientsRef, where('mobile', '==', cleanMobile));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const patientDoc = querySnapshot.docs[0];
      return { id: patientDoc.id, ...patientDoc.data() };
    }
    return null;
  } catch (error) {
    console.warn("Patient lookup notice:", error.message);
    const localPatients = JSON.parse(localStorage.getItem('hec_patients') || '[]');
    return localPatients.find(p => p.mobile === cleanMobile) || null;
  }
}

/**
 * Fetches a patient record by patientId.
 */
export async function getPatientById(patientId) {
  if (!patientId) return null;

  if (!db) {
    const localPatients = JSON.parse(localStorage.getItem('hec_patients') || '[]');
    return localPatients.find(p => p.id === patientId || p.patientId === patientId) || null;
  }

  try {
    const patientRef = doc(db, 'patients', patientId);
    const docSnap = await getDoc(patientRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    console.warn("getPatientById notice:", error.message);
    return null;
  }
}
