import { createUser, getUserByEmail } from '@/lib/crud/user';
import { auth } from '@/lib/firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

export const createSession = async (idToken: string) => {
  const res = await fetch('/api/session', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  });
  if (!res.ok) {
    throw new Error('Failed to create session');
  }
};

export const GoogleLogin = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const idToken = await result.user.getIdToken();
    await createSession(idToken);
    if (!result.user.email) return;
    const user = await getUserByEmail(result.user.email);
    if (!user) {
      const user = await createUser(result.user, null);
      return user;
    } else {
      return user;
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};
