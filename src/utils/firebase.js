import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyBSdLycG2gX3x_OWXMHLVBPIQtY92kS3Rs',
  authDomain: 'bio-auth-d5bdb.firebaseapp.com',
  projectId: 'bio-auth-d5bdb',
  storageBucket: 'bio-auth-d5bdb.appspot.com',
  messagingSenderId: '666946765794',
  appId: '1:666946765794:web:fed831d77ffc9a04c42fbb',
  measurementId: 'G-N88HW1LGK2',
};

export const firebaseApp = initializeApp(firebaseConfig);

export const firebaseAuth = getAuth();
