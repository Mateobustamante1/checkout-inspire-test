/**
 * Logger Service - Observability for critical business events
 * 
 * Principles:
 * - Never log PII (personal identifiable information)
 * - Consistent event structure for analytics
 * - Ready for integration with external services (Datadog, Sentry)
 * - Minimal overhead in production
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface BaseEvent {
  timestamp: string;
  sessionId: string;
  event: string;
  context?: Record<string, any>;
}

interface CheckoutEvent extends BaseEvent {
  event: 
    | 'checkout_started'
    | 'checkout_form_validation_error'
    | 'checkout_cep_lookup_success'
    | 'checkout_cep_lookup_error'
    | 'checkout_coupon_applied'
    | 'checkout_coupon_error'
    | 'checkout_submitted'
    | 'checkout_success'
    | 'checkout_error';
}

/**
 * Generates unique session ID to track user journey
 */
const generateSessionId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

let SESSION_ID: string | null = null;

const getSessionId = (): string => {
  if (!SESSION_ID) {
    SESSION_ID = generateSessionId();
  }
  return SESSION_ID;
};

/**
 * PII Sanitization - Masks sensitive data while keeping debugging utility
 * Ensures LGPD/GDPR compliance
 */
const sanitizePII = {
  cep: (cep: string): string => {
    return cep.slice(0, 5) + 'XXX';
  },

  email: (email: string): string => {
    const [user, domain] = email.split('@');
    const masked = user.slice(0, 2) + '***' + user.slice(-1);
    return `${masked}@${domain}`;
  },

  cpf: (cpf: string): string => {
    return `***${cpf.slice(-3)}`;
  },

  phone: (phone: string): string => {
    return `(${phone.slice(0, 2)}) *****-${phone.slice(-4)}`;
  },
};

class Logger {
  private isProduction = process.env.NODE_ENV === 'production';
  private isEnabled = true;

  private log(level: LogLevel, event: string, context?: Record<string, any>) {
    if (!this.isEnabled) return;

    const logEntry: BaseEvent = {
      timestamp: new Date().toISOString(),
      sessionId: getSessionId(),
      event,
      context,
    };

    if (!this.isProduction) {
      const colors = {
        info: '\x1b[36m',
        warn: '\x1b[33m',
        error: '\x1b[31m',
        debug: '\x1b[90m',
      };
      const reset = '\x1b[0m';
      
      console.log(
        `${colors[level]}[${level.toUpperCase()}]${reset}`,
        `${event}`,
        context || ''
      );
    }

    if (this.isProduction) {
      this.sendToExternalService(level, logEntry);
    }
  }

  /**
   * Sends logs to external service (Datadog, Sentry, etc.)
   * Currently stores in localStorage for demo purposes
   */
  private sendToExternalService(level: LogLevel, logEntry: BaseEvent) {
    try {
      const logs = JSON.parse(localStorage.getItem('checkout_logs') || '[]');
      logs.push({ level, ...logEntry });
      if (logs.length > 100) logs.shift();
      localStorage.setItem('checkout_logs', JSON.stringify(logs));
    } catch (error) {
      console.error('Failed to store log:', error);
    }
  }

  info(event: string, context?: Record<string, any>) {
    this.log('info', event, context);
  }

  warn(event: string, context?: Record<string, any>) {
    this.log('warn', event, context);
  }

  error(event: string, context?: Record<string, any>) {
    this.log('error', event, context);
  }

  debug(event: string, context?: Record<string, any>) {
    this.log('debug', event, context);
  }

  disable() {
    this.isEnabled = false;
  }

  enable() {
    this.isEnabled = true;
  }
}

export const logger = new Logger();

/**
 * Checkout-specific logger with strong typing
 */
export const checkoutLogger = {
  started: (context?: { productsCount?: number }) => {
    logger.info('checkout_started', context);
  },

  validationError: (errors: string[]) => {
    logger.warn('checkout_form_validation_error', {
      errorsCount: errors.length,
      errorTypes: errors,
    });
  },

  cepLookupSuccess: (cep: string, address: { city: string; state: string }) => {
    logger.info('checkout_cep_lookup_success', {
      cepRegion: sanitizePII.cep(cep),
      city: address.city,
      state: address.state,
    });
  },

  cepLookupError: (cep: string, error: string) => {
    logger.error('checkout_cep_lookup_error', {
      cepRegion: sanitizePII.cep(cep),
      error,
    });
  },

  couponApplied: (code: string, discountAmount: number, totalBefore: number) => {
    logger.info('checkout_coupon_applied', {
      couponCode: code,
      discountAmount: discountAmount / 100,
      totalBefore: totalBefore / 100,
      totalAfter: (totalBefore - discountAmount) / 100,
    });
  },

  couponError: (code: string, error: string) => {
    logger.warn('checkout_coupon_error', {
      couponCode: code,
      error,
    });
  },

  /**
   * Critical event: captures complete checkout payload with sanitized PII
   */
  submitted: (payload: {
    subtotal: number;
    shipping: number;
    discount: number;
    total: number;
    itemsCount: number;
    deliveryOption: string;
    hasCoupon: boolean;
    couponCode?: string;
    emailDomain: string;
    cepRegion: string;
    timeOnPage: number;
  }) => {
    logger.info('checkout_submitted', payload);
  },

  success: (orderId: string, total: number, duration: number) => {
    logger.info('checkout_success', {
      orderId,
      total: total / 100,
      durationSeconds: duration,
    });
  },

  error: (error: string, context?: Record<string, any>) => {
    logger.error('checkout_error', {
      error,
      ...context,
    });
  },
};

/**
 * Performance measurement helper for async operations
 */
export const measurePerformance = <T>(
  operationName: string,
  fn: () => Promise<T>
): Promise<T> => {
  const startTime = performance.now();
  
  return fn()
    .then((result) => {
      const duration = performance.now() - startTime;
      logger.debug(`${operationName}_performance`, {
        durationMs: Math.round(duration),
      });
      return result;
    })
    .catch((error) => {
      const duration = performance.now() - startTime;
      logger.error(`${operationName}_error`, {
        durationMs: Math.round(duration),
        error: error.message,
      });
      throw error;
    });
};

export { sanitizePII, getSessionId };
