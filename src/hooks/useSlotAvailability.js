import { useState, useEffect } from 'react';
import { getBookedSlotsForDate } from '../firebase/appointmentService';
import { isMonday, isPastDate, isSlotInPast } from '../utils/appointmentSlots';

/**
 * Custom hook for fetching and managing booked slots for a given date
 * with real-time periodic updates and automatic past-slot deselect.
 */
export function useSlotAvailability(selectedDate, selectedSlot, setSelectedSlot) {
  const [bookedSlotIds, setBookedSlotIds] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [timeTick, setTimeTick] = useState(0);

  // Set up periodic real-time tick (every 15 seconds) and window focus/visibility listeners
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeTick(t => t + 1);
    }, 15000);

    const handleFocus = () => setTimeTick(t => t + 1);
    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleFocus);

    return () => {
      clearInterval(timer);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleFocus);
    };
  }, []);

  // Fetch booked slots from Firebase / Local Storage
  useEffect(() => {
    if (selectedDate && !isMonday(selectedDate) && !isPastDate(selectedDate)) {
      setLoadingSlots(true);
      getBookedSlotsForDate(selectedDate)
        .then(slots => {
          setBookedSlotIds(slots);
        })
        .catch(err => {
          console.warn("Availability notice:", err);
          setBookedSlotIds([]);
        })
        .finally(() => {
          setLoadingSlots(false);
        });
    } else {
      setBookedSlotIds([]);
    }
  }, [selectedDate]);

  // Real-time protection: If selectedSlot is booked or has passed, clear selection immediately
  useEffect(() => {
    if (selectedSlot && selectedDate) {
      const isBooked = bookedSlotIds.includes(selectedSlot.id);
      const isPassed = isSlotInPast(selectedDate, selectedSlot.startTime);
      if (isBooked || isPassed) {
        if (typeof setSelectedSlot === 'function') {
          setSelectedSlot(null);
        }
      }
    }
  }, [selectedDate, selectedSlot, bookedSlotIds, timeTick, setSelectedSlot]);

  return { bookedSlotIds, loadingSlots, timeTick };
}

export default useSlotAvailability;
