import type { DecodedIdToken } from 'firebase-admin/auth';
import { cookies } from 'next/headers';
import { adminAuth } from './firebase-admin';
import { getUserByEmail } from './crud/user';

export async function getSession(): Promise<DecodedIdToken | null> {
  const storedCookies = await cookies();
  const session = storedCookies.get('session')?.value;
  if (!session) return null;

  try {
    const decodedToken = await adminAuth.verifyIdToken(session, true);
    return decodedToken;
  } catch (error) {
    console.error('Error getting the session:- ', error);
    return null;
  }
}

export async function Protect() {
  console.log('Protected route is called');
  const session = await getSession();
  if (!session || !session.email) throw new Error('Unauthorized');
  const user = await getUserByEmail(session.email);
  if (!user || !user.email) throw new Error('Unauthorized');
  if (user.isBlocked) throw new Error('You are blocked..!!');
  return user;
}

export async function VendorProtect() {
  console.log('Protected route is called');
  const session = await getSession();
  if (!session || !session.email) throw new Error('Unauthorized');
  const user = await getUserByEmail(session.email);
  if (!user) throw new Error('Unauthorized');
  if (user.isBlocked) throw new Error('You are blocked..!!');
  if (user.role !== 'vendor') throw new Error('Unauthorized');
  return user;
}

export async function AdminProtect() {
  console.log('Protected route is called');
  const session = await getSession();
  if (!session || !session.email) throw new Error('Unauthorized');
  const user = await getUserByEmail(session.email);
  if (!user) throw new Error('Unauthorized');
  if (user.isBlocked) throw new Error('You are blocked..!!');
  if (user.role !== 'admin') throw new Error('Unauthorized');
  return user;
}
