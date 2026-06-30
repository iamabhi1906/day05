import { UserInfo } from 'firebase/auth';
import { db } from '../firebase';
import { addDoc, collection, doc, getDoc, getDocs, query, updateDoc, where } from 'firebase/firestore';

export interface UserData {
  id: string;
  email: string;
  role: string;
  uid: string;
  name: string | null;
  avatar: string | null;
  phone: string | null;
  createdAt: Date;
  isBlocked: boolean;
}

const toDateValue = (value: unknown) => {
  if (value instanceof Date) return value;
  if (typeof value === 'object' && value !== null && 'toDate' in value && typeof (value as { toDate?: () => Date }).toDate === 'function') {
    return (value as { toDate: () => Date }).toDate();
  }
  return new Date();
};

export const createUser = async (user: UserInfo, role: string | null, name?: string) => {
  if (!user.email) return;
  const normalizedName = name?.trim() || user.displayName || null;

  try {
    const newUser = {
      email: user.email,
      role,
      uid: user.uid,
      name: normalizedName,
      avatar: user.photoURL,
      phone: user.phoneNumber,
      createdAt: new Date(),
      isBlocked: false,
    };
    const docRef = await addDoc(collection(db, 'users'), newUser);
    return { id: docRef.id, ...newUser };
  } catch (error) {}
  const data = await addDoc(collection(db, 'users'), {
    email: user.email,
    role,
    uid: user.uid,
    name: normalizedName,
    avatar: user.photoURL,
    phone: user.phoneNumber,
    createdAt: new Date(),
    isBlocked: false,
  });
  return data;
};

export const getUserByEmail = async (email: string): Promise<UserData | null> => {
  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', email));
    const result = await getDocs(q);
    if (result.empty) {
      return null;
    }
    const userDoc = result.docs[0];
    const data = userDoc.data();
    return {
      id: userDoc.id,
      email: data.email,
      role: data.role,
      uid: data.uid,
      name: data.name,
      avatar: data.avatar,
      phone: data.phone,
      createdAt: toDateValue(data.createdAt),
      isBlocked: data.isBlocked,
    };
  } catch (error) {
    console.error('Error fetching user by email:', error);
    return null;
  }
};

export const updateUserByEmail = async (
  email: string,
  updatedFields: Partial<Omit<UserData, 'id' | 'createdAt' | 'email'>>,
): Promise<UserData | null> => {
  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      throw new Error('No User Found.!!');
    }

    const userDoc = querySnapshot.docs[0];
    const userDocRef = doc(db, 'users', userDoc.id);
    await updateDoc(userDocRef, updatedFields);

    const freshSnapshot = await getDoc(userDocRef);
    const data = freshSnapshot.data()!;

    return {
      id: freshSnapshot.id,
      email: data.email,
      role: data.role,
      uid: data.uid,
      name: data.name,
      avatar: data.avatar,
      phone: data.phone,
      createdAt: toDateValue(data.createdAt),
      isBlocked: data.isBlocked,
    };
  } catch (error) {
    console.error('Error updating user by email:', error);
    return null;
  }
};
