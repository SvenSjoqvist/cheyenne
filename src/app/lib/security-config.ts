// Security Configuration
export const SECURITY_CONFIG = {
  // Rate limiting settings
  rateLimits: {
    // General API requests
    api: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
    },
    // Authentication endpoints
    auth: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 5, // limit each IP to 5 requests per windowMs
    },
    // Admin endpoints
    admin: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 50, // limit each IP to 50 requests per windowMs
    },
    // File uploads
    upload: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 10, // limit each IP to 10 uploads per windowMs
    }
  },

  // Input validation rules
  validation: {
    email: {
      maxLength: 254,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    password: {
      minLength: 8,
      maxLength: 128,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: true
    },
    name: {
      maxLength: 100,
      pattern: /^[a-zA-Z\s\-']+$/
    },
    phone: {
      maxLength: 20,
      pattern: /^[\+]?[1-9][\d]{0,15}$/
    },
    text: {
      maxLength: 1000
    },
    url: {
      maxLength: 2048,
      pattern: /^https?:\/\/.+/
    }
  },

  // File upload restrictions
  upload: {
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/pdf',
      'text/plain'
    ],
    maxFiles: 5
  },

  // Session security
  session: {
    maxAge: 24 * 60 * 60, // 24 hours
    updateAge: 60 * 60, // 1 hour
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax' as const
  },

  // CORS settings
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? ['https://testing.kilaeko.com'] 
      : ['http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  },

  // Security headers
  headers: {
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
  },

  // Content Security Policy
  csp: {
    'default-src': ["'self'"],
    'script-src': ["'self'", "'unsafe-eval'", "'unsafe-inline'"],
    'style-src': ["'self'", "'unsafe-inline'"],
    'img-src': ["'self'", 'data:', 'https:'],
    'font-src': ["'self'", 'https://fonts.gstatic.com'],
    'connect-src': ["'self'", 'https://fonts.googleapis.com'],
    'frame-ancestors': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"]
  }
};

// Input sanitization functions
export function sanitizeString(input: string, maxLength: number = 1000): string {
  if (typeof input !== 'string') return '';
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .slice(0, maxLength);
}

export function sanitizeEmail(email: string): string {
  return sanitizeString(email, SECURITY_CONFIG.validation.email.maxLength)
    .toLowerCase();
}

export function sanitizeUrl(url: string): string {
  const sanitized = sanitizeString(url, SECURITY_CONFIG.validation.url.maxLength);
  
  // Ensure it starts with http:// or https://
  if (!sanitized.startsWith('http://') && !sanitized.startsWith('https://')) {
    return '';
  }
  
  return sanitized;
}

// Validation functions
export function validateEmail(email: string): boolean {
  return SECURITY_CONFIG.validation.email.pattern.test(email) && 
         email.length <= SECURITY_CONFIG.validation.email.maxLength;
}

export function validatePassword(password: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (password.length < SECURITY_CONFIG.validation.password.minLength) {
    errors.push(`Password must be at least ${SECURITY_CONFIG.validation.password.minLength} characters long`);
  }
  
  if (password.length > SECURITY_CONFIG.validation.password.maxLength) {
    errors.push(`Password must be no more than ${SECURITY_CONFIG.validation.password.maxLength} characters long`);
  }
  
  if (SECURITY_CONFIG.validation.password.requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (SECURITY_CONFIG.validation.password.requireLowercase && !/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (SECURITY_CONFIG.validation.password.requireNumbers && !/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (SECURITY_CONFIG.validation.password.requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

export function validateName(name: string): boolean {
  return SECURITY_CONFIG.validation.name.pattern.test(name) && 
         name.length <= SECURITY_CONFIG.validation.name.maxLength;
}

export function validatePhone(phone: string): boolean {
  return SECURITY_CONFIG.validation.phone.pattern.test(phone) && 
         phone.length <= SECURITY_CONFIG.validation.phone.maxLength;
}

// File validation
export function validateFile(file: File): { isValid: boolean; error?: string } {
  if (file.size > SECURITY_CONFIG.upload.maxFileSize) {
    return {
      isValid: false,
      error: `File size must be less than ${SECURITY_CONFIG.upload.maxFileSize / (1024 * 1024)}MB`
    };
  }
  
  if (!SECURITY_CONFIG.upload.allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: 'File type not allowed'
    };
  }
  
  return { isValid: true };
} 