import { buildAppointmentMessage, getWhatsAppShareUrl } from './whatsappService';
import { CLINIC_INFO } from '../utils/appointmentSlots';

describe('whatsappService', () => {
  const sampleAppointment = {
    appointmentId: 'HEC-998877',
    patientName: 'Anita Kumar',
    mobile: '9876543210',
    email: 'anita@example.com',
    date: '2026-09-05',
    slot: '11:00 AM – 12:00 PM',
    startTime: '11:00 AM',
    endTime: '12:00 PM'
  };

  test('buildAppointmentMessage constructs detailed confirmation text', () => {
    const msg = buildAppointmentMessage(sampleAppointment, 'CONFIRMATION');
    expect(msg).toContain('APPOINTMENT CONFIRMED');
    expect(msg).toContain('Anita Kumar');
    expect(msg).toContain('HEC-998877');
    expect(msg).toContain('Optometrist Nandhini K');
    expect(msg).toContain(CLINIC_INFO.address);
    expect(msg).toContain(CLINIC_INFO.phone);
  });

  test('buildAppointmentMessage constructs detailed cancellation text', () => {
    const msg = buildAppointmentMessage(sampleAppointment, 'CANCELLATION');
    expect(msg).toContain('APPOINTMENT CANCELLED');
    expect(msg).toContain('Anita Kumar');
    expect(msg).toContain('HEC-998877');
    expect(msg).toContain('Optometrist Nandhini K');
  });

  test('getWhatsAppShareUrl constructs valid wa.me URL with encoded message', () => {
    const url = getWhatsAppShareUrl(sampleAppointment, 'CONFIRMATION');
    expect(url).toContain('https://wa.me/918072097048?text=');
    expect(url).toContain(encodeURIComponent('APPOINTMENT CONFIRMED'));
    expect(url).toContain(encodeURIComponent('HEC-998877'));
  });
});

