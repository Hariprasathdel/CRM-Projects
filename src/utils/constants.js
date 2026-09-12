// Application Constants

// API Endpoints
export const API_ENDPOINTS = {
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      LOGOUT: '/auth/logout',
      REFRESH_TOKEN: '/auth/refresh-token',
      FORGOT_PASSWORD: '/auth/forgot-password',
      RESET_PASSWORD: '/auth/reset-password',
      VERIFY_EMAIL: '/auth/verify-email',
      ME: '/auth/me'
    },
    EMPLOYEES: {
      BASE: '/employees',
      STATISTICS: '/employees/statistics',
      PERFORMANCE: '/employees/performance',
      EXPORT: '/employees/export',
      IMPORT: '/employees/import'
    },
    ATTENDANCE: {
      BASE: '/attendance',
      STATISTICS: '/attendance/statistics',
      CHECK_IN: '/attendance/check-in',
      CHECK_OUT: '/attendance/check-out',
      TODAY: '/attendance/today',
      EXPORT: '/attendance/export'
    },
    LEAVES: {
      BASE: '/leaves',
      STATISTICS: '/leaves/statistics',
      APPROVE: '/leaves/approve',
      REJECT: '/leaves/reject',
      BALANCE: '/leaves/balance',
      EXPORT: '/leaves/export'
    },
    DEPARTMENTS: {
      BASE: '/departments',
      STATISTICS: '/departments/statistics',
      EXPORT: '/departments/export'
    },
    PROJECTS: {
      BASE: '/projects',
      STATISTICS: '/projects/statistics',
      TASKS: '/projects/tasks',
      EXPORT: '/projects/export'
    },
    RECRUITMENT: {
      JOBS: '/recruitment/jobs',
      APPLICANTS: '/recruitment/applicants',
      STATISTICS: '/recruitment/statistics',
      EXPORT: '/recruitment/export'
    },
    REPORTS: {
      BASE: '/reports',
      GENERATE: '/reports/generate',
      TEMPLATES: '/reports/templates',
      EXPORT: '/reports/export'
    },
    REWARDS: {
      BASE: '/rewards',
      STATISTICS: '/rewards/statistics',
      LEADERBOARD: '/rewards/leaderboard',
      EXPORT: '/rewards/export'
    },
    PAYSLIPS: {
      BASE: '/payslips',
      STATISTICS: '/payslips/statistics',
      GENERATE: '/payslips/generate',
      BULK_GENERATE: '/payslips/bulk-generate',
      EXPORT: '/payslips/export'
    }
  };
  
  // User Roles
  export const USER_ROLES = {
    ADMIN: 'admin',
    MANAGER: 'manager',
    EMPLOYEE: 'employee',
    HR: 'hr',
    SUPER_ADMIN: 'super_admin'
  };
  
  // Leave Types
  export const LEAVE_TYPES = {
    ANNUAL: 'Annual',
    SICK: 'Sick',
    EMERGENCY: 'Emergency',
    PERSONAL: 'Personal',
    MATERNITY: 'Maternity',
    PATERNITY: 'Paternity',
    UNPAID: 'Unpaid'
  };
  
  // Leave Statuses
  export const LEAVE_STATUSES = {
    PENDING: 'Pending',
    APPROVED: 'Approved',
    REJECTED: 'Rejected',
    CANCELLED: 'Cancelled'
  };
  
  // Attendance Statuses
  export const ATTENDANCE_STATUSES = {
    PRESENT: 'present',
    ABSENT: 'absent',
    LEAVE: 'leave',
    LATE: 'late',
    HOLIDAY: 'holiday',
    WEEKEND: 'weekend'
  };
  
  // Loan Types
  export const LOAN_TYPES = {
    PERSONAL: 'Personal',
    CAR: 'Car',
    HOME: 'Home',
    EDUCATION: 'Education',
    EMERGENCY: 'Emergency'
  };
  
  // Loan Statuses
  export const LOAN_STATUSES = {
    PENDING: 'Pending',
    APPROVED: 'Approved',
    REJECTED: 'Rejected',
    PAID: 'Paid',
    DEFAULTED: 'Defaulted'
  };
  
  // Project Statuses
  export const PROJECT_STATUSES = {
    PLANNED: 'Planned',
    IN_PROGRESS: 'In Progress',
    ON_HOLD: 'On Hold',
    COMPLETED: 'Completed',
    CANCELLED: 'Cancelled'
  };
  
  // Award Types
  export const AWARD_TYPES = {
    CERTIFICATE: 'Certificate',
    MONETARY: 'Monetary',
    RECOGNITION: 'Recognition',
    TEAM: 'Team Award'
  };
  
  // Report Types
  export const REPORT_TYPES = {
    ATTENDANCE: 'Attendance',
    PERFORMANCE: 'Performance',
    LEAVE: 'Leave',
    EMPLOYEE: 'Employee',
    DEPARTMENT: 'Department',
    FINANCIAL: 'Financial',
    PROJECT: 'Project',
    CUSTOM: 'Custom'
  };
  
  // Report Formats
  export const REPORT_FORMATS = {
    PDF: 'PDF',
    EXCEL: 'Excel',
    CSV: 'CSV',
    WORD: 'Word'
  };
  
  // Pagination Defaults
  export const PAGINATION = {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10,
    LIMIT_OPTIONS: [5, 10, 25, 50, 100]
  };
  
  // Date Formats
  export const DATE_FORMATS = {
    DISPLAY: 'MMM DD, YYYY',
    DISPLAY_WITH_TIME: 'MMM DD, YYYY HH:mm',
    API: 'YYYY-MM-DD',
    API_WITH_TIME: 'YYYY-MM-DDTHH:mm:ss',
    TIME: 'HH:mm',
    MONTH_DAY: 'MMM DD',
    YEAR_MONTH: 'YYYY-MM'
  };
  
  // Currency
  export const CURRENCY = {
    SYMBOL: '$',
    CODE: 'USD',
    LOCALE: 'en-US'
  };
  
  // Regex Patterns
  export const REGEX = {
    EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    PHONE: /^\+?[\d\s-]{10,}$/,
    PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    URL: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
    ZIP_CODE: /^\d{5}(-\d{4})?$/,
    SSN: /^\d{3}-\d{2}-\d{4}$/
  };
  
  // Error Messages
  export const ERROR_MESSAGES = {
    NETWORK: 'Network error. Please check your connection.',
    UNAUTHORIZED: 'You are not authorized to perform this action.',
    FORBIDDEN: 'Access denied. You do not have permission.',
    NOT_FOUND: 'Resource not found.',
    SERVER_ERROR: 'Server error. Please try again later.',
    VALIDATION: 'Please check your input and try again.',
    SESSION_EXPIRED: 'Your session has expired. Please login again.'
  };
  
  // Success Messages
  export const SUCCESS_MESSAGES = {
    LOGIN: 'Logged in successfully!',
    LOGOUT: 'Logged out successfully!',
    REGISTER: 'Registration successful!',
    CREATED: 'Created successfully!',
    UPDATED: 'Updated successfully!',
    DELETED: 'Deleted successfully!',
    APPROVED: 'Approved successfully!',
    REJECTED: 'Rejected successfully!',
    GENERATED: 'Generated successfully!',
    SENT: 'Sent successfully!'
  };
  
  // Local Storage Keys
  export const STORAGE_KEYS = {
    TOKEN: 'token',
    USER: 'user',
    THEME: 'theme',
    LANGUAGE: 'language',
    SIDEBAR_STATE: 'sidebarCollapsed',
    REMEMBER_ME: 'rememberMe',
    REFRESH_TOKEN: 'refreshToken'
  };
  
  // Theme Options
  export const THEME_OPTIONS = {
    LIGHT: 'light',
    DARK: 'dark',
    SYSTEM: 'system'
  };
  
  // Font Size Options
  export const FONT_SIZES = {
    SMALL: 'small',
    MEDIUM: 'medium',
    LARGE: 'large',
    XLARGE: 'xlarge'
  };
  
  // Application Routes
  export const ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    REGISTER: '/register',
    DASHBOARD: '/dashboard',
    EMPLOYEES: '/employees',
    EMPLOYEE_DETAILS: (id) => `/employees/${id}`,
    DEPARTMENT: '/department',
    ATTENDANCE: '/attendance',
    LEAVE: '/leave',
    LOAN: '/loan',
    PROJECTS: '/projects',
    RECRUITMENT: '/recruitment',
    REPORTS: '/reports',
    REWARDS: '/rewards',
    PAYSLIP: '/payslip',
    PROFILE: '/profile',
    SETTINGS: '/settings',
    NOT_FOUND: '/404'
  };
  
  // Defaults
  export const DEFAULTS = {
    PROFILE_IMAGE: '/images/default-avatar.png',
    COMPANY_NAME: 'Employee Management System',
    COMPANY_LOGO: '/images/logo.png',
    DEFAULT_PAGE_TITLE: 'EMS',
    DATE_RANGE_DAYS: 30
  };