import { getSession } from './auth';

/**
 * Protects server-side functions - verifies user is logged in before executing
 * @param fn - Async function to protect
 * @returns Protected function that checks auth before execution
 */
export async function protectFunction<T extends any[], R>(
  fn: (...args: T) => Promise<R>
): Promise<R> {
  const session = await getSession();
  if (!session || !session.email) {
    throw new Error('Unauthorized: User not logged in');
  }
  return fn as any;
}

/**
 * Wraps a CRUD function to ensure user is authenticated
 * Usage: const protected = withAuthCheck(getCartItems);
 * const items = await protected(email);
 */
export function withAuthCheck<T extends (...args: any[]) => Promise<any>>(
  fn: T
): T {
  return (async (...args: any[]) => {
    const session = await getSession();
    if (!session || !session.email) {
      throw new Error('Unauthorized: User not logged in. Please login first.');
    }
    return fn(...args);
  }) as T;
}
