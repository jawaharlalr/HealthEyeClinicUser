import {
  CLINIC_INFO,
  CLINIC_SLOTS,
  isMonday,
  isToday,
  isPastDate,
  isSlotInPast,
  getTodayDateStrIST,
  getNowInIST,
  parseSlotTimeToMinutes,
  getInitialAppointmentDate,
  formatReadableDate,
  getSlotKey,
  generateAppointmentId,
  generateGoogleCalendarUrl
} from './appointmentSlots';
import { bookAppointmentAtomic } from '../firebase/appointmentService';

describe('appointmentSlots utilities & Real-Time Slot Logic', () => {
  test('CLINIC_INFO contains metadata', () => {
    expect(CLINIC_INFO.optometrist).toBe('Nandhini K');
    expect(CLINIC_INFO.optometristTitle).toBe('Optometrist Nandhini K');
    expect(CLINIC_INFO.phone).toBe('80720 97048');
  });

  test('parseSlotTimeToMinutes correctly converts slot start times to minutes', () => {
    expect(parseSlotTimeToMinutes('11:00 AM')).toBe(660);
    expect(parseSlotTimeToMinutes('12:00 PM')).toBe(720);
    expect(parseSlotTimeToMinutes('1:00 PM')).toBe(780);
    expect(parseSlotTimeToMinutes('2:00 PM')).toBe(840);
    expect(parseSlotTimeToMinutes('3:00 PM')).toBe(900);
  });

  test('getTodayDateStrIST returns valid YYYY-MM-DD string', () => {
    const todayStr = getTodayDateStrIST();
    expect(todayStr).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  test('isMonday detects Mondays correctly', () => {
    // 2026-08-31 is a Monday
    expect(isMonday('2026-08-31')).toBe(true);
    // 2026-09-01 is a Tuesday
    expect(isMonday('2026-09-01')).toBe(false);
  });

  test('isPastDate detects dates strictly before today IST', () => {
    expect(isPastDate('2000-01-01')).toBe(true);
    expect(isPastDate('2099-01-01')).toBe(false);
    expect(isPastDate(getTodayDateStrIST())).toBe(false);
  });

  test('isToday returns true for current Asia/Kolkata date', () => {
    expect(isToday(getTodayDateStrIST())).toBe(true);
    expect(isToday('2000-01-01')).toBe(false);
  });

  test('isSlotInPast correctly evaluates past vs future slots', () => {
    // Past date -> always past slot
    expect(isSlotInPast('2000-01-01', '11:00 AM')).toBe(true);

    // Future date -> never past slot
    expect(isSlotInPast('2099-01-01', '11:00 AM')).toBe(false);

    // Today date: Compare slot minutes against current IST minutes
    const today = getTodayDateStrIST();
    const nowIST = getNowInIST();

    // Slot that is 10 hours ago is definitely past
    const pastSlotTime = '01:00 AM';
    expect(isSlotInPast(today, pastSlotTime)).toBe(true);

    // Slot that is late in the evening (11:59 PM = 1439 min) is future if before midnight
    if (nowIST.totalMinutes < 1439) {
      expect(isSlotInPast(today, '11:59 PM')).toBe(false);
    }
  });

  test('getInitialAppointmentDate returns a valid non-Monday non-past date string', () => {
    const initialDate = getInitialAppointmentDate();
    expect(initialDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(isMonday(initialDate)).toBe(false);
    expect(isPastDate(initialDate)).toBe(false);
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

  test('bookAppointmentAtomic rejects past time slots with SLOT_PASSED error code', async () => {
    const result = await bookAppointmentAtomic({
      date: '2000-01-01',
      slot: CLINIC_SLOTS[0],
      patientType: 'new',
      fullName: 'Test Patient',
      mobile: '9876543210',
      notes: ''
    });

    expect(result.success).toBe(false);
    expect(result.code).toBe('SLOT_PASSED');
    expect(result.error).toContain('already passed');
  });
});
