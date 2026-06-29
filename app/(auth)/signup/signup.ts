import { auth } from '@/lib/firebase';
import { FirebaseError } from 'firebase/app';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { createSession } from '../auth-session';
import { createUser } from '@/lib/crud/user';

export async function EmailSignup(name: string, email: string, password: string, role: string) {
  try {
    if (!name.trim() || !email || !password) {
      throw new Error('Please fill in all fields!');
    }
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters!');
    }
    if (!role) {
      throw new Error('Please provide a valid role!');
    }
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const user = await createUser(result.user, role, name);
    const idToken = await result.user.getIdToken();
    await createSession(idToken);
  } catch (error: unknown) {
    if (error instanceof FirebaseError && error.code === 'auth/email-already-in-use') {
      throw new Error('Email already in use');
    } else if (error instanceof FirebaseError && error.code === 'auth/invalid-email') {
      throw new Error('Invalid email format');
    } else if (error instanceof FirebaseError && error.code === 'auth/weak-password') {
      throw new Error('Password is too weak');
    } else {
      console.log(error);
      throw Error('Signup failed');
    }
  }
}
