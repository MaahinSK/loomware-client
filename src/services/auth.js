import { initializeApp } from 'firebase/app';
import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut as firebaseSignOut
} from 'firebase/auth';
import api from './api';

// Hardcoded Firebase Config from user provided values
const firebaseConfig = {
    apiKey: "AIzaSyBeJcwtgcHbGQMK1TBaXIzh154ESb8zank",
    authDomain: "loomware-a50ce.firebaseapp.com",
    projectId: "loomware-a50ce",
    storageBucket: "loomware-a50ce.firebasestorage.app",
    messagingSenderId: "44276511742",
    appId: "1:44276511742:web:d5c18a7833622a6f66c6af"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export const registerWithEmailPassword = async (email, password) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error) {
        throw error;
    }
};

export const loginWithEmailPassword = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error) {
        throw error;
    }
};

export const signInWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;

        // Send token to backend
        const response = await api.post('/auth/google', {
            token: await user.getIdToken(),
            email: user.email,
            name: user.displayName,
            photoURL: user.photoURL,
        });

        return response.data;
    } catch (error) {
        throw error;
    }
};

export const signOut = () => {
    return firebaseSignOut(auth);
};

export { auth };