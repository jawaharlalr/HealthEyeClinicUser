import {
  cleanNameInput,
  cleanMobileInput,
  validateName,
  validateIndianMobile,
  validateEmail,
  validatePatientForm
} from './validation';

describe('validation utilities', () => {
  test('cleanNameInput strips non-alphabetic characters', () => {
    expect(cleanNameInput('John123')).toBe('John');
    expect(cleanNameInput('Nandhini K.')).toBe('Nandhini K');
    expect(cleanNameInput('A')).toBe('A');
  });

  test('cleanMobileInput strips non-digit characters and limits to 10 digits', () => {
    expect(cleanMobileInput('+91 80720 97048')).toBe('9180720970');
    expect(cleanMobileInput('8072097048')).toBe('8072097048');
    expect(cleanMobileInput('abc1234567890123')).toBe('1234567890');
  });

  test('validateName verifies name length and characters', () => {
    expect(validateName('Nandhini')).toBe(true);
    expect(validateName('A')).toBe(false); // too short
    expect(validateName('')).toBe(false);
  });

  test('validateIndianMobile requires 10 digits starting with 6-9', () => {
    expect(validateIndianMobile('8072097048')).toBe(true);
    expect(validateIndianMobile('9876543210')).toBe(true);
    expect(validateIndianMobile('5876543210')).toBe(false); // starts with 5
    expect(validateIndianMobile('12345')).toBe(false);
  });

  test('validateEmail validates standard email formats', () => {
    expect(validateEmail('test@example.com')).toBe(true);
    expect(validateEmail('invalid-email')).toBe(false);
    expect(validateEmail('')).toBe(false);
  });

  test('validatePatientForm validates required patient fields (Name and Mobile)', () => {
    const validForm = {
      fullName: 'Rahul Sharma',
      mobile: '9876543210',
      notes: 'First time visit'
    };

    const res = validatePatientForm(validForm);
    expect(res.isValid).toBe(true);
    expect(Object.keys(res.errors).length).toEqual(0);
  });

  test('validatePatientForm rejects incomplete forms', () => {
    const invalidForm = {
      fullName: 'R',
      mobile: '123'
    };

    const res = validatePatientForm(invalidForm);
    expect(res.isValid).toBe(false);
    expect(res.errors.fullName).toBeDefined();
    expect(res.errors.mobile).toBeDefined();
  });
});
