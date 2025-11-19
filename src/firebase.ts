// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"; // Importante para o login!
import { getStorage } from "firebase/storage";

// Suas variáveis de ambiente (configuradas no Project IDX ou .env)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY || "SUA_API_KEY_AQUI",
  authDomain: import.meta.env.VITE_AUTH_DOMAIN || "SEU_PROJECT_ID.firebaseapp.com",
  projectId: import.meta.env.VITE_PROJECT_ID || "SEU_PROJECT_ID",
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET || "SEU_PROJECT_ID.appspot.com",
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Exporta os serviços para serem usados no resto do app
export const db = getFirestore(app);
export const auth = getAuth(app); // Agora exportamos o Auth também
export const storage = getStorage(app);
export default app;