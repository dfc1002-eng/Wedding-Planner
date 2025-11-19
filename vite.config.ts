import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      // Configurações do servidor
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      // Configuração do Preview (Cloud Run / Firebase)
      preview: {
        port: 8080,
        host: '0.0.0.0',
        allowedHosts: true,
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          // CORREÇÃO AQUI: Usamos resolve('.') em vez de __dirname
          '@': path.resolve('.'),
        }
      },
      build: {
        outDir: 'build',
      },
    };
});