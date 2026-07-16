// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";
import { getRemoteConfig } from "firebase/remote-config";

const firebaseConfig = {
  apiKey: "AIzaSyC-pjnFfWe4-cg9cni16sxxPddMwYlJMgs",
  authDomain: "wedding-plannergit-68205-af271.firebaseapp.com",
  projectId: "wedding-plannergit-68205-af271",
  storageBucket: "wedding-plannergit-68205-af271.firebasestorage.app",
  messagingSenderId: "581404955656",
  appId: "1:581404955656:web:ceb95e71dd7f070ed92dbd"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Exporta os serviços
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

// Serviços com verificação de SSR (Server-Side Rendering)
export const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;
export const remoteConfig = typeof window !== "undefined" ? getRemoteConfig(app) : null;

// Configuração padrão do Remote Config
if (remoteConfig) {
  remoteConfig.settings.minimumFetchIntervalMillis = 300000; // 5 minutos para atualizar rápido em testes
  remoteConfig.defaultConfig = {
    landing_slogan: "Planejando o Casamento dos meus Sonhos"
  };
}

export default app;