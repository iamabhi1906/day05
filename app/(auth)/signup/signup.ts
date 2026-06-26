import { auth, db } from '@/lib/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { createSession } from '../auth-session';
import { createUser } from '@/lib/crud/user';

export async function EmailSignup(email: string, password: string, role: string) {
  try {
    if (!email || !password) {
      throw new Error('Please fill in all fields!');
    }
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters!');
    }
    if (!role) {
      throw new Error('Please provide a valid role!');
    }
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const user = await createUser(result.user, role);
    console.log(user);
    const idToken = await result.user.getIdToken();
    await createSession(idToken);
  } catch (error: any) {
    if (error.code === 'auth/email-already-in-use') {
      throw new Error('Email already in use');
    } else if (error.code === 'auth/invalid-email') {
      throw new Error('Invalid email format');
    } else if (error.code === 'auth/weak-password') {
      throw new Error('Password is too weak');
    } else {
      console.log(error);
      throw Error('Signup failed');
    }
  }
}
