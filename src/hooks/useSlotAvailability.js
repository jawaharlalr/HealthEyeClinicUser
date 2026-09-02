import { useState, useEffect } from 'react';
import { getBookedSlotsForDate } from '../firebase/appointmentService';
import { isMonday, isPastDate } from '../utils/appointmentSlots';

/**
 * Custom hook for fetching and managing booked slots for a given date
 */
export function useSlotAvailability(selectedDate, selectedSlot, setSelectedSlot) {
  const [bookedSlotIds, setBookedSlotIds] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  useEffect(() => {
    if (selectedDate && !isMonday(selectedDate) && !isPastDate(selectedDate)) {
      setLoadingSlots(true);
      getBookedSlotsForDate(selectedDate)
        .then(slots => {
          setBookedSlotIds(slots);
          if (selectedSlot && slots.includes(selectedSlot.id)) {
            if (typeof setSelectedSlot === 'function') {
              setSelectedSlot(null);
            }
          }
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
  }, [selectedDate, selectedSlot, setSelectedSlot]);

  return { bookedSlotIds, loadingSlots };
}

export default useSlotAvailability;
