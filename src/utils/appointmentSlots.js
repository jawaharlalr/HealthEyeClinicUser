export const CLINIC_INFO = {
  name: 'Healthy Eye Clinic & Opticals',
  tagline: 'Healthy Eyes, Clear Vision, Better Life',
  days: 'Tuesday – Sunday',
  closedDay: 'Monday',
  timings: '11:00 AM – 4:00 PM',
  phone: '80720 97048',
  address: '12A, Surya Nagar, 1st Cross Street, Medavakkam, Chennai – 600100'
};

export const CLINIC_SLOTS = [
  { id: '11-00-12-00', label: '11:00 AM – 12:00 PM', startTime: '11:00 AM', endTime: '12:00 PM' },
  { id: '12-00-13-00', label: '12:00 PM – 1:00 PM', startTime: '12:00 PM', endTime: '1:00 PM' },
  { id: '13-00-14-00', label: '1:00 PM – 2:00 PM', startTime: '1:00 PM', endTime: '2:00 PM' },
  { id: '14-00-15-00', label: '2:00 PM – 3:00 PM', startTime: '2:00 PM', endTime: '3:00 PM' },
  { id: '15-00-16-00', label: '3:00 PM – 4:00 PM', startTime: '3:00 PM', endTime: '4:00 PM' }
];

export function isMonday(dateString) {
  if (!dateString) return false;
  const parts = dateString.split('-');
  if (parts.length !== 3) return false;
  const date = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
  return date.getDay() === 1;
}

export function isPastDate(dateString) {
  if (!dateString) return false;
  const parts = dateString.split('-');
  if (parts.length !== 3) return false;
  const selected = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return selected < today;
}

export function formatReadableDate(dateString) {
  if (!dateString) return '';
  const parts = dateString.split('-');
  if (parts.length !== 3) return dateString;
  const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export function getSlotKey(dateStr, slotId) {
  return `${dateStr}_${slotId}`;
}

export function generateAppointmentId() {
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  return `HEC-${randomNum}`;
}

/**
 * Calculates real-time dynamic clinic opening status.
 */
export function getDynamicClinicStatus() {
  const now = new Date();
  const day = now.getDay(); // 0: Sun, 1: Mon, 2: Tue, 3: Wed, 4: Thu, 5: Fri, 6: Sat
  const hour = now.getHours();

  // Monday: Closed all day -> Opens tomorrow at 11:00 AM (Tuesday)
  if (day === 1) {
    return {
      isOpen: false,
      text: 'Opens tomorrow at 11:00 AM'
    };
  }

  // Tuesday – Sunday
  if (hour < 11) {
    return {
      isOpen: false,
      text: 'Opens today at 11:00 AM'
    };
  } else if (hour >= 11 && hour < 16) {
    return {
      isOpen: true,
      text: 'Open now'
    };
  } else {
    if (day === 0) {
      // Sunday after 4 PM -> Opens Tuesday at 11:00 AM
      return {
        isOpen: false,
        text: 'Opens Tuesday at 11:00 AM'
      };
    } else {
      // Tuesday – Saturday after 4 PM -> Opens tomorrow at 11:00 AM
      return {
        isOpen: false,
        text: 'Opens tomorrow at 11:00 AM'
      };
    }
  }
}
