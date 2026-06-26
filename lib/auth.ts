import type { DecodedIdToken } from 'firebase-admin/auth';
import { cookies } from 'next/headers';
import { adminAuth } from './firebase-admin';

export async function getSession(): Promise<DecodedIdToken | null> {
  const storedCookies = await cookies();
  const session = storedCookies.get('session')?.value;
  if (!session) return null;

  try {
    const decodedToken = await adminAuth.verifyIdToken(session, true);
    return decodedToken;
  } catch (error) {
    return null;
  }
}
