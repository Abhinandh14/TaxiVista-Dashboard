// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyDg9vkDHhgiTUVowruUM0LG5xe8RXv3bkE",
  authDomain: "project-f68a8.firebaseapp.com",
  projectId: "project-f68a8",
  storageBucket: "project-f68a8.appspot.com",
  messagingSenderId: "913294328046",
  appId: "1:913294328046:web:baa7aa64bec3d1958b33ff",
  measurementId: "G-9652YKVNZ2"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export { auth,analytics };