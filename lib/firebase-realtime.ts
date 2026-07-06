import { getDatabase } from 'firebase/database';
import { app } from './firebase';

const realtimeDatabaseUrl = process.env.NEXT_PUBLIC_REALTIME_DATABASE;

export const getRealtimeDatabase = () => getDatabase(app, realtimeDatabaseUrl);

export const realTimeDB = getRealtimeDatabase();
