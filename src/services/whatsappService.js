import { CLINIC_INFO, formatReadableDate } from '../utils/appointmentSlots';

/**
 * Builds detailed text notification for WhatsApp messaging.
 */
export function buildAppointmentMessage(appointment, type = 'CONFIRMATION') {
  const patientName = appointment.patientName || 'Valued Patient';
  const appDate = formatReadableDate(appointment.date);
  const timeSlot = appointment.slot || `${appointment.startTime || ''} – ${appointment.endTime || ''}`;
  const appId = appointment.appointmentId || 'HEC-REF';

  if (type === 'CANCELLATION') {
    return [
      `❌ *APPOINTMENT CANCELLED* - ${CLINIC_INFO.name}`,
      ``,
      `Hello *${patientName}*,`,
      `Your appointment reference *${appId}* has been cancelled.`,
      ``,
      `*Details:*`,
      `📅 *Date:* ${appDate}`,
      `⏰ *Slot:* ${timeSlot}`,
      `👁️ *Specialist:* ${CLINIC_INFO.optometristTitle}`,
      ``,
      `If you need to rebook or have questions, please contact our clinic at ${CLINIC_INFO.phone}.`
    ].join('\n');
  }

  return [
    `🏥 *APPOINTMENT CONFIRMED* - ${CLINIC_INFO.name}`,
    ``,
    `Dear *${patientName}*,`,
    `Your appointment has been successfully scheduled!`,
    ``,
    `📋 *Appointment Ref:* ${appId}`,
    `📅 *Date:* ${appDate}`,
    `⏰ *Time Slot:* ${timeSlot}`,
    `👁️ *Attending Specialist:* ${CLINIC_INFO.optometristTitle}`,
    `📍 *Location:* ${CLINIC_INFO.address}`,
    `📞 *Clinic Phone:* ${CLINIC_INFO.phone}`,
    ``,
    `*Instructions:*`,
    `• Please arrive 10 minutes prior to your time slot.`,
    `• Bring existing spectacles or eye reports if available.`,
    ``,
    `Thank you for choosing Healthy Eye Clinic & Opticals!`
  ].join('\n');
}

/**
 * Generates a direct WhatsApp (wa.me) URL for client-side messaging.
 */
export function getWhatsAppShareUrl(appointment, type = 'CONFIRMATION') {
  const cleanPhone = CLINIC_INFO.phone.replace(/\s/g, '');
  const messageText = buildAppointmentMessage(appointment, type);
  return `https://wa.me/91${cleanPhone}?text=${encodeURIComponent(messageText)}`;
}

