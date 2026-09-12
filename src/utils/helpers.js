import { DATE_FORMATS, CURRENCY, REGEX } from './constants';

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
      minute: '2-digit'
    },
    [DATE_FORMATS.MONTH_DAY]: {
      month: 'short',
      day: 'numeric'
    },
    [DATE_FORMATS.YEAR_MONTH]: {
      year: 'numeric',
      month: 'long'
    },
    [DATE_FORMATS.TIME]: {
      hour: '2-digit',
      minute: '2-digit'
    }
  };

  return d.toLocaleDateString('en-US', options[format] || options[DATE_FORMATS.DISPLAY]);
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
 * Format number with commas
 */
export const formatNumber = (number, decimals = 0) => {
  if (number === null || number === undefined) return 'N/A';
  
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(number);
};

/**
 * Format percentage
 */
export const formatPercentage = (value, decimals = 1) => {
  if (value === null || value === undefined) return 'N/A';
  
  return `${value.toFixed(decimals)}%`;
};

/**
 * Truncate text
 */
export const truncateText = (text, maxLength = 100, suffix = '...') => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + suffix;
};

/**
 * Generate random ID
 */
export const generateId = (prefix = '') => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `${prefix}${timestamp}${random}`;
};

/**
 * Debounce function
 */
export const debounce = (func, wait = 300) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle function
 */
export const throttle = (func, limit = 300) => {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
};

/**
 * Deep clone object
 */
export const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj;
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Get nested property from object
 */
export const getNestedProperty = (obj, path, defaultValue = undefined) => {
  const keys = path.split('.');
  let result = obj;
  
  for (const key of keys) {
    if (result === null || result === undefined || typeof result !== 'object') {
      return defaultValue;
    }
    result = result[key];
  }
  
  return result === undefined ? defaultValue : result;
};

/**
 * Set nested property in object
 */
export const setNestedProperty = (obj, path, value) => {
  const keys = path.split('.');
  const lastKey = keys.pop();
  const target = keys.reduce((acc, key) => {
    if (!acc[key] || typeof acc[key] !== 'object') {
      acc[key] = {};
    }
    return acc[key];
  }, obj);
  target[lastKey] = value;
  return obj;
};

/**
 * Sort array by key
 */
export const sortBy = (array, key, direction = 'asc') => {
  const sorted = [...array];
  return sorted.sort((a, b) => {
    const aVal = typeof a[key] === 'string' ? a[key].toLowerCase() : a[key];
    const bVal = typeof b[key] === 'string' ? b[key].toLowerCase() : b[key];
    
    if (aVal < bVal) return direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return direction === 'asc' ? 1 : -1;
    return 0;
  });
};

/**
 * Group array by key
 */
export const groupBy = (array, key) => {
  return array.reduce((groups, item) => {
    const groupKey = item[key];
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(item);
    return groups;
  }, {});
};

/**
 * Filter array by search term
 */
export const filterBySearch = (array, searchTerm, keys) => {
  if (!searchTerm || !array || !keys) return array;
  
  const term = searchTerm.toLowerCase();
  return array.filter(item => {
    return keys.some(key => {
      const value = getNestedProperty(item, key);
      return value && String(value).toLowerCase().includes(term);
    });
  });
};

/**
 * Paginate array
 */
export const paginate = (array, page = 1, limit = 10) => {
  const start = (page - 1) * limit;
  const end = start + limit;
  return {
    data: array.slice(start, end),
    total: array.length,
    page,
    totalPages: Math.ceil(array.length / limit)
  };
};

/**
 * Download file from blob
 */
export const downloadFile = (blob, fileName, mimeType = 'application/octet-stream') => {
  const url = window.URL.createObjectURL(new Blob([blob], { type: mimeType }));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

/**
 * Copy text to clipboard
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return { success: true };
  } catch (error) {
    // Fallback for older browsers
    try {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      textarea.remove();
      return { success: true };
    } catch (err) {
      return { success: false, error: err };
    }
  }
};

/**
 * Get file extension
 */
export const getFileExtension = (filename) => {
  return filename.split('.').pop();
};

/**
 * Get file size string
 */
export const getFileSizeString = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Generate color from string
 */
export const stringToColor = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 70%, 60%)`;
};

/**
 * Get initials from name
 */
export const getInitials = (name) => {
  if (!name) return '';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

/**
 * Validate email
 */
export const isValidEmail = (email) => {
  return REGEX.EMAIL.test(email);
};

/**
 * Validate phone
 */
export const isValidPhone = (phone) => {
  return REGEX.PHONE.test(phone);
};

/**
 * Get status color
 */
export const getStatusColor = (status) => {
  const colors = {
    'Pending': 'warning',
    'Approved': 'success',
    'Rejected': 'danger',
    'Active': 'success',
    'Inactive': 'secondary',
    'Completed': 'success',
    'In Progress': 'info',
    'On Hold': 'warning',
    'Planned': 'secondary',
    'Generated': 'success',
    'Shortlisted': 'info',
    'Interview': 'warning',
    'Hired': 'success'
  };
  return colors[status] || 'secondary';
};

/**
 * Get status icon
 */
export const getStatusIcon = (status) => {
  const icons = {
    'Pending': 'FaClock',
    'Approved': 'FaCheckCircle',
    'Rejected': 'FaTimesCircle',
    'Active': 'FaCheckCircle',
    'Inactive': 'FaTimesCircle',
    'Completed': 'FaCheckCircle',
    'In Progress': 'FaSpinner',
    'On Hold': 'FaPauseCircle',
    'Planned': 'FaCalendarAlt',
    'Generated': 'FaFileAlt',
    'Shortlisted': 'FaUserCheck',
    'Interview': 'FaUserClock',
    'Hired': 'FaUserPlus'
  };
  return icons[status] || 'FaCircle';
};