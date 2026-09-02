import {
  CLINIC_INFO,
  isMonday,
  isPastDate,
  formatReadableDate,
  getSlotKey,
  generateAppointmentId,
  generateGoogleCalendarUrl
} from './appointmentSlots';

describe('appointmentSlots utilities', () => {
  test('CLINIC_INFO contains Optometrist Nandhini K metadata', () => {
    expect(CLINIC_INFO.optometrist).toBe('Nandhini K');
    expect(CLINIC_INFO.optometristTitle).toBe('Optometrist Nandhini K');
    expect(CLINIC_INFO.phone).toBe('80720 97048');
  });

  test('isMonday detects Mondays correctly', () => {
    // 2026-08-31 is a Monday
    expect(isMonday('2026-08-31')).toBe(true);
    // 2026-09-01 is a Tuesday
    expect(isMonday('2026-09-01')).toBe(false);
  });

  test('isPastDate detects dates before today', () => {
    expect(isPastDate('2000-01-01')).toBe(true);
    expect(isPastDate('2099-01-01')).toBe(false);
  });

  test('formatReadableDate returns formatted string', () => {
    const formatted = formatReadableDate('2026-09-01');
    expect(formatted).toContain('Tuesday');
    expect(formatted).toContain('2026');
  });

  test('getSlotKey formats date and slot ID', () => {
    expect(getSlotKey('2026-09-01', '11-00-12-00')).toBe('2026-09-01_11-00-12-00');
  });

  test('generateAppointmentId starts with HEC prefix', () => {
    const id = generateAppointmentId();
    expect(id).toMatch(/^HEC-\d{6}$/);
  });

  test('generateGoogleCalendarUrl returns valid calendar URL', () => {
    const app = {
      appointmentId: 'HEC-123456',
      patientName: 'Test Patient',
      date: '2026-09-01',
      startTime: '11:00 AM',
      endTime: '12:00 PM'
    };
    const url = generateGoogleCalendarUrl(app);
    expect(url).toContain('calendar.google.com');
    expect(url).toContain('Nandhini');
  });
});
