import { DATE_FORMATS, CURRENCY } from './constants';

/**
 * Format date to various formats
 */
export const formatDate = (date, format = DATE_FORMATS.DISPLAY) => {
  if (!date) return 'N/A';
  
  const d = new Date(date);
  if (isNaN(d.getTime())) return 'Invalid Date';

  const options = {
    [DATE_FORMATS.DISPLAY]: {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    },
    [DATE_FORMATS.DISPLAY_WITH_TIME]: {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    },
    [DATE_FORMATS.API]: {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    },
    [DATE_FORMATS.API_WITH_TIME]: {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    },
    [DATE_FORMATS.TIME]: {
      hour: '2-digit',
      minute: '2-digit'
    },
    [DATE_FORMATS.MONTH_DAY]: {
      month: 'short',
      day: 'numeric'
    },
    [DATE_FORMATS.YEAR_MONTH]: {
      year: 'numeric',
      month: 'long'
    }
  };

  return d.toLocaleDateString('en-US', options[format] || options[DATE_FORMATS.DISPLAY]);
};

/**
 * Format date for API
 */
export const formatDateForAPI = (date) => {
  if (!date) return null;
  const d = new Date(date);
  if (isNaN(d.getTime())) return null;
  return d.toISOString().split('T')[0];
};

/**
 * Format datetime for API
 */
export const formatDateTimeForAPI = (date) => {
  if (!date) return null;
  const d = new Date(date);
  if (isNaN(d.getTime())) return null;
  return d.toISOString();
};

/**
 * Format currency
 */
export const formatCurrency = (amount, currency = CURRENCY.CODE, locale = CURRENCY.LOCALE) => {
  if (amount === null || amount === undefined) return 'N/A';
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(amount);
};

/**
 * Format number
 */
export const formatNumber = (number, options = {}) => {
  const {
    decimals = 0,
    minDecimals = 0,
    maxDecimals = 2,
    locale = 'en-US',
    style = 'decimal',
    currency = CURRENCY.CODE
  } = options;

  if (number === null || number === undefined) return 'N/A';

  const formatter = new Intl.NumberFormat(locale, {
    style,
    currency: style === 'currency' ? currency : undefined,
    minimumFractionDigits: minDecimals,
    maximumFractionDigits: maxDecimals
  });

  return formatter.format(number);
};

/**
 * Format percentage
 */
export const formatPercentage = (value, decimals = 1) => {
  if (value === null || value === undefined) return 'N/A';
  return `${value.toFixed(decimals)}%`;
};

/**
 * Format file size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Format phone number
 */
export const formatPhone = (phone) => {
  if (!phone) return '';
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return phone;
};

/**
 * Format SSN
 */
export const formatSSN = (ssn) => {
  if (!ssn) return '';
  const cleaned = ssn.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{2})(\d{4})$/);
  if (match) {
    return `${match[1]}-${match[2]}-${match[3]}`;
  }
  return ssn;
};

/**
 * Format zip code
 */
export const formatZipCode = (zip) => {
  if (!zip) return '';
  const cleaned = zip.replace(/\D/g, '');
  if (cleaned.length === 9) {
    return `${cleaned.slice(0, 5)}-${cleaned.slice(5)}`;
  }
  return zip;
};

/**
 * Format credit card number
 */
export const formatCreditCard = (cardNumber) => {
  if (!cardNumber) return '';
  const cleaned = cardNumber.replace(/\D/g, '');
  const groups = cleaned.match(/.{1,4}/g);
  return groups ? groups.join(' ') : cardNumber;
};

/**
 * Format duration in minutes to hours and minutes
 */
export const formatDuration = (minutes) => {
  if (minutes === null || minutes === undefined) return 'N/A';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
};

/**
 * Format status
 */
export const formatStatus = (status) => {
  if (!status) return 'N/A';
  return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
};

/**
 * Format name
 */
export const formatName = (firstName, lastName) => {
  if (!firstName && !lastName) return 'N/A';
  if (!firstName) return lastName;
  if (!lastName) return firstName;
  return `${firstName} ${lastName}`;
};

/**
 * Format initials
 */
export const formatInitials = (firstName, lastName) => {
  if (!firstName && !lastName) return '';
  const first = firstName ? firstName.charAt(0).toUpperCase() : '';
  const last = lastName ? lastName.charAt(0).toUpperCase() : '';
  return first + last;
};

/**
 * Format address
 */
export const formatAddress = (address) => {
  if (!address) return 'N/A';
  const parts = [];
  if (address.street) parts.push(address.street);
  if (address.city) parts.push(address.city);
  if (address.state) parts.push(address.state);
  if (address.zip) parts.push(address.zip);
  if (address.country) parts.push(address.country);
  return parts.join(', ');
};

/**
 * Format time ago
 */
export const formatTimeAgo = (date) => {
  if (!date) return 'N/A';
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now - past) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 604800)} weeks ago`;
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`;
  return `${Math.floor(diffInSeconds / 31536000)} years ago`;
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text, maxLength = 100, ellipsis = '...') => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + ellipsis;
};

/**
 * Word count
 */
export const wordCount = (text) => {
  if (!text) return 0;
  return text.trim().split(/\s+/).length;
};

/**
 * Character count
 */
export const charCount = (text) => {
  if (!text) return 0;
  return text.length;
};

/**
 * Slugify text
 */
export const slugify = (text) => {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
};