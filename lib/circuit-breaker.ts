/**
 * Circuit Breaker Pattern Implementation
 * Prevents cascading failures by stopping requests to failing services
 */

export interface CircuitBreakerOptions {
  failureThreshold: number; // Number of failures before opening circuit
  resetTimeout: number; // Milliseconds before attempting to reset
  monitoringPeriod: number; // Time window for failure counting
}

export interface CircuitBreakerState {
  state: 'closed' | 'open' | 'half-open';
  failures: number;
  lastFailureTime: number | null;
  successCount: number;
}

const defaultOptions: CircuitBreakerOptions = {
  failureThreshold: 5,
  resetTimeout: 60000, // 1 minute
  monitoringPeriod: 60000, // 1 minute window
};

class CircuitBreaker {
  private state: CircuitBreakerState;
  private options: CircuitBreakerOptions;
  private failureTimestamps: number[] = [];

  constructor(options: Partial<CircuitBreakerOptions> = {}) {
    this.options = { ...defaultOptions, ...options };
    this.state = {
      state: 'closed',
      failures: 0,
      lastFailureTime: null,
      successCount: 0,
    };
  }

  /**
   * Execute a function with circuit breaker protection
   */
  async execute<T>(fn: () => Promise<T>): Promise<T> {
    // Check if circuit should be opened/closed
    this.updateState();

    if (this.state.state === 'open') {
      throw new Error('Circuit breaker is OPEN - service unavailable');
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  /**
   * Update circuit breaker state based on current conditions
   */
  private updateState(): void {
    const now = Date.now();

    // Clean up old failure timestamps
    this.failureTimestamps = this.failureTimestamps.filter(
      (timestamp) => now - timestamp < this.options.monitoringPeriod,
    );

    // Update failure count
    this.state.failures = this.failureTimestamps.length;

    // State machine transitions
    if (this.state.state === 'open') {
      // Check if reset timeout has passed
      if (
        this.state.lastFailureTime &&
        now - this.state.lastFailureTime >= this.options.resetTimeout
      ) {
        this.state.state = 'half-open';
        this.state.successCount = 0;
      }
    } else if (this.state.state === 'half-open') {
      // Stay in half-open until we have enough successes or a failure
      if (this.state.successCount >= 3) {
        this.state.state = 'closed';
        this.state.failures = 0;
        this.failureTimestamps = [];
      }
    } else if (this.state.state === 'closed') {
      // Check if we should open the circuit
      if (this.state.failures >= this.options.failureThreshold) {
        this.state.state = 'open';
        this.state.lastFailureTime = now;
      }
    }
  }

  /**
   * Handle successful request
   */
  private onSuccess(): void {
    if (this.state.state === 'half-open') {
      this.state.successCount++;
    } else if (this.state.state === 'closed') {
      // Reset failure count on success (optimistic)
      this.failureTimestamps = [];
      this.state.failures = 0;
    }
  }

  /**
   * Handle failed request
   */
  private onFailure(): void {
    const now = Date.now();
    this.failureTimestamps.push(now);
    this.state.failures = this.failureTimestamps.length;
    this.state.lastFailureTime = now;

    if (this.state.state === 'half-open') {
      // Failure in half-open state - go back to open
      this.state.state = 'open';
      this.state.successCount = 0;
    }
  }

  /**
   * Get current circuit breaker state
   */
  getState(): CircuitBreakerState {
    this.updateState();
    return { ...this.state };
  }

  /**
   * Manually reset circuit breaker (for admin use)
   */
  reset(): void {
    this.state = {
      state: 'closed',
      failures: 0,
      lastFailureTime: null,
      successCount: 0,
    };
    this.failureTimestamps = [];
  }
}

// Global circuit breakers for different services
export const circuitBreakers = {
  pvwatts: new CircuitBreaker({
    failureThreshold: 5,
    resetTimeout: 60000, // 1 minute
  }),
  eia: new CircuitBreaker({
    failureThreshold: 5,
    resetTimeout: 60000,
  }),
  supabase: new CircuitBreaker({
    failureThreshold: 10,
    resetTimeout: 30000, // 30 seconds
  }),
  stripe: new CircuitBreaker({
    failureThreshold: 5,
    resetTimeout: 30000,
  }),
  resend: new CircuitBreaker({
    failureThreshold: 5,
    resetTimeout: 60000,
  }),
};

/**
 * Execute function with circuit breaker for a specific service
 */
export async function withCircuitBreaker<T>(
  service: keyof typeof circuitBreakers,
  fn: () => Promise<T>,
): Promise<T> {
  return circuitBreakers[service].execute(fn);
}
