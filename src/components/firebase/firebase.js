import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, addDoc, getDocs, getDoc, setDoc, deleteDoc, doc } from "firebase/firestore";
import { serverTimestamp, query, where, onSnapshot, orderBy} from "firebase/firestore";
// Configuración de Firebase
const firebaseConfig = {
    //mis datos de api firebase
    apiKey: "AIzaSyBnwwG4C6qHMSHYLh1T1H9d20cC0ALgafI",
    authDomain: "cripto-facil.firebaseapp.com",
    projectId: "cripto-facil",
    storageBucket: "cripto-facil.firebasestorage.app",
    messagingSenderId: "168895192690",
    appId: "1:168895192690:web:50fc1e7ec6eeb5a44aeceb"
  };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const db = getFirestore(app);
export { db, collection, addDoc, getDocs, getDoc, setDoc, deleteDoc, doc, serverTimestamp, query, where, onSnapshot, orderBy,};

// Guardar un nuevo mensaje en la colección de mensajes del usuario
export const saveUserMessage = async (uid, text) => {
  try {
    const userMessagesRef = collection(db, "usuarios", uid, "mensajes");
    await addDoc(userMessagesRef, { text, timestamp: new Date() });
  } catch (error) {
    console.error("Error al guardar el mensaje:", error);
  }
};

// Obtener todos los mensajes del usuario
export const getUserMessages = async (uid) => {
  try {
    const userMessagesRef = collection(db, "usuarios", uid, "mensajes");
    const snapshot = await getDocs(userMessagesRef);
    return snapshot.docs.map(doc => doc.data()).sort((a, b) => a.timestamp - b.timestamp);
  } catch (error) {
    console.error("Error al obtener los mensajes:", error);
    return [];
  }
};
















