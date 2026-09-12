import { REGEX } from './constants';

/**
 * Validation result object
 */
class ValidationResult {
  constructor(valid = true, message = '', field = null) {
    this.valid = valid;
    this.message = message;
    this.field = field;
  }

  isValid() {
    return this.valid;
  }

  isInvalid() {
    return !this.valid;
  }
}

/**
 * Required validator
 */
export const required = (value, field = 'Field') => {
  if (value === null || value === undefined || value === '') {
    return new ValidationResult(false, `${field} is required`, field);
  }
  if (typeof value === 'string' && value.trim() === '') {
    return new ValidationResult(false, `${field} is required`, field);
  }
  return new ValidationResult(true, '', field);
};

/**
 * Email validator
 */
export const email = (value, field = 'Email') => {
  const requiredCheck = required(value, field);
  if (requiredCheck.isInvalid()) return requiredCheck;

  if (!REGEX.EMAIL.test(value)) {
    return new ValidationResult(false, `${field} must be a valid email address`, field);
  }
  return new ValidationResult(true, '', field);
};

/**
 * Phone validator
 */
export const phone = (value, field = 'Phone') => {
  const requiredCheck = required(value, field);
  if (requiredCheck.isInvalid()) return requiredCheck;

  if (!REGEX.PHONE.test(value.replace(/[\s-]/g, ''))) {
    return new ValidationResult(false, `${field} must be a valid phone number`, field);
  }
  return new ValidationResult(true, '', field);
};

/**
 * Password validator
 */
export const password = (value, field = 'Password') => {
  const requiredCheck = required(value, field);
  if (requiredCheck.isInvalid()) return requiredCheck;

  if (value.length < 8) {
    return new ValidationResult(false, `${field} must be at least 8 characters`, field);
  }

  if (!REGEX.PASSWORD.test(value)) {
    return new ValidationResult(
      false,
      `${field} must contain at least one uppercase, one lowercase, one number, and one special character`,
      field
    );
  }
  return new ValidationResult(true, '', field);
};

/**
 * Confirm password validator
 */
export const confirmPassword = (password, confirm, field = 'Confirm Password') => {
  if (password !== confirm) {
    return new ValidationResult(false, `${field} must match password`, field);
  }
  return new ValidationResult(true, '', field);
};

/**
 * Min length validator
 */
export const minLength = (value, min, field = 'Field') => {
  const requiredCheck = required(value, field);
  if (requiredCheck.isInvalid()) return requiredCheck;

  if (value.length < min) {
    return new ValidationResult(false, `${field} must be at least ${min} characters`, field);
  }
  return new ValidationResult(true, '', field);
};

/**
 * Max length validator
 */
export const maxLength = (value, max, field = 'Field') => {
  const requiredCheck = required(value, field);
  if (requiredCheck.isInvalid()) return requiredCheck;

  if (value.length > max) {
    return new ValidationResult(false, `${field} must not exceed ${max} characters`, field);
  }
  return new ValidationResult(true, '', field);
};

/**
 * Min value validator (for numbers)
 */
export const minValue = (value, min, field = 'Field') => {
  const requiredCheck = required(value, field);
  if (requiredCheck.isInvalid()) return requiredCheck;

  if (Number(value) < min) {
    return new ValidationResult(false, `${field} must be at least ${min}`, field);
  }
  return new ValidationResult(true, '', field);
};

/**
 * Max value validator (for numbers)
 */
export const maxValue = (value, max, field = 'Field') => {
  const requiredCheck = required(value, field);
  if (requiredCheck.isInvalid()) return requiredCheck;

  if (Number(value) > max) {
    return new ValidationResult(false, `${field} must not exceed ${max}`, field);
  }
  return new ValidationResult(true, '', field);
};

/**
 * Range validator (for numbers)
 */
export const range = (value, min, max, field = 'Field') => {
  const minCheck = minValue(value, min, field);
  if (minCheck.isInvalid()) return minCheck;

  const maxCheck = maxValue(value, max, field);
  if (maxCheck.isInvalid()) return maxCheck;

  return new ValidationResult(true, '', field);
};

/**
 * URL validator
 */
