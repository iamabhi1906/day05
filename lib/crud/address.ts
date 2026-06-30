import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { db } from '../firebase';

export interface UserAddress {
  id: string;
  email: string;
  city: string;
  landmark: string;
  state: string;
  pinCode: number;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastUsed: Date | null;
}

const toDateValue = (value: unknown) => {
  if (value instanceof Date) return value;
  if (typeof value === 'object' && value !== null && 'toDate' in value && typeof (value as { toDate?: () => Date }).toDate === 'function') {
    return (value as { toDate: () => Date }).toDate();
  }
  if (typeof value === 'string' || typeof value === 'number') {
    return new Date(value);
  }
  return new Date();
};

const normalizeAddress = (snapshot: { id: string; data: () => Record<string, unknown> }): UserAddress => {
  const data = snapshot.data();
  return {
    id: snapshot.id,
    email: String(data.email ?? ''),
    city: String(data.city ?? ''),
    landmark: String(data.landmark ?? ''),
    state: String(data.state ?? ''),
    pinCode: Number(data.pinCode ?? 0),
    isDefault: Boolean(data.isDefault),
    createdAt: toDateValue(data.createdAt),
    updatedAt: toDateValue(data.updatedAt),
    lastUsed: data.lastUsed ? toDateValue(data.lastUsed) : null,
  };
};

const getAddressCollection = () => collection(db, 'addresses');

const resetOtherDefaults = async (email: string, skipAddressId?: string) => {
  const querySnapshot = await getDocs(query(getAddressCollection(), where('email', '==', email)));
  const updates = querySnapshot.docs
    .filter((addressDoc) => addressDoc.id !== skipAddressId && Boolean(addressDoc.data().isDefault))
    .map((addressDoc) => updateDoc(doc(db, 'addresses', addressDoc.id), { isDefault: false, updatedAt: new Date() }));

  await Promise.all(updates);
};

export const getUserAddresses = async (email: string): Promise<UserAddress[]> => {
  const querySnapshot = await getDocs(query(getAddressCollection(), where('email', '==', email)));
  return querySnapshot.docs.map(normalizeAddress).sort((left, right) => Number(right.isDefault) - Number(left.isDefault) || left.createdAt.getTime() - right.createdAt.getTime());
};

export const createUserAddress = async (email: string, address: Omit<UserAddress, 'id' | 'createdAt' | 'updatedAt' | 'lastUsed' | 'email'> & { isDefault?: boolean }) => {
  const now = new Date();
  const payload = {
    email,
    city: address.city,
    landmark: address.landmark,
    state: address.state,
    pinCode: address.pinCode,
    isDefault: Boolean(address.isDefault),
    createdAt: now,
    updatedAt: now,
    lastUsed: null,
  };

  if (payload.isDefault) {
    await resetOtherDefaults(email);
  }

  const documentRef = await addDoc(getAddressCollection(), payload);
  return {
    id: documentRef.id,
    ...payload,
  } as UserAddress;
};

export const updateUserAddress = async (email: string, addressId: string, updatedFields: Partial<Omit<UserAddress, 'id' | 'createdAt' | 'updatedAt' | 'lastUsed'>>) => {
  const addressRef = doc(db, 'addresses', addressId);
  const addressSnapshot = await getDoc(addressRef);

  if (!addressSnapshot.exists()) {
    throw new Error('Address not found.');
  }

  const existingAddress = addressSnapshot.data();
  if (existingAddress.email !== email) {
    throw new Error('You can only edit your own addresses.');
  }

  const nextPayload = {
    ...updatedFields,
    updatedAt: new Date(),
  };

  if (nextPayload.isDefault) {
    await resetOtherDefaults(email, addressId);
  }

  await updateDoc(addressRef, nextPayload);

  const updatedSnapshot = await getDoc(addressRef);
  return normalizeAddress({ id: updatedSnapshot.id, data: () => updatedSnapshot.data()! });
};

export const setDefaultAddress = async (email: string, addressId: string) => {
  const addressRef = doc(db, 'addresses', addressId);
  const addressSnapshot = await getDoc(addressRef);

  if (!addressSnapshot.exists()) {
    throw new Error('Address not found.');
  }

  if (addressSnapshot.data().email !== email) {
    throw new Error('You can only change your own address.');
  }

  await resetOtherDefaults(email, addressId);
  await updateDoc(addressRef, { isDefault: true, updatedAt: new Date() });
};

export const deleteUserAddress = async (email: string, addressId: string) => {
  const addressRef = doc(db, 'addresses', addressId);
  const addressSnapshot = await getDoc(addressRef);

  if (!addressSnapshot.exists()) {
    return;
  }

  const existingAddress = addressSnapshot.data();
  if (existingAddress.email !== email) {
    throw new Error('You can only delete your own addresses.');
  }

  await deleteDoc(addressRef);

  const remainingAddresses = await getUserAddresses(email);
  const shouldAssignDefault = existingAddress.isDefault && remainingAddresses.length > 0 && !remainingAddresses.some((address) => address.isDefault);
  if (shouldAssignDefault) {
    await setDefaultAddress(email, remainingAddresses[0].id);
  }
};