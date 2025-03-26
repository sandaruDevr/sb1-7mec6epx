import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyCeXBO5DQJvdmqaqV4I-m0UwdZrzGZz9ZQ",
  authDomain: "summarygg-e8313.firebaseapp.com",
  databaseURL: "https://summarygg-e8313-default-rtdb.firebaseio.com",
  projectId: "summarygg-e8313",
  storageBucket: "summarygg-e8313.appspot.com",
  messagingSenderId: "84366718462",
  appId: "1:84366718462:web:3e83992bb196bdf264fcaf",
  measurementId: "G-WFD5WT9EJ2"
};

const app = initializeApp(firebaseConfig);

// Initialize Database with persistence enabled
const database = getDatabase(app);

export const auth = getAuth(app);
export { database };