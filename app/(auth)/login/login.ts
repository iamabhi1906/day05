import { auth } from '@/lib/firebase';
import { FirebaseError } from 'firebase/app';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { createSession } from '../auth-session';

export const EmailLogin = async (email: string, password: string): Promise<string | null> => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    const idToken = await result.user.getIdToken();
    await createSession(idToken);
    return null;
  } catch (error: unknown) {
    let message = 'Login failed';
    if (error instanceof FirebaseError) {
      switch (error.code) {
        case 'auth/invalid-credential':
        case 'auth/user-not-found':
        case 'auth/wrong-password':
          message = 'Incorrect email or password.';
          break;
        case 'auth/invalid-email':
          message = 'Invalid email format.';
          break;
        case 'auth/user-disabled':
          message = 'This account has been disabled.';
          break;
        case 'auth/too-many-requests':
          message = 'Too many failed attempts. Try again later.';
          break;
      }
    }
    throw new Error(message);
  }
};
