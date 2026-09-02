export const CLINIC_INFO = {
  name: 'Healthy Eye Clinic & Opticals',
  tagline: 'Healthy Eyes, Clear Vision, Better Life',
  optometrist: 'Nandhini K',
  optometristTitle: 'Optometrist Nandhini K',
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

/**
 * Returns current date string (YYYY-MM-DD) in Asia/Kolkata timezone.
 */
export function getTodayDateStrIST() {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
  return formatter.format(new Date());
}

/**
 * Returns current time details in Asia/Kolkata (IST) timezone.
 */
export function getNowInIST() {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });

  const parts = formatter.formatToParts(now);
  let year = '', month = '', day = '', hour = '0', minute = '0';
  for (const part of parts) {
    if (part.type === 'year') year = part.value;
    if (part.type === 'month') month = part.value;
    if (part.type === 'day') day = part.value;
    if (part.type === 'hour') hour = part.value;
    if (part.type === 'minute') minute = part.value;
  }

  const dateStr = `${year}-${month}-${day}`;
  const hoursNum = parseInt(hour, 10);
  const minutesNum = parseInt(minute, 10);

  return {
    dateStr,
    year: parseInt(year, 10),
    month: parseInt(month, 10),
    day: parseInt(day, 10),
    hours: hoursNum,
    minutes: minutesNum,
    totalMinutes: hoursNum * 60 + minutesNum
  };
}

/**
 * Converts a slot time string like "11:00 AM" or "2:00 PM" into total minutes from midnight.
 */
export function parseSlotTimeToMinutes(timeStr) {
  if (!timeStr) return 0;
  const match = String(timeStr).match(/^(\d+):(\d+)\s*(AM|PM)$/i);
  if (!match) return 0;
  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const period = match[3].toUpperCase();

  if (period === 'PM' && hours < 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;

  return hours * 60 + minutes;
}

/**
 * Checks if a given date string (YYYY-MM-DD) is Monday.
 */
export function isMonday(dateString) {
  if (!dateString) return false;
  const parts = dateString.split('-');
  if (parts.length !== 3) return false;
  const date = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
  return date.getDay() === 1;
}

/**
 * Checks if date is today in Asia/Kolkata timezone.
 */
export function isToday(dateString) {
  if (!dateString) return false;
  return dateString === getTodayDateStrIST();
}

/**
 * Checks if date is strictly before today in Asia/Kolkata timezone.
 */
export function isPastDate(dateString) {
  if (!dateString) return false;
  const todayIST = getTodayDateStrIST();
  return dateString < todayIST;
}

/**
 * Real-time slot availability check in Asia/Kolkata timezone.
 * Returns true if the slot's start time on dateString has already passed.
 */
export function isSlotInPast(dateString, startTimeStr) {
  if (!dateString) return false;
  const todayIST = getTodayDateStrIST();

  if (dateString < todayIST) return true;
  if (dateString > todayIST) return false;

  // Date is TODAY in Asia/Kolkata -> compare start time against current IST time
  const nowIST = getNowInIST();
  const slotMinutes = parseSlotTimeToMinutes(startTimeStr);

  return slotMinutes <= nowIST.totalMinutes;
}

/**
 * Returns the default initial date for appointment booking:
 * Today if today is a working day and has remaining future slots;
 * otherwise the next valid clinic working day.
 */
export function getInitialAppointmentDate() {
  const nowIST = getNowInIST();
  const todayStr = nowIST.dateStr;

  // Check if today still has future slots (latest slot is 3:00 PM = 900 minutes)
  const hasRemainingSlotsToday = CLINIC_SLOTS.some(slot => {
    return parseSlotTimeToMinutes(slot.startTime) > nowIST.totalMinutes;
  });

  if (!isMonday(todayStr) && hasRemainingSlotsToday) {
    return todayStr;
  }

  // Advance to next valid working day
  const dateObj = new Date(nowIST.year, nowIST.month - 1, nowIST.day + 1);
  const y = dateObj.getFullYear();
  const m = String(dateObj.getMonth() + 1).padStart(2, '0');
  const d = String(dateObj.getDate()).padStart(2, '0');
  let candidate = `${y}-${m}-${d}`;

  if (isMonday(candidate)) {
    dateObj.setDate(dateObj.getDate() + 1);
    const y2 = dateObj.getFullYear();
    const m2 = String(dateObj.getMonth() + 1).padStart(2, '0');
    const d2 = String(dateObj.getDate()).padStart(2, '0');
    candidate = `${y2}-${m2}-${d2}`;
  }

  return candidate;
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
 * Calculates real-time dynamic clinic opening status in Asia/Kolkata timezone.
 */
export function getDynamicClinicStatus() {
  const now = getNowInIST();
  // Get Day of week for IST date (0: Sun, 1: Mon, ... 6: Sat)
  const dateObj = new Date(now.year, now.month - 1, now.day);
  const day = dateObj.getDay();
  const hour = now.hours;

  if (day === 1) {
    return {
      isOpen: false,
      text: 'Opens tomorrow at 11:00 AM'
    };
  }

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
      return {
        isOpen: false,
        text: 'Opens Tuesday at 11:00 AM'
      };
    } else {
      return {
        isOpen: false,
        text: 'Opens tomorrow at 11:00 AM'
      };
    }
  }
}

