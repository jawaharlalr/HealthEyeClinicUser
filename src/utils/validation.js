/**
 * Filters name input to allow ONLY letters (a-z, A-Z) and spaces.
 */
export function cleanNameInput(val) {
  if (!val) return '';
  return val.replace(/[^a-zA-Z\s]/g, '');
}

/**
 * Filters mobile input to allow ONLY digits (0-9) with max length 10.
 * Strictly rejects letters, +91, 0 prefix, spaces, hyphens, and symbols.
 */
export function cleanMobileInput(val) {
  if (!val) return '';
  return String(val).replace(/\D/g, '').slice(0, 10);
}

export function validateName(name) {
  if (!name) return false;
  const trimmed = name.trim();
  const regex = /^[a-zA-Z\s]{2,50}$/;
  return regex.test(trimmed);
}

export function validateIndianMobile(mobile) {
  const cleaned = cleanMobileInput(mobile);
  const regex = /^[6-9]\d{9}$/;
  return regex.test(cleaned);
}

export function validateEmail(email) {
  if (!email) return false;
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email.trim());
}

export function validatePatientForm(formData) {
  const errors = {};

  if (!formData.fullName || !validateName(formData.fullName)) {
    errors.fullName = 'Please enter a valid patient name.';
  }

  if (!formData.mobile || !validateIndianMobile(formData.mobile)) {
    errors.mobile = 'Please enter a valid 10-digit mobile number.';
  }

  if (formData.email && formData.email.trim() !== '' && !validateEmail(formData.email)) {
    errors.email = 'Please enter a valid email address.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}