export const url = (value, field = 'URL') => {
  if (!value) return new ValidationResult(true, '', field);

  if (!REGEX.URL.test(value)) {
    return new ValidationResult(false, `${field} must be a valid URL`, field);
  }
  return new ValidationResult(true, '', field);
};

/**
 * Date validator
 */
export const isDate = (value, field = 'Date') => {
  const requiredCheck = required(value, field);
  if (requiredCheck.isInvalid()) return requiredCheck;

  const date = new Date(value);
  if (isNaN(date.getTime())) {
    return new ValidationResult(false, `${field} must be a valid date`, field);
  }
  return new ValidationResult(true, '', field);
};

/**
 * Date range validator
 */
export const dateRange = (start, end, field = 'Date Range') => {
  const startCheck = isDate(start, 'Start Date');
  if (startCheck.isInvalid()) return startCheck;

  const endCheck = isDate(end, 'End Date');
  if (endCheck.isInvalid()) return endCheck;

  if (new Date(start) > new Date(end)) {
    return new ValidationResult(false, `${field} start date must be before end date`, field);
  }
  return new ValidationResult(true, '', field);
};

/**
 * Numeric validator
 */
export const numeric = (value, field = 'Field') => {
  const requiredCheck = required(value, field);
  if (requiredCheck.isInvalid()) return requiredCheck;

  if (isNaN(Number(value))) {
    return new ValidationResult(false, `${field} must be a number`, field);
  }
  return new ValidationResult(true, '', field);
};

/**
 * Select validator
 */
export const isSelected = (value, field = 'Selection') => {
  if (value === null || value === undefined || value === '' || value === 'none') {
    return new ValidationResult(false, `${field} is required`, field);
  }
  return new ValidationResult(true, '', field);
};

/**
 * File validator
 */
export const file = (file, options = {}, field = 'File') => {
  const { maxSize = 5, allowedTypes = [] } = options;

  if (!file) {
    return new ValidationResult(false, `${field} is required`, field);
  }

  // Check file size (in MB)
  const fileSize = file.size / (1024 * 1024);
  if (fileSize > maxSize) {
    return new ValidationResult(
      false,
      `${field} must be less than ${maxSize}MB`,
      field
    );
  }

  // Check file type
  if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
    return new ValidationResult(
      false,
      `${field} must be of type: ${allowedTypes.join(', ')}`,
      field
    );
  }

  return new ValidationResult(true, '', field);
};

/**
 * Password strength validator
 */
export const passwordStrength = (value, field = 'Password') => {
  const requiredCheck = required(value, field);
  if (requiredCheck.isInvalid()) return requiredCheck;

  let score = 0;
  if (value.length >= 8) score++;
  if (value.length >= 12) score++;
  if (/[a-z]/.test(value) && /[A-Z]/.test(value)) score++;
  if (/\d/.test(value)) score++;
  if (/[^a-zA-Z0-9]/.test(value)) score++;

  if (score < 3) {
    return new ValidationResult(
      false,
      `${field} is too weak. Use at least 8 characters with uppercase, lowercase, numbers, and symbols.`,
      field
    );
  }
  return new ValidationResult(true, '', field);
};

/**
 * Create a validator chain
 */
export const compose = (...validators) => {
  return (value, field) => {
    for (const validator of validators) {
      const result = validator(value, field);
      if (result.isInvalid()) return result;
    }
    return new ValidationResult(true, '', field);
  };
};

/**
 * Common validation rules
 */
export const Validators = {
  email: (field = 'Email') => compose(required, email),
  phone: (field = 'Phone') => compose(required, phone),
  password: (field = 'Password') => compose(required, password, passwordStrength),
  confirmPassword: (password, field = 'Confirm Password') => (value) => 
    confirmPassword(password, value, field),
  name: (field = 'Name') => compose(required, minLength(2, field), maxLength(100, field)),
  number: (field = 'Number') => compose(required, numeric, minValue(0, field)),
  select: (field = 'Selection') => isSelected,
  date: (field = 'Date') => compose(required, isDate),
  file: (options = {}, field = 'File') => compose(file(options, field)),
  url: (field = 'URL') => url
};