/**
 * Generates a Google Calendar Template URL for an appointment
 */
export function generateGoogleCalendarUrl(appointment) {
  if (!appointment || !appointment.date || !appointment.startTime) return '#';
  
  const title = encodeURIComponent(`Eye Appointment - Optometrist Nandhini K (${CLINIC_INFO.name})`);
  const details = encodeURIComponent(
    `Appointment Reference: ${appointment.appointmentId}\n` +
    `Patient: ${appointment.patientName}\n` +
    `Attending Specialist: ${CLINIC_INFO.optometristTitle}\n` +
    `Clinic Phone: ${CLINIC_INFO.phone}`
  );
  const location = encodeURIComponent(`${CLINIC_INFO.name}, ${CLINIC_INFO.address}`);

  try {
    const parseTimeStr = (dateStr, timeStr) => {
      const [year, month, day] = dateStr.split('-').map(Number);
      const match = (timeStr || '').match(/^(\d+):(\d+)\s*(AM|PM)$/i);
      if (!match) return new Date(year, month - 1, day, 11, 0);
      let hours = parseInt(match[1], 10);
      const minutes = parseInt(match[2], 10);
      const period = match[3].toUpperCase();
      if (period === 'PM' && hours < 12) hours += 12;
      if (period === 'AM' && hours === 12) hours = 0;
      return new Date(year, month - 1, day, hours, minutes);
    };

    const startDate = parseTimeStr(appointment.date, appointment.startTime);
    const endDate = parseTimeStr(appointment.date, appointment.endTime || appointment.startTime);
    if (endDate <= startDate) {
      endDate.setTime(startDate.getTime() + 60 * 60 * 1000);
    }

    const toUtcIsoStr = (d) => d.toISOString().replace(/-|:|\.\d\d\d/g, '');
    const dates = `${toUtcIsoStr(startDate)}/${toUtcIsoStr(endDate)}`;
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
  } catch (e) {
    return '#';
  }
}

/**
 * Generates and triggers download of an .ics calendar file
 */
export function downloadIcsFile(appointment) {
  if (!appointment || !appointment.date) return;
  
  try {
    const parseTimeStr = (dateStr, timeStr) => {
      const [year, month, day] = dateStr.split('-').map(Number);
      const match = (timeStr || '').match(/^(\d+):(\d+)\s*(AM|PM)$/i);
      if (!match) return new Date(year, month - 1, day, 11, 0);
      let hours = parseInt(match[1], 10);
      const minutes = parseInt(match[2], 10);
      const period = match[3].toUpperCase();
      if (period === 'PM' && hours < 12) hours += 12;
      if (period === 'AM' && hours === 12) hours = 0;
      return new Date(year, month - 1, day, hours, minutes);
    };

    const startDate = parseTimeStr(appointment.date, appointment.startTime);
    const endDate = parseTimeStr(appointment.date, appointment.endTime || appointment.startTime);
    if (endDate <= startDate) {
      endDate.setTime(startDate.getTime() + 60 * 60 * 1000);
    }

    const toUtcIsoStr = (d) => d.toISOString().replace(/-|:|\.\d\d\d/g, '');

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Healthy Eye Clinic//Appointment//EN',
      'BEGIN:VEVENT',
      `UID:${appointment.appointmentId || Date.now()}@healthyeyeclinic.com`,
      `DTSTAMP:${toUtcIsoStr(new Date())}`,
      `DTSTART:${toUtcIsoStr(startDate)}`,
      `DTEND:${toUtcIsoStr(endDate)}`,
      `SUMMARY:Eye Appointment - Optometrist Nandhini K`,
      `DESCRIPTION:Patient: ${appointment.patientName}\\nReference: ${appointment.appointmentId}\\nSpecialist: Optometrist Nandhini K\\nPhone: ${CLINIC_INFO.phone}`,
      `LOCATION:${CLINIC_INFO.name}\\, ${CLINIC_INFO.address}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `Appointment_${appointment.appointmentId || 'HEC'}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (e) {
    console.error("Error generating ICS file:", e);
  }
}
