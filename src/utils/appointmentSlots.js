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

