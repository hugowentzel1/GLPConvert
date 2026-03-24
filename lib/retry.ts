export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 250
): Promise<T> {
  let lastError: Error;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt === maxRetries) {
        throw lastError;
      }
      
      const delay = baseDelay * Math.pow(2, attempt);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError!;
}

export async function retryPVWatts<T>(fn: () => Promise<T>): Promise<T> {
  return retryWithBackoff(fn, 3, 250);
}

export async function retryEIA<T>(fn: () => Promise<T>): Promise<T> {
  return retryWithBackoff(fn, 3, 250);
}
